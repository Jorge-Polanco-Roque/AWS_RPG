const puppeteer = require('puppeteer');

async function testGamePageSections() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Starting game page validation test...');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      slowMo: 50,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Set up error and console monitoring
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
    
    // Navigate to game page
    console.log('📱 Navigating to game page...');
    await page.goto('http://localhost:3030/game', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test results object
    const testResults = {
      pageLoaded: false,
      sections: {
        gameHeader: false,
        gameControls: false,
        gameInfo: false,
        combatArena: false,
        skillBar: false,
        questionCard: false,
        entityPortrait: false,
        bossManager: false
      },
      errors: errors,
      consoleMessages: consoleMessages.filter(msg => msg.includes('error') || msg.includes('Error')),
      totalSections: 0,
      loadedSections: 0
    };
    
    // Check if page loaded successfully
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    testResults.pageLoaded = title.length > 0;
    
    // Test Game Header section
    console.log('🔍 Testing Game Header section...');
    try {
      await page.waitForSelector('[data-testid="game-header"], .game-header, [class*="GameHeader"]', { timeout: 5000 });
      testResults.sections.gameHeader = true;
      console.log('✅ Game Header section loaded');
    } catch (error) {
      console.log('❌ Game Header section not found');
      // Try alternative selectors
      const headerExists = await page.evaluate(() => {
        const selectors = [
          'div:has(button:contains("Save Game"))',
          'div:has(button:contains("Return to Menu"))',
          '[class*="GameHeader"]',
          '[class*="GameControls"]'
        ];
        return selectors.some(selector => {
          try {
            return document.querySelector(selector) !== null;
          } catch {
            return false;
          }
        });
      });
      testResults.sections.gameHeader = headerExists;
    }
    
    // Test Game Controls section
    console.log('🔍 Testing Game Controls section...');
    try {
      const controlsExist = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const saveButton = buttons.find(btn => btn.textContent.includes('Save'));
        const menuButton = buttons.find(btn => btn.textContent.includes('Menu'));
        return saveButton !== null || menuButton !== null;
      });
      testResults.sections.gameControls = controlsExist;
      console.log(controlsExist ? '✅ Game Controls section loaded' : '❌ Game Controls section not found');
    } catch (error) {
      console.log('❌ Game Controls section error:', error.message);
    }
    
    // Test Game Info section
    console.log('🔍 Testing Game Info section...');
    try {
      const infoExists = await page.evaluate(() => {
        const timeInfo = document.querySelector('[class*="InfoValue"], [class*="GameInfo"]');
        const allText = document.body.textContent;
        const hasGameInfo = allText.includes('Question') || allText.includes('Time') || allText.includes('Accuracy');
        return timeInfo !== null || hasGameInfo;
      });
      testResults.sections.gameInfo = infoExists;
      console.log(infoExists ? '✅ Game Info section loaded' : '❌ Game Info section not found');
    } catch (error) {
      console.log('❌ Game Info section error:', error.message);
    }
    
    // Test Combat Arena section
    console.log('🔍 Testing Combat Arena section...');
    try {
      const arenaExists = await page.evaluate(() => {
        const arena = document.querySelector('[class*="CombatArena"], [class*="combat"]');
        const playerCharacter = document.querySelector('[class*="player"], [class*="character"]');
        const enemyCharacter = document.querySelector('[class*="enemy"], [class*="boss"]');
        return arena !== null || playerCharacter !== null || enemyCharacter !== null;
      });
      testResults.sections.combatArena = arenaExists;
      console.log(arenaExists ? '✅ Combat Arena section loaded' : '❌ Combat Arena section not found');
    } catch (error) {
      console.log('❌ Combat Arena section error:', error.message);
    }
    
    // Test Skill Bar section
    console.log('🔍 Testing Skill Bar section...');
    try {
      const skillBarExists = await page.evaluate(() => {
        const skillBar = document.querySelector('[class*="SkillBar"], [class*="skill"]');
        const skillButtons = document.querySelectorAll('[class*="Skill"][class*="Button"], button[class*="skill"]');
        const allText = document.body.textContent;
        const hasSkillText = allText.includes('NEURAL ABILITIES') || allText.includes('NEURAL STRIKE') || allText.includes('DATA SHIELD');
        return skillBar !== null || skillButtons.length > 0 || hasSkillText;
      });
      testResults.sections.skillBar = skillBarExists;
      console.log(skillBarExists ? '✅ Skill Bar section loaded' : '❌ Skill Bar section not found');
    } catch (error) {
      console.log('❌ Skill Bar section error:', error.message);
    }
    
    // Test Question Card section
    console.log('🔍 Testing Question Card section...');
    try {
      const questionExists = await page.evaluate(() => {
        const questionCard = document.querySelector('[class*="QuestionCard"], [class*="question"]');
        const optionButtons = document.querySelectorAll('[class*="Option"][class*="Button"], button[class*="option"]');
        const allText = document.body.textContent;
        const hasQuestionText = allText.includes('What') || allText.includes('How') || allText.includes('Which') || allText.includes('A.') || allText.includes('B.');
        return questionCard !== null || optionButtons.length > 0 || hasQuestionText;
      });
      testResults.sections.questionCard = questionExists;
      console.log(questionExists ? '✅ Question Card section loaded' : '❌ Question Card section not found');
    } catch (error) {
      console.log('❌ Question Card section error:', error.message);
    }
    
    // Test Entity Portrait section
    console.log('🔍 Testing Entity Portrait section...');
    try {
      const entityExists = await page.evaluate(() => {
        const entityPortrait = document.querySelector('[class*="EntityPortrait"], [class*="entity"]');
        const entityEmoji = document.querySelector('[class*="emoji"], [class*="icon"]');
        const entityName = document.querySelector('[class*="EntityName"], [class*="name"]');
        return entityPortrait !== null || entityEmoji !== null || entityName !== null;
      });
      testResults.sections.entityPortrait = entityExists;
      console.log(entityExists ? '✅ Entity Portrait section loaded' : '❌ Entity Portrait section not found');
    } catch (error) {
      console.log('❌ Entity Portrait section error:', error.message);
    }
    
    // Test Boss Manager section
    console.log('🔍 Testing Boss Manager section...');
    try {
      const bossExists = await page.evaluate(() => {
        const bossManager = document.querySelector('[class*="BossManager"], [class*="boss"]');
        const bossHP = document.querySelector('[class*="BossHP"], [class*="boss"][class*="health"]');
        const allText = document.body.textContent;
        const hasBossText = allText.includes('AWS OVERLORD') || allText.includes('LAMBDA LORD') || allText.includes('BOSS');
        return bossManager !== null || bossHP !== null || hasBossText;
      });
      testResults.sections.bossManager = bossExists;
      console.log(bossExists ? '✅ Boss Manager section loaded' : '❌ Boss Manager section not found');
    } catch (error) {
      console.log('❌ Boss Manager section error:', error.message);
    }
    
    // Get page information for debugging
    console.log('🔍 Getting page information...');
    const pageInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        bodyText: document.body.textContent.substring(0, 500),
        hasReactRoot: document.querySelector('#root') !== null,
        hasErrors: document.querySelector('.error, [class*="error"]') !== null,
        allClassNames: Array.from(document.querySelectorAll('*')).map(el => el.className).filter(Boolean).slice(0, 50)
      };
    });
    
    console.log('📋 Page Info:');
    console.log(`  URL: ${pageInfo.url}`);
    console.log(`  Title: ${pageInfo.title}`);
    console.log(`  Has React Root: ${pageInfo.hasReactRoot}`);
    console.log(`  Has Errors: ${pageInfo.hasErrors}`);
    console.log(`  Body Text (first 200 chars): ${pageInfo.bodyText.substring(0, 200)}...`);
    console.log(`  Sample Classes: ${pageInfo.allClassNames.slice(0, 10).join(', ')}`);
    
    // Calculate results
    testResults.totalSections = Object.keys(testResults.sections).length;
    testResults.loadedSections = Object.values(testResults.sections).filter(Boolean).length;
    
    // Take a screenshot for verification
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'game-page-test-screenshot.png',
      fullPage: true
    });
    
    // Print detailed results
    console.log('\n📊 TEST RESULTS:');
    console.log('=' .repeat(50));
    console.log(`Page Loaded: ${testResults.pageLoaded ? '✅' : '❌'}`);
    console.log(`Sections Loaded: ${testResults.loadedSections}/${testResults.totalSections}`);
    console.log('\nSection Details:');
    Object.entries(testResults.sections).forEach(([section, loaded]) => {
      console.log(`  ${section}: ${loaded ? '✅' : '❌'}`);
    });
    
    if (testResults.errors.length > 0) {
      console.log('\n🚨 ERRORS FOUND:');
      testResults.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (testResults.consoleMessages.length > 0) {
      console.log('\n⚠️  CONSOLE ERRORS:');
      testResults.consoleMessages.forEach(msg => console.log(`  - ${msg}`));
    }
    
    // Generate recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (!testResults.sections.skillBar) {
      console.log('  - Check SkillBar component for styled-components errors');
    }
    if (!testResults.sections.combatArena) {
      console.log('  - Verify CombatArena component is properly imported and rendered');
    }
    if (testResults.errors.length > 0) {
      console.log('  - Fix JavaScript errors that prevent proper rendering');
    }
    
    const successRate = (testResults.loadedSections / testResults.totalSections) * 100;
    console.log(`\n📈 SUCCESS RATE: ${successRate.toFixed(1)}%`);
    
    if (successRate >= 80) {
      console.log('🎉 EXCELLENT! Most sections are loading correctly.');
    } else if (successRate >= 60) {
      console.log('⚠️  GOOD! Some sections need attention.');
    } else {
      console.log('🚨 NEEDS IMPROVEMENT! Many sections are not loading.');
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
  testGamePageSections()
    .then(results => {
      console.log('\n✅ Test completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = testGamePageSections;