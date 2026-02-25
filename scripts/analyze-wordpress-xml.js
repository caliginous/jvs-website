/*
  Analyze WordPress XML export without importing
  
  This script analyzes the WordPress XML file and shows what would be imported:
  - Number of posts, authors, categories, tags
  - Sample content structure
  - Potential issues
  
  Usage:
  node scripts/analyze-wordpress-xml.js path/to/wordpress-export.xml
*/

const fs = require('fs');
const xml2js = require('xml2js');
const cheerio = require('cheerio');

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

async function analyzeWordPressXML(xmlFilePath) {
  console.log(`🔍 Analyzing WordPress XML: ${xmlFilePath}`);
  
  // Read and parse XML
  const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlContent);
  
  const channel = result.rss.channel[0];
  const items = channel.item || [];
  const authors = channel['wp:author'] || [];
  
  console.log(`\n📊 OVERVIEW:`);
  console.log(`Total items: ${items.length}`);
  console.log(`Authors: ${authors.length}`);
  
  // Analyze authors
  console.log(`\n👥 AUTHORS:`);
  authors.forEach(author => {
    console.log(`- ${author['wp:author_display_name'][0]} (${author['wp:author_login'][0]}) - ${author['wp:author_email'][0]}`);
  });
  
  // Analyze items by type and status
  const itemStats = {};
  const statusStats = {};
  const categoryStats = {};
  const tagStats = {};
  
  let publishedPosts = 0;
  const samplePosts = [];
  
  items.forEach(item => {
    const postType = item['wp:post_type'] ? item['wp:post_type'][0] : 'unknown';
    const status = item['wp:status'] ? item['wp:status'][0] : 'unknown';
    
    itemStats[postType] = (itemStats[postType] || 0) + 1;
    statusStats[status] = (statusStats[status] || 0) + 1;
    
    if (postType === 'post' && status === 'publish') {
      publishedPosts++;
      
      // Collect sample posts
      if (samplePosts.length < 5) {
        const title = item.title[0];
        const content = item['content:encoded'] ? item['content:encoded'][0] : '';
        const excerpt = item['excerpt:encoded'] ? item['excerpt:encoded'][0] : '';
        const pubDate = new Date(item.pubDate[0]);
        const author = item['dc:creator'][0];
        
        // Extract categories and tags
        const categories = [];
        const tags = [];
        
        if (item.category) {
          item.category.forEach(cat => {
            const categoryName = cat._;
            const domain = cat.$.domain;
            
            if (domain === 'category') {
              categories.push(categoryName);
              categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
            } else if (domain === 'post_tag') {
              tags.push(categoryName);
              tagStats[categoryName] = (tagStats[categoryName] || 0) + 1;
            }
          });
        }
        
        samplePosts.push({
          title,
          slug: slugify(title),
          author,
          pubDate: pubDate.toISOString().split('T')[0],
          categories,
          tags,
          contentLength: content.length,
          excerptLength: excerpt.length,
          hasContent: content.length > 0,
          hasExcerpt: excerpt.length > 0,
        });
      }
    }
    
    // Count all categories and tags
    if (item.category) {
      item.category.forEach(cat => {
        const categoryName = cat._;
        const domain = cat.$.domain;
        
        if (domain === 'category') {
          categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
        } else if (domain === 'post_tag') {
          tagStats[categoryName] = (tagStats[categoryName] || 0) + 1;
        }
      });
    }
  });
  
  console.log(`\n📋 ITEM TYPES:`);
  Object.entries(itemStats).forEach(([type, count]) => {
    console.log(`- ${type}: ${count}`);
  });
  
  console.log(`\n📊 STATUS BREAKDOWN:`);
  Object.entries(statusStats).forEach(([status, count]) => {
    console.log(`- ${status}: ${count}`);
  });
  
  console.log(`\n✅ POSTS TO IMPORT: ${publishedPosts} published posts`);
  
  console.log(`\n🏷️  CATEGORIES (${Object.keys(categoryStats).length}):`);
  Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([category, count]) => {
      console.log(`- ${category}: ${count} posts`);
    });
  
  console.log(`\n🔖 TAGS (${Object.keys(tagStats).length}):`);
  Object.entries(tagStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([tag, count]) => {
      console.log(`- ${tag}: ${count} posts`);
    });
  
  console.log(`\n📝 SAMPLE POSTS:`);
  samplePosts.forEach((post, i) => {
    console.log(`\n${i + 1}. ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Author: ${post.author}`);
    console.log(`   Date: ${post.pubDate}`);
    console.log(`   Categories: ${post.categories.join(', ') || 'None'}`);
    console.log(`   Tags: ${post.tags.join(', ') || 'None'}`);
    console.log(`   Content: ${post.contentLength} chars ${post.hasContent ? '✅' : '❌'}`);
    console.log(`   Excerpt: ${post.excerptLength} chars ${post.hasExcerpt ? '✅' : '❌'}`);
  });
  
  console.log(`\n🚀 IMPORT SUMMARY:`);
  console.log(`Would create:`);
  console.log(`- ${authors.length} authors`);
  console.log(`- ${Object.keys(categoryStats).length} categories`);
  console.log(`- ${publishedPosts} articles`);
  console.log(`- ${Object.keys(tagStats).length} unique tags`);
  
  console.log(`\n💡 NEXT STEPS:`);
  console.log(`1. Review the sample posts above`);
  console.log(`2. Set SANITY_API_TOKEN environment variable`);
  console.log(`3. Run: node scripts/import-wordpress-xml.js ${xmlFilePath}`);
  console.log(`4. Monitor the import process for any errors`);
}

// Main execution
async function main() {
  const xmlFilePath = process.argv[2];
  
  if (!xmlFilePath) {
    console.error('❌ Please provide the path to the WordPress XML file');
    console.error('Usage: node scripts/analyze-wordpress-xml.js path/to/wordpress-export.xml');
    process.exit(1);
  }
  
  if (!fs.existsSync(xmlFilePath)) {
    console.error(`❌ File not found: ${xmlFilePath}`);
    process.exit(1);
  }
  
  try {
    await analyzeWordPressXML(xmlFilePath);
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
