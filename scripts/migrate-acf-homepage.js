/*
  DEPRECATED: This migration script was used to migrate ACF homepage settings to Sanity.
  The WordPress backend (backend.jvs.org.uk) is no longer active.
  This script is kept for historical reference only.

  Env:
  - WP_GRAPHQL_URL (required - no default, backend is deprecated)
  - SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN
*/

const axios = require('axios');
const { createClient } = require('@sanity/client');

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL;
if (!WP_GRAPHQL_URL) {
  console.error('[ACF->Sanity] Missing WP_GRAPHQL_URL - WordPress backend is deprecated');
  process.exit(1);
}
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'lyq4b3pa';
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error('[ACF->Sanity] Missing SANITY_API_TOKEN');
  process.exit(1);
}

const sanity = createClient({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, apiVersion: '2024-01-01', token: SANITY_API_TOKEN, useCdn: false });

const HOMEPAGE_SETTINGS_QUERY = `
  query HomepageSettings {
    homepageSettings {
      heroTitle
      heroSubtitle
      heroCtaPrimary
      heroCtaSecondary
      eventsSectionTitle
      articlesSectionTitle
      recipesSectionTitle
      eventsCtaText
      articlesCtaText
      recipesCtaText
      aboutSectionTitle
      aboutSectionContent
      aboutCtaText
    }
  }
`;

async function fetchAcfSettings() {
  const resp = await axios.post(WP_GRAPHQL_URL, { query: HOMEPAGE_SETTINGS_QUERY }, { headers: { 'Content-Type': 'application/json' } });
  const data = resp.data?.data?.homepageSettings || null;
  if (!data) throw new Error('No ACF homepageSettings returned');
  return data;
}

async function upsertHomepageSettings(settings) {
  const existing = await sanity.fetch(`*[_type == "homepageSettings"][0]`);
  const doc = { _type: 'homepageSettings', ...settings };
  if (existing) {
    await sanity.patch(existing._id).set(doc).commit();
    return 'updated';
  }
  await sanity.create(doc);
  return 'created';
}

async function main() {
  console.log('[ACF->Sanity] Fetching ACF homepage settings...');
  const settings = await fetchAcfSettings();
  console.log('[ACF->Sanity] Upserting into Sanity...');
  const action = await upsertHomepageSettings(settings);
  console.log(`[ACF->Sanity] Done: ${action}`);
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}























