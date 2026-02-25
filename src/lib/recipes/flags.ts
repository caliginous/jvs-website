// Recipe system feature flags
export const RECIPE_FLAGS = {
  // Enable Sanity reads if project and dataset are configured. Token is optional for public datasets
  SANITY_ENABLED: process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET,
  AGGREGATION_ENABLED: true, // Always enabled since no feature flags needed
  MIRROR_ON_IMPORT: process.env.SANITY_MIRROR_ON_IMPORT === 'true',
} as const;

export function isSanityEnabled(): boolean {
  return !!RECIPE_FLAGS.SANITY_ENABLED;
}

export function isAggregationEnabled(): boolean {
  return RECIPE_FLAGS.AGGREGATION_ENABLED;
}

export function isMirrorOnImportEnabled(): boolean {
  return RECIPE_FLAGS.MIRROR_ON_IMPORT;
}
