#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

// Configuration
const ARCHIVE_URL = 'https://www.jvs.org.uk/the-jewish-vegetarian-magazine/';
const DOWNLOADS_DIR = './downloads';
const R2_BUCKET = 'jvs-magazines';
const BASE_URL = 'https://media.jvs.org.uk';

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Helper function to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file async
      reject(err);
    });
  });
}

// Helper function to extract date from title
function extractDate(title) {
  const datePatterns = [
    /(\d{4})/, // Year
    /(spring|summer|autumn|winter|fall)\s*(\d{4})/i, // Season + Year
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{4})/i, // Month + Year
  ];

  for (const pattern of datePatterns) {
    const match = title.match(pattern);
    if (match) {
      if (match[1] && match[2]) {
        // Season or month + year
        const season = match[1].toLowerCase();
        const year = match[2];
        
        if (['spring', 'summer', 'autumn', 'winter', 'fall'].includes(season)) {
          const monthMap = { spring: '04', summer: '07', autumn: '10', fall: '10', winter: '01' };
          return `${year}-${monthMap[season]}-01`;
        } else {
          const monthMap = {
            january: '01', february: '02', march: '03', april: '04',
            may: '05', june: '06', july: '07', august: '08',
            september: '09', october: '10', november: '11', december: '12'
          };
          return `${year}-${monthMap[season.toLowerCase()]}-01`;
        }
      } else if (match[1]) {
        // Just year
        return `${match[1]}-01-01`;
      }
    }
  }
  
  // Default to current date if no pattern matches
  return new Date().toISOString().split('T')[0];
}

// Helper function to generate clean ID
function generateId(title, date) {
  const year = date.split('-')[0];
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  return `${cleanTitle}-${year}`;
}

// Helper function to run OCR on PDF
function runOCR(inputPath, outputPath) {
  try {
    console.log(`Running OCR on ${inputPath}...`);
    execSync(`ocrmypdf --sidecar ${outputPath}.txt ${inputPath} ${outputPath}`, {
      stdio: 'inherit'
    });
    
    // Read the extracted text
    const textPath = `${outputPath}.txt`;
    if (fs.existsSync(textPath)) {
      return fs.readFileSync(textPath, 'utf8');
    }
    return '';
  } catch (error) {
    console.error(`OCR failed for ${inputPath}:`, error.message);
    return '';
  }
}

// Helper function to upload to R2
function uploadToR2(filepath, r2Key) {
  try {
    console.log(`Uploading ${filepath} to R2 as ${r2Key}...`);
    execSync(`npx wrangler r2 object put ${R2_BUCKET}/${r2Key} --file=${filepath}`, {
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    console.error(`Upload failed for ${filepath}:`, error.message);
    return false;
  }
}

// Helper function to insert into D1 database
function insertIntoDatabase(issue) {
  try {
    console.log(`Inserting ${issue.id} into database...`);
    
    // Create SQL file for the insert
    const sql = `
      INSERT OR REPLACE INTO magazine_issues (id, title, date, r2_key, ocr_text, summary)
      VALUES ('${issue.id}', '${issue.title.replace(/'/g, "''")}', '${issue.date}', '${issue.r2_key}', '${issue.ocr_text.replace(/'/g, "''")}', '${issue.summary.replace(/'/g, "''")}');
      
      INSERT OR REPLACE INTO magazine_fts (rowid, title, ocr_text)
      SELECT rowid, title, ocr_text FROM magazine_issues WHERE id = '${issue.id}';
    `;
    
    const sqlFile = `./temp_insert_${issue.id}.sql`;
    fs.writeFileSync(sqlFile, sql);
    
    execSync(`npx wrangler d1 execute jvs-magazine-db --file=${sqlFile}`, {
      stdio: 'inherit'
    });
    
    // Clean up
    fs.unlinkSync(sqlFile);
    return true;
  } catch (error) {
    console.error(`Database insert failed for ${issue.id}:`, error.message);
    return false;
  }
}

// Main scraping function
async function scrapeMagazineArchive() {
  console.log('Starting JVS Magazine Archive scraping...');
  
  try {
    // Fetch the archive page
    console.log(`Fetching ${ARCHIVE_URL}...`);
    const html = await new Promise((resolve, reject) => {
      https.get(ARCHIVE_URL, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
    
    // Parse HTML
    const $ = cheerio.load(html);
    const magazines = [];
    
    // Find PDF links (adjust selector based on actual page structure)
    $('a[href*=".pdf"]').each((i, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const title = $link.text().trim() || $link.attr('title') || 'Untitled';
      
      if (href && href.includes('.pdf')) {
        const fullUrl = href.startsWith('http') ? href : `https://www.jvs.org.uk${href}`;
        magazines.push({ url: fullUrl, title });
      }
    });
    
    console.log(`Found ${magazines.length} magazine PDFs`);
    
    const results = {
      successful: 0,
      errors: 0,
      skipped: 0
    };
    
    // Process each magazine
    for (const magazine of magazines) {
      try {
        console.log(`\nProcessing: ${magazine.title}`);
        
        // Extract date and generate ID
        const date = extractDate(magazine.title);
        const id = generateId(magazine.title, date);
        const filename = `${id}.pdf`;
        const localPath = path.join(DOWNLOADS_DIR, filename);
        const ocrPath = path.join(DOWNLOADS_DIR, `${id}-ocr.pdf`);
        
        // Check if already processed
        if (fs.existsSync(localPath)) {
          console.log(`Skipping ${filename} - already exists`);
          results.skipped++;
          continue;
        }
        
        // Download PDF
        console.log(`Downloading ${magazine.url}...`);
        await downloadFile(magazine.url, localPath);
        
        // Run OCR
        const ocrText = runOCR(localPath, ocrPath);
        
        // Upload original PDF to R2
        const originalR2Key = `original/${filename}`;
        const originalUploaded = uploadToR2(localPath, originalR2Key);
        
        // Upload OCR'd PDF to R2
        const ocrR2Key = filename;
        const ocrUploaded = uploadToR2(ocrPath, ocrR2Key);
        
        if (originalUploaded && ocrUploaded) {
          // Insert into database
          const issue = {
            id,
            title: magazine.title,
            date,
            r2_key: ocrR2Key,
            ocr_text: ocrText,
            summary: magazine.title // Simple summary for now
          };
          
          const dbInserted = insertIntoDatabase(issue);
          
          if (dbInserted) {
            results.successful++;
            console.log(`✅ Successfully processed ${id}`);
          } else {
            results.errors++;
            console.log(`❌ Database insert failed for ${id}`);
          }
        } else {
          results.errors++;
          console.log(`❌ Upload failed for ${id}`);
        }
        
        // Clean up local files
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        if (fs.existsSync(ocrPath)) fs.unlinkSync(ocrPath);
        if (fs.existsSync(`${ocrPath}.txt`)) fs.unlinkSync(`${ocrPath}.txt`);
        
      } catch (error) {
        console.error(`Error processing ${magazine.title}:`, error.message);
        results.errors++;
      }
    }
    
    // Print final report
    console.log('\n=== SCRAPING REPORT ===');
    console.log(`Successful: ${results.successful}`);
    console.log(`Errors: ${results.errors}`);
    console.log(`Skipped: ${results.skipped}`);
    console.log(`Total: ${magazines.length}`);
    
  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  }
}

// Run the scraper
if (require.main === module) {
  scrapeMagazineArchive();
}

module.exports = { scrapeMagazineArchive }; 