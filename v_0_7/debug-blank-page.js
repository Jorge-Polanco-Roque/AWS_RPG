const puppeteer = require('puppeteer');

async function debugBlankPage() {
  let browser;
  let page;
  
  try {
    console.log('🔍 Debugging blank page issue...');
    
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Capture console messages and errors
    const errors = [];
    const consoleMessages = [];
    
    page.on('error', (error) => {
      errors.push(`Page error: ${error.message}`);
      console.log('🚨 Page error:', error.message);
    });
    
    page.on('pageerror', (error) => {
      errors.push(`Page error: ${error.message}`);
      console.log('🚨 Page error:', error.message);
    });
    
    page.on('console', (message) => {
      const text = message.text();
      consoleMessages.push(`${message.type()}: ${text}`);
      console.log(`📝 Console ${message.type()}: ${text}`);
    });
    
    page.on('response', response => {
      if (!response.ok()) {
        console.log(`❌ Failed to load: ${response.url()} - ${response.status()}`);
      }
    });
    
    // Navigate to the game page
    console.log('📱 Navigating to http://localhost:3030/game...');
    await page.goto('http://localhost:3030/game', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for initial loading
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check page state
    const pageState = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        hasRoot: document.getElementById('root') !== null,
        rootContent: document.getElementById('root') ? document.getElementById('root').innerHTML.substring(0, 200) : 'No root element',
        bodyContent: document.body.innerHTML.substring(0, 500),
        scripts: Array.from(document.scripts).map(s => s.src || 'inline'),
        hasReact: typeof window.React !== 'undefined',
        hasReactDOM: typeof window.ReactDOM !== 'undefined',
        loadingScreen: document.getElementById('loading-screen') !== null,
        loadingScreenVisible: document.getElementById('loading-screen') && 
                             window.getComputedStyle(document.getElementById('loading-screen')).display !== 'none'
      };
    });
    
    console.log('\n📋 Page State:');
    console.log(`  URL: ${pageState.url}`);
    console.log(`  Title: ${pageState.title}`);
    console.log(`  Has Root Element: ${pageState.hasRoot}`);
    console.log(`  Has React: ${pageState.hasReact}`);
    console.log(`  Has ReactDOM: ${pageState.hasReactDOM}`);
    console.log(`  Loading Screen Present: ${pageState.loadingScreen}`);
    console.log(`  Loading Screen Visible: ${pageState.loadingScreenVisible}`);
    console.log(`  Root Content: ${pageState.rootContent}`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'debug-blank-page.png',
      fullPage: true
    });
    
    console.log('📸 Screenshot saved as debug-blank-page.png');
    
    // Try to wait for React to load
    console.log('⏳ Waiting for React application to initialize...');
    
    try {
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          return root && root.children.length > 0;
        },
        { timeout: 10000 }
      );
      console.log('✅ React application loaded!');
    } catch (error) {
      console.log('❌ React application did not load within 10 seconds');
    }
    
    // Check final state
    const finalState = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        rootHasChildren: root && root.children.length > 0,
        rootContent: root ? root.innerHTML.substring(0, 300) : 'No root',
        allContent: document.body.textContent.substring(0, 500)
      };
    });
    
    console.log('\n📋 Final State:');
    console.log(`  Root has children: ${finalState.rootHasChildren}`);
    console.log(`  Root content: ${finalState.rootContent}`);
    console.log(`  Page text: ${finalState.allContent.substring(0, 200)}...`);
    
    // Check for specific React router issues
    await page.evaluate(() => {
      // Try to manually trigger React
      if (window.location.pathname === '/game') {
        console.log('On /game route');
        localStorage.setItem('test_mode_enabled', 'true');
        console.log('Test mode enabled');
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'debug-blank-page-final.png',
      fullPage: true
    });
    
    console.log('\n📊 Debug Summary:');
    console.log(`  Errors found: ${errors.length}`);
    console.log(`  Console messages: ${consoleMessages.length}`);
    
    if (errors.length > 0) {
      console.log('\n🚨 Errors:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (consoleMessages.length > 0) {
      console.log('\n📝 Console Messages:');
      consoleMessages.slice(-10).forEach(msg => console.log(`  - ${msg}`));
    }
    
    return {
      pageState,
      finalState,
      errors,
      consoleMessages
    };
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    throw error;
  } finally {
    if (browser) {
      console.log('🔍 Keeping browser open for manual inspection...');
      // Don't close browser for manual inspection
      // await browser.close();
    }
  }
}

// Run the debug
if (require.main === module) {
  debugBlankPage()
    .then(results => {
      console.log('\n✅ Debug completed!');
      console.log('🔍 Browser left open for manual inspection. Close when done.');
    })
    .catch(error => {
      console.error('❌ Debug failed:', error);
      process.exit(1);
    });
}

module.exports = debugBlankPage;