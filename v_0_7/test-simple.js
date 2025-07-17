const puppeteer = require('puppeteer');

async function testSimpleMode() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Starting simple test mode validation...');
    
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      defaultViewport: { width: 1280, height: 720 }
    });
    
    page = await browser.newPage();
    
    // Monitor console messages
    page.on('console', (msg) => {
      console.log('PAGE CONSOLE:', msg.text());
    });
    
    // First, enable test mode via JavaScript injection
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('test_mode_enabled', 'true');
      localStorage.setItem('neuro_token', 'test-token');
    });

    // Navigate to game page directly
    console.log('📱 Navigating to game page...');
    await page.goto('http://localhost:3030/game', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Check if we're redirected to login
    const url = await page.url();
    console.log(`Current URL: ${url}`);
    
    if (url.includes('login')) {
      console.log('🔄 Still redirected to login, trying alternative approach...');
      
      // Try to navigate to game again with test mode
      await page.goto('http://localhost:3030/game', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Check URL again
      const newUrl = await page.url();
      console.log(`New URL after retry: ${newUrl}`);
    }
    
    // Wait a bit more for React to initialize
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if test mode is actually set
    const testModeCheck = await page.evaluate(() => {
      const testMode = localStorage.getItem('test_mode_enabled');
      console.log('Test Mode Check:', testMode);
      return testMode;
    });
    
    // Check page content
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        body: document.body.textContent.substring(0, 500),
        hasSkillBar: document.body.textContent.includes('NEURAL ABILITIES'),
        hasQuestion: document.body.textContent.includes('What') || document.body.textContent.includes('Which'),
        hasHP: document.body.textContent.includes('HP'),
        hasGame: document.body.textContent.includes('NEXUS-7'),
        testModeEnabled: localStorage.getItem('test_mode_enabled') === 'true',
        currentUrl: window.location.href,
        nodeEnv: typeof process !== 'undefined' ? process.env.NODE_ENV : 'undefined',
        hostname: window.location.hostname,
        isDevelopment: (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') || window.location.hostname === 'localhost'
      };
    });
    
    console.log('📊 Page Content Analysis:');
    console.log(`Title: ${pageContent.title}`);
    console.log(`Test Mode Enabled: ${pageContent.testModeEnabled}`);
    console.log(`Current URL: ${pageContent.currentUrl}`);
    console.log(`Node ENV: ${pageContent.nodeEnv}`);
    console.log(`Hostname: ${pageContent.hostname}`);
    console.log(`Is Development: ${pageContent.isDevelopment}`);
    console.log(`Has Skill Bar: ${pageContent.hasSkillBar}`);
    console.log(`Has Question: ${pageContent.hasQuestion}`);
    console.log(`Has HP: ${pageContent.hasHP}`);
    console.log(`Has Game: ${pageContent.hasGame}`);
    console.log(`Body Text (first 200 chars): ${pageContent.body.substring(0, 200)}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-simple-mode.png', fullPage: true });
    console.log('📸 Screenshot saved: test-simple-mode.png');
    
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testSimpleMode();