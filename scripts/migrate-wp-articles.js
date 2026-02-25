/*
  DEPRECATED: This migration script was used to migrate WordPress articles to Sanity.
  The WordPress backend (backend.jvs.org.uk) is no longer active.
  This script is kept for historical reference only.

  Env required:
  - WP_GRAPHQL_URL (required - no default, backend is deprecated)
  - SANITY_PROJECT_ID (lyq4b3pa)
  - SANITY_DATASET (production)
  - SANITY_API_TOKEN (write token)
  - Optional: BLOB_READ_WRITE_TOKEN (to mirror images to Vercel Blob)
*/

const axios = require('axios');
const {createClient} = require('@sanity/client');
const cheerio = require('cheerio');

let put;
try {
  ({put} = require('@vercel/blob'));
} catch (_) {
  put = null;
}

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL;
if (!WP_GRAPHQL_URL) {
  console.error('[MIGRATE] Missing WP_GRAPHQL_URL - WordPress backend is deprecated');
  process.exit(1);
}
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa';
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error('[MIGRATE] Missing SANITY_API_TOKEN');
  process.exit(1);
}

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: SANITY_API_TOKEN,
  useCdn: false,
});

const POSTS_QUERY = `
  query Articles($first: Int, $after: String) {
    posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        content
        date
        author { node { name } }
        featuredImage { node { sourceUrl altText } }
        categories { nodes { name slug } }
        tags { nodes { name slug } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

async function fetchAllPosts() {
  const all = [];
  let after = null;
  while (true) {
    const resp = await axios.post(WP_GRAPHQL_URL, {
      query: POSTS_QUERY,
      variables: { first: 100, after },
    }, { headers: { 'Content-Type': 'application/json' }});
    const data = resp.data?.data?.posts;
    if (!data) throw new Error('Bad Articles response');
    all.push(...data.nodes);
    if (!data.pageInfo.hasNextPage) break;
    after = data.pageInfo.endCursor;
  }
  return all;
}

async function ensureAuthor(name) {
  if (!name) return null;
  const existing = await sanity.fetch(`*[_type == "author" && name == $name][0]`, {name});
  if (existing) return existing._id;
  const doc = await sanity.create({ _type: 'author', name, slug: {current: name.toLowerCase().replace(/\s+/g,'-')} });
  return doc._id;
}

async function ensureCategories(nodes) {
  if (!nodes || !nodes.length) return [];
  const ids = [];
  for (const cat of nodes) {
    const slug = (cat.slug || cat.name || '').toLowerCase();
    let existing = await sanity.fetch(`*[_type == "category" && slug.current == $slug][0]`, {slug});
    if (!existing) {
      existing = await sanity.create({ _type: 'category', name: cat.name || slug, slug: {current: slug} });
    }
    ids.push({ _type: 'reference', _ref: existing._id });
  }
  return ids;
}

async function uploadImageToSanity(url, altText) {
  if (!url) return null;
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(res.data);
    const asset = await sanity.assets.upload('image', buffer, { filename: url.split('/').pop() || 'image.jpg' });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: altText || '' };
  } catch (e) {
    console.warn('[MIGRATE] Image upload failed:', url, e.message);
    return null;
  }
}

async function mirrorToVercelBlob(url) {
  if (!put || !process.env.BLOB_READ_WRITE_TOKEN || !url) return null;
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const filename = `articles/${Date.now()}-${(url.split('/').pop() || 'image').split('?')[0]}`;
    const { url: blobUrl } = await put(filename, Buffer.from(res.data), { access: 'public', contentType: res.headers['content-type'] || 'image/jpeg' });
    return blobUrl;
  } catch (e) {
    console.warn('[MIGRATE] Blob mirror failed:', url, e.message);
    return null;
  }
}

async function htmlToPortableTextBlocks(html) {
  if (!html) return [];

  const $ = cheerio.load(html, { decodeEntities: true });
  const blocks = [];

  const pushTextBlock = (style, text, markDefs = [], marks = []) => {
    const normalized = (text || '').replace(/\s+/g, ' ').trim();
    if (!normalized) return;
    blocks.push({
      _type: 'block',
      style,
      markDefs,
      children: [{ _type: 'span', text: normalized, marks }],
    });
  };

  const handleLink = (el) => {
    const href = $(el).attr('href');
    const text = $(el).text();
    const key = `link_${Math.random().toString(36).slice(2, 8)}`;
    const markDef = { _type: 'link', _key: key, href };
    return { text, markDefKey: key, markDef };
  };

  const handleImage = async (el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt') || '';
    const uploaded = await uploadImageToSanity(src, alt);
    if (uploaded) blocks.push(uploaded);
  };

  const walk = async (container) => {
    for (const el of container.children) {
      const tag = el.tagName?.toLowerCase();
      if (!tag) continue;
      if (tag === 'img') {
        await handleImage(el);
        continue;
      }
      if (['h1','h2','h3','h4','h5','h6','p','blockquote','li','pre','code','strong','em','b','i','a'].includes(tag)) {
        if (tag === 'pre') {
          const codeText = $(el).text();
          blocks.push({ _type: 'code', code: codeText, language: '' });
          continue;
        }
        if (tag === 'strong' || tag === 'b' || tag === 'em' || tag === 'i') {
          // roll up as normal text with marks applied in parent walk
          pushTextBlock('normal', $(el).text());
          continue;
        }
        if (tag === 'a') {
          const { text, markDefKey, markDef } = handleLink(el);
          blocks.push({ _type: 'block', style: 'normal', markDefs: [markDef], children: [{ _type: 'span', text, marks: [markDefKey] }] });
          continue;
        }
        if (tag === 'li') {
          pushTextBlock('normal', $(el).text());
          continue;
        }
        let style = 'normal';
        if (tag.startsWith('h')) style = tag;
        if (tag === 'blockquote') style = 'blockquote';

        // links inside
        const links = $(el).find('a');
        if (links.length > 0) {
          const markDefs = [];
          let combinedText = '';
          const marks = [];
          $(el).contents().each((_, node) => {
            if (node.type === 'text') {
              combinedText += node.data;
            } else if (node.tagName?.toLowerCase() === 'a') {
              const { text, markDefKey, markDef } = handleLink(node);
              markDefs.push(markDef);
              combinedText += text;
              marks.push(markDefKey);
            }
          });
          pushTextBlock(style, combinedText, markDefs, marks);
        } else {
          pushTextBlock(style, $(el).text());
        }
        continue;
      }
      if (tag === 'ul' || tag === 'ol') {
        const isBulleted = tag === 'ul';
        for (const li of $(el).children('li').toArray()) {
          const text = $(li).text();
          blocks.push({
            _type: 'block',
            style: 'normal',
            listItem: isBulleted ? 'bullet' : 'number',
            level: 1,
            markDefs: [],
            children: [{ _type: 'span', text, marks: [] }],
          });
        }
        continue;
      }
      // Fallback: recurse
      await walk(el);
    }
  };

  await walk($.root()[0]);
  return blocks;
}

async function upsertArticle(post) {
  const authorId = await ensureAuthor(post.author?.node?.name);
  const categoryRefs = await ensureCategories(post.categories?.nodes);
  const featured = await uploadImageToSanity(post.featuredImage?.node?.sourceUrl, post.featuredImage?.node?.altText);
  const blobUrl = await mirrorToVercelBlob(post.featuredImage?.node?.sourceUrl);

  const slug = post.slug;
  const existing = await sanity.fetch(`*[_type == "article" && slug.current == $slug][0]`, {slug});

  const doc = {
    _type: 'article',
    title: post.title || 'Untitled',
    slug: { current: slug },
    excerpt: (post.excerpt || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 300),
    // Convert HTML to Portable Text blocks
    content: await htmlToPortableTextBlocks(post.content),
    featuredImage: featured || undefined,
    externalImageUrl: blobUrl || undefined,
    author: authorId ? { _type: 'reference', _ref: authorId } : undefined,
    categories: categoryRefs,
    tags: (post.tags?.nodes || []).map(t => t?.name).filter(Boolean),
    publishedAt: post.date || new Date().toISOString(),
    status: 'published',
    wpRef: String(post.id),
  };

  if (existing) {
    await sanity.patch(existing._id).set(doc).commit();
    return { action: 'updated', slug };
  }
  await sanity.create(doc);
  return { action: 'created', slug };
}

async function main() {
  console.log('[MIGRATE] Fetching all WP posts...');
  const posts = await fetchAllPosts();
  const limit = parseInt(process.env.LIMIT || '0', 10);
  const selected = limit > 0 ? posts.slice(0, limit) : posts;
  console.log(`[MIGRATE] Posts fetched: ${posts.length} (processing ${selected.length})`);

  let created = 0, updated = 0;
  for (const post of selected) {
    const res = await upsertArticle(post);
    if (res.action === 'created') created++; else updated++;
    console.log(`[MIGRATE] ${res.action} article: ${res.slug}`);
  }
  console.log(`[MIGRATE] Done. created=${created}, updated=${updated}`);
}

if (require.main === module) {
  main().catch(err => { console.error(err); process.exit(1); });
}


