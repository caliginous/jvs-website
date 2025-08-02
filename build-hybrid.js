#!/usr/bin/env node

/**
 * Simplified Hybrid Build Script for JVS Website
 * 
 * This script:
 * 1. Builds the current system (Pages adapter) for articles and recipes
 * 2. Uses existing static export for events (from backup)
 * 
 * Usage:
 *   node build-hybrid.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 [HYBRID BUILD] Starting simplified hybrid build process...');

async function buildHybrid() {
  try {
    // Step 1: Build Next.js app and Pages adapter (for articles and recipes)
    console.log('🔨 [HYBRID BUILD] Building Next.js app and Pages adapter...');
    execSync('npm run build', { stdio: 'inherit' });
    execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
    
    // Step 2: Copy static event files from backup to Pages adapter output
    console.log('📋 [HYBRID BUILD] Copying static event files from backup...');
    
    const backupEventsDir = '../jvs-website-working-backup/out/events';
    const targetEventsDir = '.vercel/output/static/events';
    
    if (fs.existsSync(backupEventsDir)) {
      // Create events directory if it doesn't exist
      if (!fs.existsSync(targetEventsDir)) {
        fs.mkdirSync(targetEventsDir, { recursive: true });
      }
      
      // Copy static event files
      execSync(`cp -r ${backupEventsDir}/* ${targetEventsDir}/`, { stdio: 'inherit' });
      console.log('✅ [HYBRID BUILD] Static event files copied successfully');
    } else {
      console.log('⚠️ [HYBRID BUILD] No static event files found in backup');
    }
    
    console.log('🎉 [HYBRID BUILD] Simplified hybrid build completed successfully!');
    console.log('');
    console.log('📋 Build Summary:');
    console.log('   - Pages adapter: .vercel/output/static/ (articles, recipes, etc.)');
    console.log('   - Static events: Copied from backup to .vercel/output/static/events/');
    console.log('   - Hybrid worker: worker.js (routes based on path)');
    console.log('');
    console.log('🚀 Deployment Command:');
    console.log('   npx wrangler deploy --env=production');
    console.log('');
    console.log('🔍 How it works:');
    console.log('   - /events/* → Static export (fixes 500 errors)');
    console.log('   - /articles/* → Pages adapter (keeps working system)');
    console.log('   - /recipes/* → Pages adapter (keeps working system)');
    console.log('   - /api/* → Pages adapter (API routes)');
    
  } catch (error) {
    console.error('💥 [HYBRID BUILD] Build failed:', error.message);
    process.exit(1);
  }
}

buildHybrid().catch(error => {
  console.error('💥 [HYBRID BUILD] Unexpected error:', error);
  process.exit(1);
}); 