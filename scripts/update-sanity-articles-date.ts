import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  const targetDate = '2025-08-08T09:00:00Z';
  // Adjust titles/ids if needed to match your test docs
  const testSlugs = ['sample-article', 'second-sample-article'];

  const articles = await sanityClient.fetch(
    `*[_type == "article" && slug.current in $slugs]{ _id, title, slug, publishedAt }`,
    { slugs: testSlugs }
  );

  console.log('Found articles to update:', articles.map((a: any) => a.slug?.current || a._id));

  for (const a of articles) {
    await sanityClient.patch(a._id).set({ publishedAt: targetDate }).commit();
    console.log(`Updated ${a._id} to publishedAt=${targetDate}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});




