# Sanity Article Schema Documentation

## 📋 Overview

This document outlines the Sanity schema for articles, designed to support the Jewish Vegan Society website's content management system. The schema is based on analysis of the existing WordPress Post structure and display requirements.

## 🏗️ Schema Structure

### Core Schemas

1. **`article`** - Main article content type
2. **`author`** - Article authors
3. **`category`** - Article categories
4. **`recipe`** - Recipe content type (existing)

## 📝 Article Schema Details

### Required Fields
- **`title`** (string) - Article title
- **`slug`** (slug) - URL-friendly identifier
- **`content`** (array) - Rich text content with blocks
- **`featuredImage`** (image) - Main article image with alt text
- **`author`** (reference) - Link to author document
- **`categories`** (array of references) - Article categories
- **`publishedAt`** (datetime) - Publication date
- **`status`** (string) - Draft/Published/Archived

### Optional Fields
- **`excerpt`** (text) - Brief summary (max 200 chars)
- **`tags`** (array of strings) - Article tags
- **`seo`** (object) - SEO metadata
- **`wpRef`** (string) - WordPress reference ID

### Content Blocks
The `content` field supports:
- **Text blocks** with headings (H1-H4), paragraphs, quotes
- **Rich text formatting** (bold, italic, code)
- **Links** with URL annotations
- **Images** with alt text and captions
- **Code blocks** with syntax highlighting

## 👤 Author Schema

### Fields
- **`name`** (string) - Author name
- **`slug`** (slug) - URL-friendly identifier
- **`bio`** (text) - Author biography
- **`avatar`** (image) - Author profile picture
- **`email`** (email) - Contact email
- **`website`** (url) - Personal website
- **`social`** (object) - Social media links
- **`wpRef`** (string) - WordPress reference ID

## 📂 Category Schema

### Fields
- **`name`** (string) - Category name
- **`slug`** (slug) - URL-friendly identifier
- **`description`** (text) - Category description
- **`color`** (string) - Display color (hex code)
- **`icon`** (string) - Category icon/emoji
- **`featured`** (boolean) - Featured category flag
- **`parent`** (reference) - Parent category (for hierarchies)
- **`wpRef`** (string) - WordPress reference ID

## 🔄 WordPress Integration

### Data Mapping

| WordPress Field | Sanity Field | Notes |
|----------------|---------------|-------|
| `post.title` | `article.title` | Direct mapping |
| `post.slug` | `article.slug` | Direct mapping |
| `post.excerpt` | `article.excerpt` | Direct mapping |
| `post.content` | `article.content` | Converted to Portable Text |
| `post.date` | `article.publishedAt` | Date format conversion |
| `post.author.node.name` | `article.author` | Reference to author document |
| `post.featuredImage.node.sourceUrl` | `article.featuredImage` | Image asset reference |
| `post.featuredImage.node.altText` | `article.featuredImage.alt` | Alt text preservation |
| `post.categories.nodes[].name` | `article.categories` | References to category documents |
| `post.tags.nodes[].name` | `article.tags` | Array of strings |

### Migration Strategy
1. **Authors**: Create author documents first, then reference them
2. **Categories**: Create category documents with WordPress slugs
3. **Articles**: Create articles with references to authors/categories
4. **Images**: Upload featured images to Sanity assets
5. **Content**: Convert HTML content to Portable Text blocks

## 🎨 Display Requirements

### Article Cards (Homepage/Listing)
- Featured image (aspect-video)
- Publication date (formatted)
- Author name
- Title (clickable)
- Excerpt (line-clamped to 3 lines)
- Categories (as tags)

### Articles Page
- Featured image with fallback
- Title (line-clamped to 2 lines)
- Categories (up to 3 shown)
- Excerpt (line-clamped to 3 lines)
- Reading time (calculated)
- Views/shares (placeholder data)

### Individual Article Page
- **Hero Section**: Title, date, author, excerpt, categories
- **Content Section**: Featured image, full content, metadata
- **Footer**: Categories, tags, publication info

## 📊 Sample Data Created

### Authors
- **Sarah Cohen** - Vegan chef and food writer
- **David Green** - Nutritionist and wellness advocate

### Categories
- **Jewish Culture** (✡️) - Featured, blue color
- **Vegan Lifestyle** (🌱) - Featured, green color  
- **Nutrition** (🥗) - Orange color

### Articles
- **"The History of Jewish Vegetarianism"** - By Sarah Cohen
- **"Essential Nutrients in a Vegan Diet"** - By David Green

## 🚀 Next Steps

1. **API Integration**: Create Sanity client for articles
2. **Data Deduplication**: Implement article aggregation logic
3. **Content Migration**: Import existing WordPress articles
4. **UI Updates**: Update article pages to use Sanity data
5. **Revalidation**: Set up cache invalidation for articles

## 🔧 Technical Notes

- **Portable Text**: Sanity's rich text format for content
- **References**: Used for author and category relationships
- **Image Assets**: Stored in Sanity's asset management
- **Slugs**: Auto-generated from titles with max 96 characters
- **Validation**: Required fields enforced at schema level
- **Preview**: Custom preview with status indicators

## 📁 File Locations

- Schema files: `sanity-setup/sanity/schemaTypes/`
- Main schema: `article.ts`
- Supporting schemas: `author.ts`, `category.ts`
- Schema index: `index.ts`
