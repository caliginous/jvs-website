/*
  Migrate magazine issues from legacy API/DB to Sanity.

  - Fetches magazine rows from MAG_SOURCE_URL (defaults to worker URL)
  - Uploads PDFs to Vercel Blob (public) and stores pdfFileUrl
  - Uploads cover images to Sanity image assets
  - Creates/updates Sanity `magazineIssue` docs

  Env:
  - MAG_SOURCE_URL (optional)
  - SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN
  - BLOB_READ_WRITE_TOKEN (required to upload PDFs to Blob)
*/

const axios = require('axios');
const { createClient } = require('@sanity/client');

let put;
try { ({ put } = require('@vercel/blob')); } catch (_) { put = null; }

const MAG_SOURCE_URL = process.env.MAG_SOURCE_URL || 'https://jvs-website.dan-794.workers.dev/api/list-magazines';
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'lyq4b3pa';
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error('[MAG] Missing SANITY_API_TOKEN');
  process.exit(1);
}
if (!put || !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('[MAG] Missing Vercel Blob capability (BLOB_READ_WRITE_TOKEN)');
  process.exit(1);
}

const sanity = createClient({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, apiVersion: '2024-01-01', token: SANITY_API_TOKEN, useCdn: false });

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 96);
}

async function fetchMagazines() {
  const resp = await axios.get(MAG_SOURCE_URL, { timeout: 60000 });
  if (!Array.isArray(resp.data)) throw new Error('Unexpected magazine source response');
  return resp.data;
}

async function uploadPdfToBlob(url, title) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  const filename = `magazines/${Date.now()}-${slugify(title || 'magazine')}.pdf`;
  const uploaded = await put(filename, Buffer.from(res.data), { access: 'public', contentType: 'application/pdf' });
  return uploaded.url;
}

async function uploadCoverToSanity(url) {
  if (!url) return null;
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const asset = await sanity.assets.upload('image', Buffer.from(res.data), { filename: url.split('/').pop() || 'cover.jpg' });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (e) {
    console.warn('[MAG] Cover upload failed:', url, e.message);
    return null;
  }
}

async function upsertMagazine(m) {
  const slug = slugify(m.title) || String(m.id);
  const existing = await sanity.fetch(`*[_type == "magazineIssue" && slug.current == $slug][0]`, { slug });
  const pdfUrl = await uploadPdfToBlob(m.pdf_url, m.title);
  const coverImage = await uploadCoverToSanity(m.cover_image);

  const doc = {
    _type: 'magazineIssue',
    title: m.title,
    slug: { current: slug },
    issueNumber: '',
    publishedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString(),
    coverImage: coverImage || undefined,
    pdfFileUrl: pdfUrl,
    summary: m.summary || '',
    ocrText: m.ocr_text || '',
    categories: [],
    tags: [],
  };

  if (existing) {
    await sanity.patch(existing._id).set(doc).commit();
    return { action: 'updated', slug };
  }
  await sanity.create(doc);
  return { action: 'created', slug };
}

async function main() {
  console.log('[MAG] Fetching magazines from source...');
  const mags = await fetchMagazines();
  console.log(`[MAG] Found ${mags.length} items`);

  let created = 0, updated = 0, failed = 0;
  for (const m of mags) {
    try {
      const res = await upsertMagazine(m);
      if (res.action === 'created') created++; else updated++;
      console.log(`[MAG] ${res.action}: ${res.slug}`);
    } catch (e) {
      failed++;
      console.error('[MAG] Failed to upsert:', m.title || m.id, e.message);
    }
  }
  console.log(`[MAG] Done. created=${created}, updated=${updated}, failed=${failed}`);
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}























