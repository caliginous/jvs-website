const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa';
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('[FIX] Missing SANITY_API_TOKEN');
  process.exit(1);
}

const sanity = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

function slugify(input) {
  return (input || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  const doc = await sanity.fetch(`*[_type == "recipe" && !defined(slug.current)][0]{ _id, title }`);
  if (!doc) {
    console.log('[FIX] No recipe missing slug found.');
    return;
  }
  const newSlug = slugify(doc.title) || `recipe-${doc._id.slice(-6)}`;
  await sanity.patch(doc._id).set({ slug: { current: newSlug } }).commit();
  console.log(`[FIX] Updated recipe slug: ${doc._id} → ${newSlug}`);
}

if (require.main === module) run().catch(e => { console.error(e); process.exit(1); });






















