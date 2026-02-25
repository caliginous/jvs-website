const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa';
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('[HOMEPAGE] Missing SANITY_API_TOKEN');
  process.exit(1);
}

const sanity = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

async function upsertHomepageSettings() {
  const doc = {
    _type: 'homepageSettings',
    heroTitle: 'Jewish, Vegan & Sustainable',
    heroSubtitle: 'Inspiring plant-based living through community, culture, and cuisine.',
    heroCtaPrimary: 'Browse Events',
    heroCtaSecondary: 'Learn More About Us',
    eventsSectionTitle: 'Upcoming Events',
    articlesSectionTitle: 'Latest Articles',
    recipesSectionTitle: 'Latest Recipes',
    eventsCtaText: 'See all events',
    articlesCtaText: 'Read more articles',
    recipesCtaText: 'Explore recipes',
    aboutSectionTitle: 'About the Jewish Vegan Society',
    aboutSectionContent: 'Founded in 1965, JVS promotes a kinder, healthier, and more sustainable world through Jewish plant-based food, education, and community.',
    aboutCtaText: 'Learn More About Us',
  };

  // Singleton pattern: ensure only one document exists
  const existing = await sanity.fetch(`*[_type == "homepageSettings"][0]{_id}`);
  if (existing?._id) {
    await sanity.patch(existing._id).set(doc).commit();
    console.log('[HOMEPAGE] Updated homepageSettings:', existing._id);
  } else {
    const created = await sanity.create(doc);
    console.log('[HOMEPAGE] Created homepageSettings:', created._id);
  }
}

if (require.main === module) {
  upsertHomepageSettings().catch((e) => { console.error(e); process.exit(1); });
}













