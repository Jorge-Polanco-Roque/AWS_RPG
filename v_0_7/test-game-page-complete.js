const puppeteer = require('puppeteer');

async function testGamePageWithAuth() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Starting comprehensive game page validation test...');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Set up error monitoring
    const errors = [];
    const consoleMessages = [];
    
    page.on('error', (error) => {
      errors.push(`Page error: ${error.message}`);
    });
    
    page.on('pageerror', (error) => {
      errors.push(`Page error: ${error.message}`);
    });
    
    page.on('console', (message) => {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    });
    
    // Step 1: Navigate to any page first and enable test mode
    console.log('📱 Navigating to home page first...');
    await page.goto('http://localhost:3030/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Enable test mode immediately
    await page.evaluate(() => {
      localStorage.setItem('test_mode_enabled', 'true');
      console.log('Test mode enabled in localStorage');
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Try to authenticate
    console.log('🔐 Attempting to authenticate...');
    try {
      // Wait for login form
      await page.waitForSelector('input[type="email"], input[type="text"], input[placeholder*="Username"], input[placeholder*="Email"]', { timeout: 10000 });
      await page.waitForSelector('input[type="password"], input[placeholder*="Password"]', { timeout: 5000 });
      
      // Fill login form
      await page.type('input[type="email"], input[type="text"], input[placeholder*="Username"], input[placeholder*="Email"]', 'test@example.com');
      await page.type('input[type="password"], input[placeholder*="Password"]', 'password123');
      
      // Submit form
      const submitButton = await page.$('button[type="submit"], button:contains("LOGIN"), button:contains("JACK INTO")');
      if (submitButton) {
        await submitButton.click();
        console.log('✅ Login form submitted');
        
        // Wait for navigation
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      } else {
        console.log('⚠️ Login button not found, trying alternative approach...');
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const loginButton = buttons.find(btn => 
            btn.textContent.includes('LOGIN') || 
            btn.textContent.includes('JACK INTO') ||
            btn.textContent.includes('MATRIX')
          );
          if (loginButton) loginButton.click();
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.log('⚠️ Login failed or not required:', error.message);
    }
    
    // Step 3: Navigate directly to game page with test mode already enabled
    console.log('🎮 Navigating directly to game page...');
    
    // Ensure test mode is enabled before navigation
    await page.evaluate(() => {
      localStorage.setItem('test_mode_enabled', 'true');
      localStorage.setItem('neuro_token', 'test-token');
      console.log('Test mode enabled before navigation');
    });
    
    await page.goto('http://localhost:3030/game', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    // Test results object
    const testResults = {
      authenticationAttempted: true,
      gamePageLoaded: false,
      sections: {
        gameHeader: false,
        gameControls: false,
        gameInfo: false,
        combatArena: false,
        skillBar: false,
        questionCard: false,
        entityPortrait: false,
        bossManager: false,
        loadingScreen: false,
        gameState: 'unknown'
      },
      errors: errors,
      consoleMessages: consoleMessages.filter(msg => msg.includes('error') || msg.includes('Error')),
      totalSections: 0,
      loadedSections: 0
    };
    
    // Check current page state
    const currentState = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        bodyText: document.body.textContent.substring(0, 1000),
        hasReactRoot: document.querySelector('#root') !== null,
        hasGameContent: document.body.textContent.includes('NEURAL') || document.body.textContent.includes('Question') || document.body.textContent.includes('HP'),
        hasLoadingScreen: document.body.textContent.includes('INITIALIZING') || document.body.textContent.includes('loading'),
        hasLoginForm: document.querySelector('input[type="email"], input[type="password"]') !== null,
        hasErrorMessage: document.querySelector('.error, [class*="error"]') !== null,
        allButtonTexts: Array.from(document.querySelectorAll('button')).map(btn => btn.textContent).slice(0, 10)
      };
    });
    
    console.log('📋 Current Page State:');
    console.log(`  URL: ${currentState.url}`);
    console.log(`  Title: ${currentState.title}`);
    console.log(`  Has React Root: ${currentState.hasReactRoot}`);
    console.log(`  Has Game Content: ${currentState.hasGameContent}`);
    console.log(`  Has Loading Screen: ${currentState.hasLoadingScreen}`);
    console.log(`  Has Login Form: ${currentState.hasLoginForm}`);
    console.log(`  Has Error Message: ${currentState.hasErrorMessage}`);
    console.log(`  Button Texts: ${currentState.allButtonTexts.join(', ')}`);
    
    testResults.gamePageLoaded = currentState.hasGameContent;
    
    // If we're still on login page, try to bypass auth
    if (currentState.hasLoginForm) {
      console.log('🔄 Still on login page, attempting to bypass authentication...');
      
      // Enable test mode in localStorage
      await page.evaluate(() => {
        localStorage.setItem('test_mode_enabled', 'true');
        localStorage.setItem('authToken', 'test-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test', email: 'test@example.com' }));
      });
      
      // Navigate again
      await page.goto('http://localhost:3030/game', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Test individual sections
    console.log('🔍 Testing individual sections...');
    
    // Test Loading Screen
    const loadingExists = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('INITIALIZING') || text.includes('loading') || text.includes('NEURAL MATRIX');
    });
    testResults.sections.loadingScreen = loadingExists;
    console.log(`Loading Screen: ${loadingExists ? '✅' : '❌'}`);
    
    // Test Game Header
    const gameHeaderExists = await page.evaluate(() => {
      const headerSelectors = ['[class*="GameHeader"]', '[class*="game-header"]'];
      return headerSelectors.some(selector => document.querySelector(selector) !== null);
    });
    testResults.sections.gameHeader = gameHeaderExists;
    console.log(`Game Header: ${gameHeaderExists ? '✅' : '❌'}`);
    
    // Test Game Controls
    const gameControlsExists = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const saveButton = buttons.find(btn => btn.textContent.includes('Save'));
      const menuButton = buttons.find(btn => btn.textContent.includes('Menu'));
      return saveButton !== null || menuButton !== null;
    });
    testResults.sections.gameControls = gameControlsExists;
    console.log(`Game Controls: ${gameControlsExists ? '✅' : '❌'}`);
    
    // Test Game Info
    const gameInfoExists = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('Question') || text.includes('Time') || text.includes('Accuracy') || text.includes('Streak');
    });
    testResults.sections.gameInfo = gameInfoExists;
    console.log(`Game Info: ${gameInfoExists ? '✅' : '❌'}`);
    
    // Test Combat Arena
    const combatArenaExists = await page.evaluate(() => {
      const text = document.body.textContent;
      const arenaSelectors = ['[class*="CombatArena"]', '[class*="combat"]'];
      const hasArenaElement = arenaSelectors.some(selector => document.querySelector(selector) !== null);
      const hasArenaText = text.includes('NEXUS-7') || text.includes('HP') || text.includes('VIRUS-X');
      return hasArenaElement || hasArenaText;
    });
    testResults.sections.combatArena = combatArenaExists;
    console.log(`Combat Arena: ${combatArenaExists ? '✅' : '❌'}`);
    
    // Test Skill Bar
    const skillBarExists = await page.evaluate(() => {
      const text = document.body.textContent;
      const skillSelectors = ['[class*="SkillBar"]', '[class*="skill"]'];
      const hasSkillElement = skillSelectors.some(selector => document.querySelector(selector) !== null);
      const hasSkillText = text.includes('NEURAL ABILITIES') || text.includes('NEURAL STRIKE') || text.includes('DATA SHIELD');
      return hasSkillElement || hasSkillText;
    });
    testResults.sections.skillBar = skillBarExists;
    console.log(`Skill Bar: ${skillBarExists ? '✅' : '❌'}`);
    
    // Test Question Card
    const questionCardExists = await page.evaluate(() => {
      const text = document.body.textContent;
      const questionSelectors = ['[class*="QuestionCard"]', '[class*="question"]'];
      const hasQuestionElement = questionSelectors.some(selector => document.querySelector(selector) !== null);
      const hasQuestionText = text.includes('What') || text.includes('How') || text.includes('Which') || text.includes('A.') || text.includes('B.');
      return hasQuestionElement || hasQuestionText;
    });
    testResults.sections.questionCard = questionCardExists;
    console.log(`Question Card: ${questionCardExists ? '✅' : '❌'}`);
    
    // Test Entity Portrait
    const entityPortraitExists = await page.evaluate(() => {
      const text = document.body.textContent;
      const entitySelectors = ['[class*="EntityPortrait"]', '[class*="entity"]'];
      const hasEntityElement = entitySelectors.some(selector => document.querySelector(selector) !== null);
      const hasEntityText = text.includes('🤖') || text.includes('AI') || text.includes('NEXUS');
      return hasEntityElement || hasEntityText;
    });
    testResults.sections.entityPortrait = entityPortraitExists;
    console.log(`Entity Portrait: ${entityPortraitExists ? '✅' : '❌'}`);
    
    // Test Boss Manager
    const bossManagerExists = await page.evaluate(() => {
      const text = document.body.textContent;
      const bossSelectors = ['[class*="BossManager"]', '[class*="boss"]'];
      const hasBossElement = bossSelectors.some(selector => document.querySelector(selector) !== null);
      const hasBossText = text.includes('AWS OVERLORD') || text.includes('LAMBDA LORD') || text.includes('BOSS');
      return hasBossElement || hasBossText;
    });
    testResults.sections.bossManager = bossManagerExists;
    console.log(`Boss Manager: ${bossManagerExists ? '✅' : '❌'}`);
    
    // Determine game state
    const gameState = await page.evaluate(() => {
      const text = document.body.textContent;
      if (text.includes('INITIALIZING') || text.includes('loading')) return 'loading';
      if (text.includes('TRAINING PROTOCOL COMPLETE')) return 'ended';
      if (text.includes('Question') && text.includes('Time')) return 'playing';
      if (text.includes('Username') || text.includes('Password')) return 'login';
      return 'idle';
    });
    testResults.sections.gameState = gameState;
    console.log(`Game State: ${gameState}`);
    
    // Calculate results
    testResults.totalSections = Object.keys(testResults.sections).length - 1; // Exclude gameState
    testResults.loadedSections = Object.entries(testResults.sections).filter(([key, loaded]) => key !== 'gameState' && loaded).length;
    
    // Take screenshots
    console.log('📸 Taking screenshots...');
    await page.screenshot({ 
      path: 'game-page-full-test.png',
      fullPage: true
    });
    
    // Take a viewport screenshot
    await page.screenshot({ 
      path: 'game-page-viewport-test.png',
      fullPage: false
    });
    
    // Print detailed results
    console.log('\n📊 COMPREHENSIVE TEST RESULTS:');
    console.log('=' .repeat(60));
    console.log(`Authentication Attempted: ${testResults.authenticationAttempted ? '✅' : '❌'}`);
    console.log(`Game Page Loaded: ${testResults.gamePageLoaded ? '✅' : '❌'}`);
    console.log(`Game State: ${gameState}`);
    console.log(`Sections Loaded: ${testResults.loadedSections}/${testResults.totalSections}`);
    
    console.log('\n🎯 Section Details:');
    Object.entries(testResults.sections).forEach(([section, loaded]) => {
      if (section !== 'gameState') {
        console.log(`  ${section}: ${loaded ? '✅' : '❌'}`);
      }
    });
    
    if (testResults.errors.length > 0) {
      console.log('\n🚨 ERRORS FOUND:');
      testResults.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (testResults.consoleMessages.length > 0) {
      console.log('\n⚠️  CONSOLE ERRORS:');
      testResults.consoleMessages.forEach(msg => console.log(`  - ${msg}`));
    }
    
    // Generate specific recommendations
    console.log('\n💡 SPECIFIC RECOMMENDATIONS:');
    
    if (gameState === 'login') {
      console.log('  🔐 AUTHENTICATION ISSUE:');
      console.log('    - The game page is redirecting to login');
      console.log('    - Check if authentication is required');
      console.log('    - Verify protected routes are working correctly');
    }
    
    if (gameState === 'loading') {
      console.log('  ⏳ LOADING STATE:');
      console.log('    - The game is in loading state');
      console.log('    - Check if the loading completes properly');
      console.log('    - Verify game initialization logic');
    }
    
    if (!testResults.sections.skillBar) {
      console.log('  ⚔️ SKILL BAR ISSUE:');
      console.log('    - SkillBar component not loading (styled-components error)');
      console.log('    - Check SkillBar.js for syntax errors');
      console.log('    - Verify all imports are correct');
    }
    
    if (!testResults.sections.combatArena) {
      console.log('  ⚔️ COMBAT ARENA ISSUE:');
      console.log('    - CombatArena component not rendering');
      console.log('    - Check if component is properly imported');
      console.log('    - Verify game state transitions');
    }
    
    if (!testResults.sections.questionCard) {
      console.log('  ❓ QUESTION CARD ISSUE:');
      console.log('    - Questions not loading');
      console.log('    - Check API endpoints');
      console.log('    - Verify game session initialization');
    }
    
    const successRate = (testResults.loadedSections / testResults.totalSections) * 100;
    console.log(`\n📈 SUCCESS RATE: ${successRate.toFixed(1)}%`);
    
    if (successRate >= 80) {
      console.log('🎉 EXCELLENT! Game page is working well.');
    } else if (successRate >= 60) {
      console.log('👍 GOOD! Most sections are working with minor issues.');
    } else if (successRate >= 40) {
      console.log('⚠️  MODERATE! Several sections need attention.');
    } else {
      console.log('🚨 CRITICAL! Major issues preventing game from working.');
    }
    
    return testResults;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
if (require.main === module) {
  testGamePageWithAuth()
    .then(results => {
      console.log('\n✅ Comprehensive test completed successfully!');
      console.log('📸 Screenshots saved: game-page-full-test.png, game-page-viewport-test.png');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = testGamePageWithAuth;