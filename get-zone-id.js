#!/usr/bin/env node

/**
 * Script to help find the Cloudflare Zone ID for jvs.org.uk
 * This script will guide the user through getting their Zone ID from the Cloudflare dashboard
 */

console.log('🔍 Finding Cloudflare Zone ID for jvs.org.uk');
console.log('');
console.log('To get your Zone ID, please follow these steps:');
console.log('');
console.log('1. Go to https://dash.cloudflare.com');
console.log('2. Click on your "jvs.org.uk" domain');
console.log('3. In the right sidebar, look for the "API" section');
console.log('4. Copy the "Zone ID" value');
console.log('');
console.log('The Zone ID will look something like: 023e105f4ecef8ad9ca31a8372d0c353');
console.log('');
console.log('Once you have the Zone ID, you can use it with the cache purge script.');