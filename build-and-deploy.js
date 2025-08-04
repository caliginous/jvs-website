#!/usr/bin/env node

/**
 * JVS Website Build and Deploy Script
 * 
 * This script can be triggered by the webhook to rebuild and deploy
 * the website with fresh WordPress content.
 */

const { execSync } = require('child_process');
const path = require('path');

async function buildAndDeploy() {
  const startTime = Date.now();
  const logs = [];
  
  try {
    console.log('🚀 Starting JVS website build and deploy...');
    logs.push('🚀 Starting JVS website build and deploy...');
    
    // Step 1: Install dependencies
    logs.push('📦 Step 1: Installing dependencies...');
    console.log('Step 1: Installing dependencies...');
    
    try {
      execSync('npm install', { stdio: 'inherit' });
      logs.push('✅ Dependencies installed successfully');
    } catch (error) {
      logs.push('⚠️ Dependencies installation had issues, continuing...');
    }
    
    // Step 1.5: Clear build cache
    logs.push('🧹 Step 1.5: Clearing build cache...');
    console.log('Step 1.5: Clearing build cache...');
    
    try {
      execSync('rm -rf .next out', { stdio: 'inherit' });
      logs.push('✅ Build cache cleared successfully');
    } catch (error) {
      logs.push('⚠️ Cache clearing had issues, continuing...');
    }
    
    // Step 2: Build the Next.js site
    logs.push('🔨 Step 2: Building Next.js site with latest WordPress content...');
    console.log('Step 2: Building Next.js site with latest WordPress content...');
    
    execSync('npm run build', { stdio: 'inherit' });
    logs.push('✅ Next.js site built successfully');
    
    // Step 2.5: Create out directory and copy static assets
    logs.push('📁 Step 2.5: Preparing static assets for deployment...');
    console.log('Step 2.5: Preparing static assets for deployment...');
    
    try {
      // Create out directory
      execSync('mkdir -p out', { stdio: 'inherit' });
      
      // Copy static assets from public to out
      execSync('cp -r public/* out/', { stdio: 'inherit' });
      
      // Copy .next static files to out/_next
      execSync('mkdir -p out/_next', { stdio: 'inherit' });
      execSync('cp -r .next/static out/_next/', { stdio: 'inherit' });
      
      // Copy HTML files and other build artifacts
      execSync('cp -r .next/server/app/* out/', { stdio: 'inherit' });
      
      logs.push('✅ Static assets prepared successfully');
    } catch (error) {
      logs.push('⚠️ Static assets preparation had issues, continuing...');
    }
    
    // Step 3: Deploy to Cloudflare Workers
    logs.push('☁️ Step 3: Deploying to Cloudflare Workers...');
    console.log('Step 3: Deploying to Cloudflare Workers...');
    
    execSync('wrangler deploy', { stdio: 'inherit' });
    logs.push('✅ Deployed to Cloudflare Workers successfully');
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    logs.push(`🌐 Live at: https://jvs-website.dan-794.workers.dev`);
    logs.push(`⏱️ Build completed in ${duration.toFixed(1)} seconds`);
    logs.push('🎉 Real build and deployment completed successfully!');
    
    console.log('🎉 Real build and deployment completed successfully!');
    
    return {
      success: true,
      logs: logs,
      duration: duration,
      message: 'Website rebuilt and deployed successfully with latest WordPress content'
    };
    
  } catch (error) {
    console.error('❌ Build and deployment failed:', error);
    logs.push(`❌ Build and deployment failed: ${error.message}`);
    
    return {
      success: false,
      logs: logs,
      error: error.message
    };
  }
}

// If this script is run directly
if (require.main === module) {
  buildAndDeploy()
    .then(result => {
      if (result.success) {
        console.log('✅ Build and deployment completed successfully');
        process.exit(0);
      } else {
        console.error('❌ Build and deployment failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { buildAndDeploy }; 