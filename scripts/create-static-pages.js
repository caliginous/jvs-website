const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa';
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!token) { console.error('[STATIC] Missing SANITY_API_TOKEN'); process.exit(1); }

const sanity = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

function blocksFromHtml(text) {
  const t = (text || '').trim();
  if (!t) return [];
  return [{ _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', text: t, marks: [] }] }];
}

async function upsertStatic(route, data) {
  const existing = await sanity.fetch(`*[_type == "staticPage" && route == $route][0]{_id}`, { route });
  const doc = { _type: 'staticPage', route, ...data };
  if (existing?._id) {
    await sanity.patch(existing._id).set(doc).commit();
    console.log(`[STATIC] Updated ${route}`);
  } else {
    const created = await sanity.create(doc);
    console.log(`[STATIC] Created ${route}: ${created._id}`);
  }
}

async function run() {
  await upsertStatic('/about', {
    title: 'About JVS',
    heroTitle: 'About JVS',
    heroSubtitle: 'Jewish, Vegan, Sustainable - Building community through shared values and compassionate living',
    ctaPrimaryText: 'Join Now',
    ctaPrimaryHref: '/membership',
    ctaSecondaryText: 'Get in Touch',
    ctaSecondaryHref: '/contact',
    body: blocksFromHtml('JVS promotes Jewish values through veganism and sustainability, building community through education and advocacy.'),
  });

  await upsertStatic('/history', {
    title: 'Our History',
    heroTitle: 'Our History',
    heroSubtitle: 'The story of JVS since the 1960s',
    body: blocksFromHtml('The Jewish Vegetarian Society (now JVS) was founded in the 1960s...'),
  });

  await upsertStatic('/membership', {
    title: 'Membership',
    heroTitle: 'Become a Member',
    heroSubtitle: 'Join our growing community and access exclusive resources, events, and support networks.',
    body: blocksFromHtml('Membership details placeholder.'),
  });

  await upsertStatic('/resources', {
    title: 'Resources',
    heroTitle: 'Resources',
    heroSubtitle: 'Guides, FAQs and more',
    body: blocksFromHtml('Resources placeholder.'),
  });

  await upsertStatic('/privacy', {
    title: 'Privacy Policy',
    heroTitle: 'Privacy Policy',
    heroSubtitle: 'How we collect, use, and protect your information',
    body: blocksFromHtml('Privacy policy placeholder.'),
  });

  await upsertStatic('/terms', {
    title: 'Terms & Conditions',
    heroTitle: 'Terms & Conditions',
    heroSubtitle: 'The rules that govern your use of our site',
    body: blocksFromHtml('Terms placeholder.'),
  });

  await upsertStatic('/contact', {
    title: 'Contact',
    heroTitle: 'Contact Us',
    heroSubtitle: 'Have questions? Want to learn more? Get in touch with our friendly team.',
    body: blocksFromHtml('Contact placeholder.'),
  });
}

if (require.main === module) run().catch(e=>{ console.error(e); process.exit(1); });

