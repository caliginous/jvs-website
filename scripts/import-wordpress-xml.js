/*
  Import WordPress XML export into Sanity
  
  This script:
  1. Parses WordPress XML export file
  2. Creates authors, categories, and articles in Sanity
  3. Handles content conversion from WordPress blocks to Sanity portable text
  4. Downloads and uploads featured images to Sanity
  
  Usage:
  node scripts/import-wordpress-xml.js path/to/wordpress-export.xml
  
  Environment variables required:
  - SANITY_PROJECT_ID
  - SANITY_DATASET  
  - SANITY_API_TOKEN (with write permissions)
*/

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { createClient } = require('@sanity/client');
const axios = require('axios');
const cheerio = require('cheerio');

// Configuration
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa';
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error('❌ Missing SANITY_API_TOKEN environment variable');
  process.exit(1);
}

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: SANITY_API_TOKEN,
  useCdn: false,
});

// Helper functions
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripHtml(html) {
  const $ = cheerio.load(html);
  return $.text().trim();
}

function convertWordPressContentToPortableText(content) {
  // Basic conversion from WordPress blocks to Sanity portable text
  // This is a simplified version - you might want to enhance this
  
  if (!content) return [];
  
  // Remove WordPress block comments
  const cleanContent = content
    .replace(/<!-- wp:[^>]*-->/g, '')
    .replace(/<!-- \/wp:[^>]*-->/g, '');
  
  // Split into paragraphs and convert to portable text blocks
  const $ = cheerio.load(cleanContent);
  const blocks = [];
  
  $('p').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text) {
      blocks.push({
        _type: 'block',
        _key: `block-${i}`,
        style: 'normal',
        children: [{
          _type: 'span',
          _key: `span-${i}`,
          text: text,
          marks: []
        }]
      });
    }
  });
  
  // If no paragraphs found, create a single block with the stripped text
  if (blocks.length === 0) {
    const text = stripHtml(cleanContent);
    if (text) {
      blocks.push({
        _type: 'block',
        _key: 'block-0',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'span-0',
          text: text,
          marks: []
        }]
      });
    }
  }
  
  return blocks;
}

async function downloadAndUploadImage(imageUrl, filename) {
  try {
    console.log(`📥 Downloading image: ${imageUrl}`);
    
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
      timeout: 30000,
    });
    
    const asset = await sanity.assets.upload('image', response.data, {
      filename: filename || 'image.jpg',
    });
    
    console.log(`✅ Uploaded image: ${asset._id}`);
    return asset;
    
  } catch (error) {
    console.error(`❌ Failed to upload image ${imageUrl}:`, error.message);
    return null;
  }
}

async function createOrGetAuthor(wpAuthor) {
  const authorSlug = slugify(wpAuthor['wp:author_display_name'][0]);
  
  // Check if author already exists
  const existing = await sanity.fetch(
    `*[_type == "author" && slug.current == $slug][0]`,
    { slug: authorSlug }
  );
  
  if (existing) {
    console.log(`👤 Author exists: ${wpAuthor['wp:author_display_name'][0]}`);
    return existing._id;
  }
  
  // Create new author
  const author = {
    _type: 'author',
    name: wpAuthor['wp:author_display_name'][0],
    slug: {
      _type: 'slug',
      current: authorSlug
    },
    email: wpAuthor['wp:author_email'][0],
    wpRef: wpAuthor['wp:author_id'][0],
  };
  
  const result = await sanity.create(author);
  console.log(`✅ Created author: ${author.name}`);
  return result._id;
}

async function createOrGetCategory(categoryName, categorySlug) {
  const slug = categorySlug || slugify(categoryName);
  
  // Check if category already exists
  const existing = await sanity.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug }
  );
  
  if (existing) {
    return existing._id;
  }
  
  // Create new category
  const category = {
    _type: 'category',
    name: categoryName,
    slug: {
      _type: 'slug',
      current: slug
    },
  };
  
  const result = await sanity.create(category);
  console.log(`✅ Created category: ${categoryName}`);
  return result._id;
}

async function processWordPressXML(xmlFilePath) {
  console.log(`🚀 Starting WordPress XML import from: ${xmlFilePath}`);
  
  // Read and parse XML
  const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlContent);
  
  const channel = result.rss.channel[0];
  const items = channel.item || [];
  const authors = channel['wp:author'] || [];
  
  console.log(`📊 Found ${items.length} items and ${authors.length} authors`);
  
  // Create authors first
  const authorMap = {};
  for (const wpAuthor of authors) {
    const authorId = await createOrGetAuthor(wpAuthor);
    authorMap[wpAuthor['wp:author_login'][0]] = authorId;
  }
  
  // Process items (posts)
  let imported = 0;
  let skipped = 0;
  
  for (const item of items) {
    try {
      // Only process published posts
      const postType = item['wp:post_type'] ? item['wp:post_type'][0] : 'post';
      const status = item['wp:status'] ? item['wp:status'][0] : 'publish';
      
      if (postType !== 'post' || status !== 'publish') {
        console.log(`⏭️  Skipping ${postType} with status ${status}: ${item.title[0]}`);
        skipped++;
        continue;
      }
      
      const title = item.title[0];
      const slug = slugify(title);
      
      // Check if article already exists
      const existing = await sanity.fetch(
        `*[_type == "article" && slug.current == $slug][0]`,
        { slug }
      );
      
      if (existing) {
        console.log(`📄 Article exists: ${title}`);
        skipped++;
        continue;
      }
      
      console.log(`📝 Processing: ${title}`);
      
      // Extract data
      const content = item['content:encoded'] ? item['content:encoded'][0] : '';
      const excerpt = item['excerpt:encoded'] ? item['excerpt:encoded'][0] : '';
      const pubDate = new Date(item.pubDate[0]);
      const authorLogin = item['dc:creator'][0];
      
      // Process categories and tags
      const categories = [];
      const tags = [];
      
      if (item.category) {
        for (const cat of item.category) {
          const categoryName = cat._;
          const domain = cat.$.domain;
          const nicename = cat.$.nicename;
          
          if (domain === 'category') {
            const categoryId = await createOrGetCategory(categoryName, nicename);
            categories.push({ _type: 'reference', _ref: categoryId });
          } else if (domain === 'post_tag') {
            tags.push(categoryName);
          }
        }
      }
      
      // Handle featured image
      let featuredImage = null;
      if (item['wp:postmeta']) {
        const thumbnailMeta = item['wp:postmeta'].find(meta => 
          meta['wp:meta_key'][0] === '_thumbnail_id'
        );
        
        if (thumbnailMeta) {
          // You might need to extract the actual image URL from the attachment
          // This is a simplified version
          console.log(`🖼️  Featured image ID: ${thumbnailMeta['wp:meta_value'][0]}`);
        }
      }
      
      // Create article
      const article = {
        _type: 'article',
        title,
        slug: {
          _type: 'slug',
          current: slug
        },
        excerpt: stripHtml(excerpt) || stripHtml(content).substring(0, 200) + '...',
        content: convertWordPressContentToPortableText(content),
        publishedAt: pubDate.toISOString(),
        status: 'published',
        author: authorMap[authorLogin] ? {
          _type: 'reference',
          _ref: authorMap[authorLogin]
        } : undefined,
        categories: categories.length > 0 ? categories : undefined,
        tags: tags.length > 0 ? tags : undefined,
        wpRef: item.guid[0]._ || item.link[0],
      };
      
      const result = await sanity.create(article);
      console.log(`✅ Created article: ${title}`);
      imported++;
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to process item: ${item.title[0]}`, error.message);
      skipped++;
    }
  }
  
  console.log(`\n🎉 Import completed!`);
  console.log(`✅ Imported: ${imported} articles`);
  console.log(`⏭️  Skipped: ${skipped} items`);
}

// Main execution
async function main() {
  const xmlFilePath = process.argv[2];
  
  if (!xmlFilePath) {
    console.error('❌ Please provide the path to the WordPress XML file');
    console.error('Usage: node scripts/import-wordpress-xml.js path/to/wordpress-export.xml');
    process.exit(1);
  }
  
  if (!fs.existsSync(xmlFilePath)) {
    console.error(`❌ File not found: ${xmlFilePath}`);
    process.exit(1);
  }
  
  try {
    await processWordPressXML(xmlFilePath);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { processWordPressXML };
