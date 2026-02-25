# Vercel Setup Guide for JVS Website

## ✅ COMPLETED SETUP

### Environment Variables ✅
All environment variables have been successfully configured:
- ✅ `STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_SECRET_KEY` 
- ✅ `MAILGUN_API_KEY`
- ✅ `WP_GRAPHQL_URL`
- ✅ `WORDPRESS_GRAPHQL_TOKEN`

### Project Status ✅
- ✅ Project linked: `jvs-vercel`
- ✅ Latest deployment: **READY** ✅
- ✅ Build successful with Next.js 15.4.6 and React 19.1.1
- ✅ All API routes configured for Vercel Postgres

## 🔧 REMAINING TASKS

### 1. Create Vercel Postgres Database (Required)

**This is the only remaining step needed!**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your `jvs-vercel` project
3. Go to the **Storage** tab
4. Click **Create Database** → **Postgres**
5. Choose **Hobby** plan (free tier)
6. Select a region close to your users (e.g., `iad1` for US East)
7. Name it `jvs-db`

### 2. Get Database Connection Details

After creating the database:
1. Go to the **Storage** tab in your project
2. Click on your `jvs-db` database
3. Go to the **.env.local** tab
4. Copy the connection details

### 3. Add Database Environment Variables

Add these environment variables to your Vercel project via the dashboard:

```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

### 4. Initialize Database Schema

1. Connect to your database using the Vercel dashboard SQL editor
2. Run the SQL commands from `database-schema.sql`
3. This will create all necessary tables and sample data

## 🚀 Current Deployment

**Live URL**: https://jvs-vercel-kob8ckd08-dan-jacobs-projects.vercel.app

**Status**: ✅ Ready and deployed successfully

**Features Working**:
- ✅ Homepage with WordPress GraphQL integration
- ✅ Static pages (about, contact, etc.)
- ✅ Recipe pages with 279 recipes loaded
- ✅ Event pages
- ✅ Magazine pages
- ✅ All API routes configured (will work once database is added)

## Database Schema

The `database-schema.sql` file contains:
- `content` table for articles, events, recipes
- `magazine_issues` table for magazine content
- `events` table for event management
- `recipes` table for recipe content
- `users` table for admin access
- `settings` table for site configuration

## Next Steps

1. **Create the Postgres database** (only remaining task)
2. **Add database environment variables**
3. **Run the database schema**
4. **Test the articles and magazine functionality**

Once the database is set up, the `/articles` and `/magazine` pages will work fully with the Vercel Postgres backend!

## Project URLs

- **Production**: https://jvs-vercel-kob8ckd08-dan-jacobs-projects.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Project Settings**: https://vercel.com/dashboard/project/jvs-vercel
