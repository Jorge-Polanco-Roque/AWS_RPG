const puppeteer = require('puppeteer');

async function testGameAccess() {
  let browser;
  let page;
  
  try {
    console.log('🎮 Testing game page access...');
    
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Monitor errors
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
      console.log('🚨 Page error:', error.message);
    });
    
    // Step 1: Navigate to home page first to set up localStorage
    console.log('📱 Navigating to home page...');
    await page.goto('http://localhost:3030/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Enable test mode
    console.log('🔧 Enabling test mode...');
    await page.evaluate(() => {
      localStorage.setItem('test_mode_enabled', 'true');
      console.log('✅ Test mode enabled in localStorage');
    });
    
    // Step 3: Navigate to login page and try to click login
    console.log('🔐 Going to login page to test authentication bypass...');
    await page.goto('http://localhost:3030/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to fill login form with test credentials
    try {
      await page.type('input[type="email"], input[type="text"]', 'test@example.com', { delay: 100 });
      await page.type('input[type="password"]', 'test123', { delay: 100 });
      
      // Click login button
      await page.click('button[type="submit"]');
      
      console.log('📝 Login form submitted');
      
      // Wait for potential navigation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.log('⚠️ Login form interaction failed:', error.message);
    }
    
    // Step 4: Try to navigate directly to game page
    console.log('🎯 Navigating to game page...');
    await page.goto('http://localhost:3030/game', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check final state
    const finalState = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        hasLoginForm: document.querySelector('input[type="email"], input[type="password"]') !== null,
        hasGameContent: document.body.textContent.includes('HP') || 
                       document.body.textContent.includes('Question') || 
                       document.body.textContent.includes('NEURAL ABILITIES') ||
                       document.body.textContent.includes('START') ||
                       document.body.textContent.includes('TRAINING'),
        testModeEnabled: localStorage.getItem('test_mode_enabled') === 'true',
        bodyText: document.body.textContent.substring(0, 300)
      };
    });
    
    console.log('\n📋 Final State:');
    console.log(`  URL: ${finalState.url}`);
    console.log(`  Test Mode Enabled: ${finalState.testModeEnabled}`);
    console.log(`  Has Login Form: ${finalState.hasLoginForm}`);
    console.log(`  Has Game Content: ${finalState.hasGameContent}`);
    console.log(`  Errors Found: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n🚨 JavaScript Errors:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'game-access-test.png',
      fullPage: true
    });
    
    console.log('📸 Screenshot saved as game-access-test.png');
    
    // Summary
    if (finalState.url.includes('/game') && finalState.hasGameContent) {
      console.log('\n✅ SUCCESS: Game page is accessible and loading content!');
    } else if (finalState.url.includes('/login')) {
      console.log('\n⚠️ REDIRECTED: Still on login page - authentication required');
    } else {
      console.log('\n❌ UNKNOWN STATE: Check screenshot for details');
    }
    
    return finalState;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    if (browser) {
      console.log('🔍 Keeping browser open for inspection...');
      // Don't close for manual inspection
    }
  }
}

// Run the test
if (require.main === module) {
  testGameAccess()
    .then(results => {
      console.log('\n✅ Game access test completed!');
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = testGameAccess;