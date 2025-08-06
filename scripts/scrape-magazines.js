const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const pdfParse = require('pdf-parse');

const ARCHIVE_URL = 'https://www.jvs.org.uk/the-jewish-vegetarian-magazine/';
const DOWNLOADS_DIR = './downloads';
const TEMP_DIR = './temp';

// Ensure directories exist
fs.ensureDirSync(DOWNLOADS_DIR);
fs.ensureDirSync(TEMP_DIR);

async function scrapeMagazineLinks() {
  console.log('🔍 Scraping magazine links from:', ARCHIVE_URL);
  
  try {
    const response = await axios.get(ARCHIVE_URL);
    const $ = cheerio.load(response.data);
    
    const magazines = [];
    
    // Look for PDF links in the content
    $('a[href*=".pdf"]').each((i, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const title = $link.text().trim() || $link.attr('title') || 'Unknown Title';
      
      if (href && href.includes('.pdf')) {
        // Extract filename from URL
        const filename = path.basename(href);
        
        // Generate clean ID from filename or title
        let id = filename.replace('.pdf', '').toLowerCase();
        id = id.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        
        // Try to extract date from title or filename
        let date = '1990-01-01'; // Default date
        const dateMatch = title.match(/(\d{4})/);
        if (dateMatch) {
          const year = dateMatch[1];
          // Try to extract season/month
          if (title.toLowerCase().includes('spring')) {
            date = `${year}-03-21`;
          } else if (title.toLowerCase().includes('summer')) {
            date = `${year}-06-21`;
          } else if (title.toLowerCase().includes('autumn') || title.toLowerCase().includes('fall')) {
            date = `${year}-09-21`;
          } else if (title.toLowerCase().includes('winter')) {
            date = `${year}-12-21`;
          } else {
            date = `${year}-01-01`;
          }
        }
        
        magazines.push({
          id,
          title,
          date,
          pdfUrl: href.startsWith('http') ? href : `https://www.jvs.org.uk${href}`,
          filename
        });
      }
    });
    
    console.log(`📚 Found ${magazines.length} magazine issues`);
    return magazines;
    
  } catch (error) {
    console.error('❌ Error scraping magazine links:', error.message);
    return [];
  }
}

async function downloadPDF(magazine) {
  const localPath = path.join(DOWNLOADS_DIR, magazine.filename);
  
  try {
    console.log(`⬇️  Downloading: ${magazine.title}`);
    
    const response = await axios({
      method: 'GET',
      url: magazine.pdfUrl,
      responseType: 'stream',
      timeout: 30000
    });
    
    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Downloaded: ${magazine.filename}`);
        resolve(localPath);
      });
      writer.on('error', reject);
    });
    
  } catch (error) {
    console.error(`❌ Failed to download ${magazine.filename}:`, error.message);
    return null;
  }
}

async function uploadToR2(localPath, r2Key) {
  try {
    console.log(`☁️  Uploading to R2: ${r2Key}`);
    
    const command = `npx wrangler r2 object put ${r2Key} --file=${localPath} --remote`;
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ Uploaded: ${r2Key}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to upload ${r2Key}:`, error.message);
    return false;
  }
}

async function extractPDFText(inputPath) {
  try {
    console.log(`🔍 Extracting text from: ${path.basename(inputPath)}`);
    
    // Read the PDF file
    const dataBuffer = await fs.readFile(inputPath);
    
    // Extract text from PDF
    const data = await pdfParse(dataBuffer);
    const text = data.text || '';
    
    console.log(`✅ Text extracted: ${text.length} characters`);
    return text;
    
  } catch (error) {
    console.error(`❌ Text extraction failed for ${path.basename(inputPath)}:`, error.message);
    return '';
  }
}

async function insertIntoDatabase(magazine, r2Key, ocrText) {
  try {
    console.log(`💾 Inserting into database: ${magazine.id}`);
    
    // Clean and escape text fields
    const escapedTitle = magazine.title.replace(/'/g, "''").replace(/[^\x20-\x7E]/g, '');
    const escapedOcrText = (ocrText || '').replace(/'/g, "''").replace(/[^\x20-\x7E]/g, '').substring(0, 100000); // Limit text length
    
    const sql = `
      INSERT INTO magazine_issues (id, title, date, r2_key, ocr_text)
      VALUES ('${magazine.id}', '${escapedTitle}', '${magazine.date}', '${r2Key}', '${escapedOcrText}')
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        date = excluded.date,
        r2_key = excluded.r2_key,
        ocr_text = excluded.ocr_text
    `;
    
    const command = `npx wrangler d1 execute jvs-magazine-db --command="${sql}" --remote`;
    
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ Database updated: ${magazine.id}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Database insert failed for ${magazine.id}:`, error.message);
    return false;
  }
}

async function updateFTSIndex(magazineId) {
  try {
    console.log(`🔍 Updating FTS index for: ${magazineId}`);
    
    const sql = `
      INSERT INTO magazine_fts (rowid, title, ocr_text)
      SELECT rowid, title, ocr_text FROM magazine_issues WHERE id = '${magazineId}'
    `;
    
    const command = `npx wrangler d1 execute jvs-magazine-db --command="${sql}" --remote`;
    
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ FTS index updated: ${magazineId}`);
    return true;
    
  } catch (error) {
    console.error(`❌ FTS index update failed for ${magazineId}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting JVS Magazine Archive Scraping and Upload');
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  const results = {
    total: 0,
    downloaded: 0,
    uploaded: 0,
    ocrProcessed: 0,
    databaseInserted: 0,
    errors: []
  };
  
  try {
    // Step 1: Scrape magazine links
    const magazines = await scrapeMagazineLinks();
    results.total = magazines.length;
    
    if (magazines.length === 0) {
      console.log('❌ No magazines found. Exiting.');
      return;
    }
    
    // Step 2: Process each magazine
    for (const magazine of magazines) {
      try {
        console.log(`\n📖 Processing: ${magazine.title}`);
        
        // Download PDF
        const localPath = await downloadPDF(magazine);
        if (!localPath) {
          results.errors.push(`Download failed: ${magazine.title}`);
          continue;
        }
        results.downloaded++;
        
        // Upload original PDF to R2
        const originalR2Key = `jvs-magazines/${magazine.filename}`;
        const uploadSuccess = await uploadToR2(localPath, originalR2Key);
        if (!uploadSuccess) {
          results.errors.push(`Upload failed: ${magazine.title}`);
          continue;
        }
        results.uploaded++;
        
        // Extract text from PDF
        const ocrText = await extractPDFText(localPath);
        if (ocrText.length > 0) {
          results.ocrProcessed++;
        }
        
        // Insert into database
        const dbSuccess = await insertIntoDatabase(magazine, originalR2Key, ocrText);
        if (dbSuccess) {
          results.databaseInserted++;
          
          // Update FTS index as per specification
          await updateFTSIndex(magazine.id);
        }
        
        // Clean up temp files
        // (No OCR files to clean up anymore)
        
      } catch (error) {
        console.error(`❌ Error processing ${magazine.title}:`, error.message);
        results.errors.push(`Processing error: ${magazine.title} - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    results.errors.push(`Fatal error: ${error.message}`);
  }
  
  // Report results
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n' + '=' .repeat(60));
  console.log('📊 PROCESSING COMPLETE');
  console.log('=' .repeat(60));
  console.log(`⏱️  Duration: ${duration} seconds`);
  console.log(`📚 Total magazines found: ${results.total}`);
  console.log(`⬇️  Successfully downloaded: ${results.downloaded}`);
  console.log(`☁️  Successfully uploaded: ${results.uploaded}`);
  console.log(`🔍 OCR processed: ${results.ocrProcessed}`);
  console.log(`💾 Database inserted: ${results.databaseInserted}`);
  
  if (results.errors.length > 0) {
    console.log(`\n❌ Errors (${results.errors.length}):`);
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  console.log('\n🎉 Magazine archive processing complete!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { scrapeMagazineLinks, downloadPDF, uploadToR2, extractPDFText, insertIntoDatabase, updateFTSIndex }; 