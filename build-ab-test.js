#!/usr/bin/env node

/**
 * A/B Test Build Script for JVS Website
 * 
 * This script builds both deployment modes:
 * 1. Next.js Pages adapter (current approach)
 * 2. Static export (working backup approach)
 * 
 * Usage:
 *   node build-ab-test.js [mode]
 * 
 * Modes:
 *   - pages: Build Next.js Pages adapter (default)
 *   - static: Build static export
 *   - both: Build both modes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MODE = process.argv[2] || 'both';

console.log(`🚀 [A/B TEST BUILD] Starting build for mode: ${MODE}`);

async function buildPagesAdapter() {
  console.log('📦 [A/B TEST BUILD] Building Next.js Pages adapter...');
  
  try {
    // Clean previous build
    if (fs.existsSync('.vercel')) {
      console.log('🧹 Cleaning previous .vercel build...');
      fs.rmSync('.vercel', { recursive: true, force: true });
    }
    
    // Build Next.js app
    console.log('🔨 Building Next.js app...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Build Pages adapter
    console.log('⚡ Building Cloudflare Pages adapter...');
    execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
    
    console.log('✅ Next.js Pages adapter build complete!');
    return true;
  } catch (error) {
    console.error('❌ Next.js Pages adapter build failed:', error.message);
    return false;
  }
}

async function buildStaticExport() {
  console.log('📦 [A/B TEST BUILD] Building static export...');
  
  try {
    // Clean previous build
    if (fs.existsSync('out')) {
      console.log('🧹 Cleaning previous out build...');
      fs.rmSync('out', { recursive: true, force: true });
    }
    
    // Build Next.js app
    console.log('🔨 Building Next.js app...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Create static export
    console.log('📁 Creating static export...');
    execSync('npx next export', { stdio: 'inherit' });
    
    console.log('✅ Static export build complete!');
    return true;
  } catch (error) {
    console.error('❌ Static export build failed:', error.message);
    return false;
  }
}

async function copyWorkingBackupStatic() {
  console.log('📦 [A/B TEST BUILD] Copying working backup static files...');
  
  try {
    const backupOutPath = '../jvs-website-working-backup/out';
    
    if (!fs.existsSync(backupOutPath)) {
      console.error('❌ Working backup out directory not found:', backupOutPath);
      return false;
    }
    
    // Clean previous build
    if (fs.existsSync('out')) {
      console.log('🧹 Cleaning previous out build...');
      fs.rmSync('out', { recursive: true, force: true });
    }
    
    // Copy working backup static files
    console.log('📋 Copying working backup static files...');
    execSync(`cp -r ${backupOutPath} .`, { stdio: 'inherit' });
    
    console.log('✅ Working backup static files copied!');
    return true;
  } catch (error) {
    console.error('❌ Copying working backup failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🎯 [A/B TEST BUILD] Starting A/B test build process...');
  
  let success = true;
  
  switch (MODE) {
    case 'pages':
      success = await buildPagesAdapter();
      break;
      
    case 'static':
      success = await buildStaticExport();
      break;
      
    case 'static-backup':
      success = await copyWorkingBackupStatic();
      break;
      
    case 'both':
    default:
      console.log('🔄 [A/B TEST BUILD] Building both modes...');
      
      // Build Pages adapter
      const pagesSuccess = await buildPagesAdapter();
      
      // Build static export (try both methods)
      let staticSuccess = await buildStaticExport();
      
      if (!staticSuccess) {
        console.log('⚠️ Static export build failed, trying working backup...');
        staticSuccess = await copyWorkingBackupStatic();
      }
      
      success = pagesSuccess && staticSuccess;
      break;
  }
  
  if (success) {
    console.log('🎉 [A/B TEST BUILD] Build completed successfully!');
    console.log('');
    console.log('📋 Build Summary:');
    console.log('   - Pages adapter: .vercel/output/static/');
    console.log('   - Static export: out/');
    console.log('');
    console.log('🚀 Deployment Commands:');
    console.log('   - Production (Pages): npx wrangler deploy --env=production');
    console.log('   - Static (A/B Test): npx wrangler deploy --env=static');
    console.log('   - Staging: npx wrangler deploy --env=staging');
  } else {
    console.error('💥 [A/B TEST BUILD] Build failed!');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 [A/B TEST BUILD] Unexpected error:', error);
  process.exit(1);
}); 