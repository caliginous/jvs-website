/*
  Migrates custom WPGraphQL "recipes" (exposed by our GET_RECIPES) into Sanity
  with image mirroring (Sanity asset + optional Vercel Blob).
*/
const axios = require('axios');
const {createClient} = require('@sanity/client');
let put; try { ({put} = require('@vercel/blob')); } catch (_) { put = null; }

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL || 'https://backend.jvs.org.uk/graphql';
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa';
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;
if (!SANITY_API_TOKEN) { console.error('Missing SANITY_API_TOKEN'); process.exit(1); }

const sanity = createClient({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, apiVersion: '2024-01-01', token: SANITY_API_TOKEN, useCdn: false });

const RECIPES_QUERY = `
  query GetRecipes($first: Int) {
    recipes(first: $first) {
      id title slug date excerpt content featuredImageUrl ingredients instructions servings preparationTime cookTime difficulty categories tags
    }
  }
`;

async function fetchRecipes() {
  const resp = await axios.post(WP_GRAPHQL_URL, { query: RECIPES_QUERY, variables: { first: 500 } }, { headers: { 'Content-Type': 'application/json' } });
  const data = resp.data?.data?.recipes || [];
  return data;
}

async function uploadImageToSanity(url) {
  if (!url) return null;
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(res.data);
    const asset = await sanity.assets.upload('image', buffer, { filename: url.split('/').pop() || 'image.jpg' });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (e) {
    console.warn('[MIGRATE RECIPES] Image upload failed:', url, e.message);
    return null;
  }
}

async function mirrorToVercelBlob(url) {
  if (!put || !process.env.BLOB_READ_WRITE_TOKEN || !url) return null;
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const filename = `recipes/${Date.now()}-${(url.split('/').pop() || 'image').split('?')[0]}`;
    const { url: blobUrl } = await put(filename, Buffer.from(res.data), { access: 'public', contentType: res.headers['content-type'] || 'image/jpeg' });
    return blobUrl;
  } catch (e) {
    console.warn('[MIGRATE RECIPES] Blob mirror failed:', url, e.message);
    return null;
  }
}

function toArray(value) { return Array.isArray(value) ? value : (value ? String(value).split('\n').map(s=>s.trim()).filter(Boolean) : []); }

async function upsertRecipe(r) {
  const img = await uploadImageToSanity(r.featuredImageUrl);
  const blobUrl = await mirrorToVercelBlob(r.featuredImageUrl);
  const slug = r.slug;
  const existing = await sanity.fetch(`*[_type == "recipe" && slug.current == $slug][0]`, {slug});
  const doc = {
    _type: 'recipe',
    title: r.title || 'Untitled',
    slug: { current: slug },
    excerpt: r.excerpt || '',
    content: r.content || '',
    featuredImage: img || undefined,
    externalImageUrl: blobUrl || undefined,
    ingredients: toArray(r.ingredients),
    instructions: toArray(r.instructions),
    servings: r.servings || null,
    preparationTime: r.preparationTime || null,
    cookTime: r.cookTime || null,
    difficulty: r.difficulty || null,
    categories: toArray(r.categories),
    tags: toArray(r.tags),
    publishedAt: r.date || new Date().toISOString(),
    status: 'published',
    wpRef: String(r.id),
  };
  if (existing) { await sanity.patch(existing._id).set(doc).commit(); return {action:'updated', slug}; }
  await sanity.create(doc); return {action:'created', slug};
}

async function main() {
  const recipes = await fetchRecipes();
  console.log(`[MIGRATE RECIPES] Fetched: ${recipes.length}`);
  let created = 0, updated = 0;
  for (const r of recipes) {
    const res = await upsertRecipe(r);
    if (res.action === 'created') created++; else updated++;
    console.log(`[MIGRATE RECIPES] ${res.action} ${res.slug}`);
  }
  console.log(`[MIGRATE RECIPES] Done. created=${created}, updated=${updated}`);
}

if (require.main === module) { main().catch(e=>{console.error(e); process.exit(1);}); }




