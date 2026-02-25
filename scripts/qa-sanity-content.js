const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa';
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('[QA] Missing SANITY_API_TOKEN');
  process.exit(1);
}

const sanity = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

async function run() {
  const findings = { articlesMissingSlug: [], articlesMissingImage: [], recipesMissingSlug: [], recipesMissingImage: [] };

  const articles = await sanity.fetch(`*[_type == "article"]{ _id, title, "slug": slug.current, excerpt, "image": coalesce(externalImageUrl, featuredImage.asset->url) }`);
  for (const a of articles) {
    if (!a.slug) findings.articlesMissingSlug.push({ id: a._id, title: a.title });
    if (!a.image) findings.articlesMissingImage.push({ id: a._id, slug: a.slug || '(no-slug)', title: a.title });
  }

  const recipes = await sanity.fetch(`*[_type == "recipe"]{ _id, title, "slug": slug.current, "image": coalesce(externalImageUrl, featuredImage.asset->url) }`);
  for (const r of recipes) {
    if (!r.slug) findings.recipesMissingSlug.push({ id: r._id, title: r.title });
    if (!r.image) findings.recipesMissingImage.push({ id: r._id, slug: r.slug || '(no-slug)', title: r.title });
  }

  console.log(JSON.stringify(findings, null, 2));
}

if (require.main === module) {
  run().catch((e) => { console.error(e); process.exit(1); });
}






















