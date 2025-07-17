const puppeteer = require('puppeteer');

async function testGamePageSimple() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Starting simple game page test...');
    
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Navigate to the game page
    console.log('📱 Navigating to game page...');
    await page.goto('http://localhost:3030/game', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Enable test mode directly in the console
    console.log('🔧 Enabling test mode...');
    await page.evaluate(() => {
      localStorage.setItem('test_mode_enabled', 'true');
      console.log('✅ Test mode enabled');
      
      // Try to trigger a page refresh
      window.location.reload();
    });
    
    // Wait for reload
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check current page state
    const currentState = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        hasGameContent: document.body.textContent.includes('HP') || 
                       document.body.textContent.includes('Question') || 
                       document.body.textContent.includes('NEURAL ABILITIES'),
        hasLoginForm: document.querySelector('input[type="email"], input[type="password"]') !== null,
        hasSkillBar: document.body.textContent.includes('NEURAL STRIKE') || 
                    document.body.textContent.includes('DATA SHIELD'),
        hasQuestion: document.body.textContent.includes('A.') && document.body.textContent.includes('B.'),
        testModeEnabled: localStorage.getItem('test_mode_enabled') === 'true',
        bodyText: document.body.textContent.substring(0, 500)
      };
    });
    
    console.log('\n📋 Current Page State:');
    console.log(`  URL: ${currentState.url}`);
    console.log(`  Test Mode Enabled: ${currentState.testModeEnabled}`);
    console.log(`  Has Game Content: ${currentState.hasGameContent}`);
    console.log(`  Has Login Form: ${currentState.hasLoginForm}`);
    console.log(`  Has Skill Bar: ${currentState.hasSkillBar}`);
    console.log(`  Has Question: ${currentState.hasQuestion}`);
    console.log(`  Body Text Sample: ${currentState.bodyText.substring(0, 200)}...`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'game-test-simple.png',
      fullPage: true
    });
    
    // If we're on the game page, try to start a game session
    if (currentState.hasGameContent && !currentState.hasLoginForm) {
      console.log('🎮 Game page loaded! Trying to start a session...');
      
      // Try to click start button or initialize game
      await page.evaluate(() => {
        // Look for start button
        const buttons = Array.from(document.querySelectorAll('button'));
        const startButton = buttons.find(btn => 
          btn.textContent.includes('START') || 
          btn.textContent.includes('BEGIN') ||
          btn.textContent.includes('MATRIX')
        );
        
        if (startButton) {
          console.log('Found start button, clicking...');
          startButton.click();
        } else {
          console.log('No start button found, buttons:', buttons.map(b => b.textContent));
          
          // Try to enable test mode through AuthContext
          if (window.enableTestMode) {
            window.enableTestMode();
            console.log('Called enableTestMode function');
          }
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if we have questions now
      const hasQuestions = await page.evaluate(() => {
        return document.body.textContent.includes('What') || 
               document.body.textContent.includes('Which') ||
               document.body.textContent.includes('A.') && document.body.textContent.includes('B.');
      });
      
      console.log(`🎯 Questions loaded: ${hasQuestions ? '✅' : '❌'}`);
      
      // Take final screenshot
      await page.screenshot({ 
        path: 'game-test-final.png',
        fullPage: true
      });
    }
    
    return currentState;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    if (browser) {
      // Keep browser open for manual inspection
      console.log('🔍 Browser left open for manual inspection. Close when done.');
      // await browser.close();
    }
  }
}

// Run the test
if (require.main === module) {
  testGamePageSimple()
    .then(results => {
      console.log('\n✅ Simple test completed!');
      console.log('📸 Screenshots saved: game-test-simple.png, game-test-final.png');
      console.log('🔍 Browser left open for manual inspection. Close the browser window when done.');
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = testGamePageSimple;