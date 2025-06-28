// Test script to verify revenue generation
import { AdNet } from './src/lib/adnet.js';
import { Frontend } from './src/lib/frontend.js';
import { Journalists } from './src/lib/journalists.js';

console.log('Testing revenue generation...');

// Subscribe to journalist ideas
Journalists.ideaStream.subscribe(idea => {
  console.log('Journalist idea:', idea);
});

// Subscribe to frontend articles
Frontend.stream.subscribe(article => {
  console.log('Published article:', article);
});

// Subscribe to ad revenue
AdNet.stream.subscribe(ad => {
  console.log('Ad placement:', ad);
});

AdNet.dailyRevenue.subscribe(revenue => {
  console.log('Daily revenue:', revenue);
});

setTimeout(() => {
  console.log('Test completed');
  process.exit(0);
}, 5000);
