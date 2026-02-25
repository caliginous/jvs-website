import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export interface StaticPageDoc {
  route: string;
  title?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
  body?: any[];
}

export async function fetchStaticPageByRoute(route: string): Promise<StaticPageDoc | null> {
  const doc = await client.fetch(
    `*[_type == "staticPage" && route == $route][0]`,
    { route }
  );
  return doc || null;
}






















