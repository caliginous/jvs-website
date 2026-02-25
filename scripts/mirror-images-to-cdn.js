/*
  Mirrors article/recipe images to a CDN:
  - Preferred: Vercel Blob (requires BLOB_READ_WRITE_TOKEN)
  - Fallback: use existing Sanity asset URL

  Updates `externalImageUrl` on the document.

  NOTE: WordPress backend (backend.jvs.org.uk) is deprecated.
  WP_GRAPHQL_URL is only used as optional fallback for legacy wpRef lookups.
*/
const axios = require('axios');
const {createClient} = require('@sanity/client');
let put; try { ({put} = require('@vercel/blob')); } catch (_) { put = null; }

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa';
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;
// Optional: Only needed for legacy wpRef lookups (WordPress backend is deprecated)
const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL;

if (!SANITY_API_TOKEN) { console.error('Missing SANITY_API_TOKEN'); process.exit(1); }

const sanity = createClient({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, apiVersion: '2024-01-01', token: SANITY_API_TOKEN, useCdn: false });

async function getSanityAssetUrl(ref) {
  // ref looks like "image-<hash>-<w>x<h>-<format>"
  if (!ref) return null;
  const asset = await sanity.fetch(`*[_id == $id][0]`, { id: ref });
  return asset?.url || null;
}

async function mirrorUrl(srcBuffer, contentType, filename) {
  if (!put || !process.env.BLOB_READ_WRITE_TOKEN) return null;
  const {url} = await put(filename, srcBuffer, { access: 'public', contentType: contentType || 'image/jpeg' });
  return url;
}

async function fetchBuffer(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return { buffer: Buffer.from(res.data), contentType: res.headers['content-type'] };
}

const WP_FEATURED_QUERY = `
  query PostById($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      featuredImage { node { sourceUrl altText } }
    }
  }
`;

async function getWpFeaturedUrlByDbId(dbId) {
  // Skip WP lookup if no URL configured (backend is deprecated)
  if (!WP_GRAPHQL_URL) return null;
  try {
    const resp = await axios.post(WP_GRAPHQL_URL, { query: WP_FEATURED_QUERY, variables: { id: Number(dbId) } }, { headers: { 'Content-Type': 'application/json' } });
    return resp.data?.data?.post?.featuredImage?.node?.sourceUrl || null;
  } catch { return null; }
}

function getFirstImageFromBlocks(blocks) {
  if (!Array.isArray(blocks)) return null;
  for (const block of blocks) {
    if (block._type === 'image' && block.asset?._ref) {
      return { sanityRef: block.asset._ref };
    }
    if (block._type === 'image' && block.asset?._type === 'reference' && block.asset._ref) {
      return { sanityRef: block.asset._ref };
    }
    if (block._type === 'image' && block.url) {
      return { url: block.url };
    }
  }
  return null;
}

async function processDoc(doc, type) {
  if (doc.externalImageUrl) return { skipped: true };
  let sourceUrl = null;
  if (doc.wpRef) {
    sourceUrl = await getWpFeaturedUrlByDbId(doc.wpRef);
  }
  if (!sourceUrl && doc.featuredImage?.asset?._ref) {
    sourceUrl = await getSanityAssetUrl(doc.featuredImage.asset._ref);
  }
  // Try first image in Portable Text content blocks
  if (!sourceUrl && Array.isArray(doc.content)) {
    const firstImage = getFirstImageFromBlocks(doc.content);
    if (firstImage?.sanityRef) {
      sourceUrl = await getSanityAssetUrl(firstImage.sanityRef);
    } else if (firstImage?.url) {
      sourceUrl = firstImage.url;
    }
  }
  if (!sourceUrl) return { skipped: true };

  try {
    const { buffer, contentType } = await fetchBuffer(sourceUrl);
    const filename = `${type}/${doc.slug?.current || doc._id}-${Date.now()}`;
    const blobUrl = await mirrorUrl(buffer, contentType, filename);
    const finalUrl = blobUrl || sourceUrl; // fallback if no blob token
    await sanity.patch(doc._id).set({ externalImageUrl: finalUrl }).commit();
    return { updated: true, url: finalUrl };
  } catch (e) {
    return { error: e.message };
  }
}

async function runForType(typeName) {
  // Fetch only docs missing externalImageUrl to reduce work, include content blocks for articles
  const selectContent = typeName === 'article' ? ', content' : '';
  const query = `*[_type == $t && !defined(externalImageUrl)]{ _id, slug, wpRef, featuredImage, externalImageUrl${selectContent} }`;
  const docs = await sanity.fetch(query, { t: typeName });
  let updated = 0, skipped = 0, failed = 0;
  for (const d of docs) {
    const res = await processDoc(d, typeName);
    if (res.updated) { updated++; console.log(`[MIRROR] ${typeName} ${d.slug?.current || d._id} → ${res.url}`); }
    else if (res.skipped) { skipped++; }
    else { failed++; console.warn(`[MIRROR] Failed ${d.slug?.current || d._id}: ${res.error}`); }
  }
  console.log(`[MIRROR] ${typeName}: updated=${updated}, skipped=${skipped}, failed=${failed}`);
}

async function main() {
  await runForType('article');
  await runForType('recipe');
}

if (require.main === module) main().catch(e=>{console.error(e); process.exit(1);});


