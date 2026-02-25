# Environment Variables Reference

## Recipe System Environment Variables

### Revalidation Secret
```
REVALIDATE_RECIPES_SECRET=/h863cv4NqxsyETF2JHDThL+YUfBX88mqBN5FLGwHQI=
```

### Sanity Configuration
```
SANITY_PROJECT_ID=oEojF9nyO
SANITY_DATASET=production
SANITY_API_TOKEN=skYzU4qzU2dHbumDTvr3t6HALh23AcKTymt4YVDvkLpK6S93D0yataphXEdYIIuLKpuK6lW8be0ghJp4f0vAtAVK3zeL4M5gc42YZ4FlEXAvo4j8NFPRN5oOqHWqjozjmIKmAfQmaQbDFkmUqtscxMl08FD4NB429zhnbYamm35s4rnsqUnI
```

### Recipe Feature Flags
```
SANITY_RECIPES_ENABLED=true
SANITY_AGGREGATION_ENABLED=true
SANITY_MIRROR_ON_IMPORT=false
```

## For Local Development

Create a `.env.local` file in the project root with these variables for local development.

## For Production

These variables are already configured in Vercel environment variables.
