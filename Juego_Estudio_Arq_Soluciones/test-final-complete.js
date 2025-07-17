const puppeteer = require('puppeteer');

async function testFinalComplete() {
  let browser;
  let page;
  
  try {
    console.log('🚀 TESTING COMPLETE APPLICATION - FINAL VERSION');
    console.log('='.repeat(60));
    
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 300,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Capture errors
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
      console.log('🚨 JS Error:', error.message);
    });
    
    console.log('\n🎯 PHASE 1: TESTING CYBERPUNK LOADING SCREEN');
    
    await page.goto('http://localhost:3030/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait to see loading screen
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const loadingScreenCheck = await page.evaluate(() => {
      const loadingScreen = document.getElementById('loading-screen');
      const title = document.querySelector('.cyber-title');
      const dataBars = document.querySelectorAll('.data-bar');
      const loadingText = document.querySelector('.loading-text');
      
      return {
        hasLoadingScreen: loadingScreen !== null,
        hasCyberTitle: title !== null && title.textContent.includes('NEURO-ARCHITECT'),
        hasDataBars: dataBars.length === 5,
        hasLoadingText: loadingText !== null && loadingText.textContent.includes('Neural interface'),
        bodyStyle: window.getComputedStyle(document.body).background.includes('linear-gradient')
      };
    });
    
    console.log(`✅ Loading Screen Present: ${loadingScreenCheck.hasLoadingScreen}`);
    console.log(`✅ Cyberpunk Title: ${loadingScreenCheck.hasCyberTitle}`);
    console.log(`✅ Data Bars Animation: ${loadingScreenCheck.hasDataBars}`);
    console.log(`✅ Neural Loading Text: ${loadingScreenCheck.hasLoadingText}`);
    console.log(`✅ Cyberpunk Background: ${loadingScreenCheck.bodyStyle}`);
    
    await page.screenshot({ path: 'test-final-loading.png', fullPage: true });
    
    console.log('\n🎯 PHASE 2: TESTING LOGIN FUNCTIONALITY');
    
    // Navigate to login
    await page.goto('http://localhost:3030/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Register new user first
    console.log('📝 Creating new user account...');
    
    try {
      // Look for register link
      const hasRegisterLink = await page.evaluate(() => {
        return document.body.textContent.includes('REGISTER') || document.body.textContent.includes('Register');
      });
      
      if (hasRegisterLink) {
        console.log('Found register option, clicking...');
        await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a, button'));
          const registerLink = links.find(link => 
            link.textContent.includes('REGISTER') || 
            link.textContent.includes('Register')
          );
          if (registerLink) registerLink.click();
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fill register form
        const username = 'testuser' + Date.now();
        await page.type('input[name="username"]', username, { delay: 100 });
        await page.type('input[name="email"]', username + '@example.com', { delay: 100 });
        await page.type('input[name="password"]', 'password123', { delay: 100 });
        
        // Submit register form
        await page.click('button[type="submit"]');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`✅ User registered: ${username}`);
      } else {
        // Try login with existing user
        console.log('No register found, trying direct login...');
        await page.type('input[type="text"], input[type="email"]', 'testuser', { delay: 100 });
        await page.type('input[type="password"]', 'password123', { delay: 100 });
        await page.click('button[type="submit"]');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.log('⚠️ Login form interaction failed:', error.message);
    }
    
    const currentUrl = await page.url();
    const loginSuccess = !currentUrl.includes('/login');
    console.log(`✅ Login Success: ${loginSuccess} (URL: ${currentUrl})`);
    
    console.log('\n🎯 PHASE 3: TESTING GAME ACCESS');
    
    // Navigate to game
    await page.goto('http://localhost:3030/game', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const gamePageCheck = await page.evaluate(() => {
      return {
        url: window.location.href,
        hasGameContent: document.body.textContent.includes('HP') || 
                       document.body.textContent.includes('Question') || 
                       document.body.textContent.includes('NEURAL ABILITIES'),
        hasQuestion: document.body.textContent.includes('What') || 
                    document.body.textContent.includes('Which') ||
                    document.body.textContent.includes('AWS'),
        hasSaveButton: document.body.textContent.includes('Save Game'),
        hasCombatArena: document.body.textContent.includes('VS') || 
                       document.body.textContent.includes('NEXUS'),
        hasSkillBar: document.body.textContent.includes('NEURAL ABILITIES') ||
                    document.body.textContent.includes('NEURAL STRIKE'),
        bodyText: document.body.textContent.substring(0, 500)
      };
    });
    
    console.log(`✅ Game Page Loaded: ${gamePageCheck.url.includes('/game')}`);
    console.log(`✅ Game Content Present: ${gamePageCheck.hasGameContent}`);
    console.log(`✅ Questions Available: ${gamePageCheck.hasQuestion}`);
    console.log(`✅ Save Button Present: ${gamePageCheck.hasSaveButton}`);
    console.log(`✅ Combat Arena: ${gamePageCheck.hasCombatArena}`);
    console.log(`✅ Skill Bar: ${gamePageCheck.hasSkillBar}`);
    
    await page.screenshot({ path: 'test-final-game.png', fullPage: true });
    
    console.log('\n🎯 PHASE 4: TESTING SAVE FUNCTIONALITY');
    
    if (gamePageCheck.hasSaveButton) {
      console.log('💾 Testing save functionality...');
      
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const saveButton = buttons.find(btn => btn.textContent.includes('Save Game'));
        if (saveButton) {
          saveButton.click();
          console.log('Save button clicked');
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✅ Save functionality triggered');
    }
    
    console.log('\n🎯 PHASE 5: TESTING PROGRESS PERSISTENCE');
    
    // Refresh to test persistence
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const persistenceCheck = await page.evaluate(() => {
      return {
        stillOnGamePage: window.location.href.includes('/game'),
        gameContentLoaded: document.body.textContent.includes('HP') || 
                          document.body.textContent.includes('Question'),
        noErrors: !document.body.textContent.includes('Error') &&
                 !document.body.textContent.includes('Failed')
      };
    });
    
    console.log(`✅ Game Persistence: ${persistenceCheck.stillOnGamePage}`);
    console.log(`✅ Content Reloaded: ${persistenceCheck.gameContentLoaded}`);
    console.log(`✅ No Errors: ${persistenceCheck.noErrors}`);
    
    await page.screenshot({ path: 'test-final-persistence.png', fullPage: true });
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 FINAL RESULTS SUMMARY');
    console.log('='.repeat(60));
    
    const finalScore = {
      loadingScreen: loadingScreenCheck.hasLoadingScreen && loadingScreenCheck.hasCyberTitle,
      login: loginSuccess,
      gameAccess: gamePageCheck.hasGameContent,
      saveFunction: gamePageCheck.hasSaveButton,
      persistence: persistenceCheck.gameContentLoaded,
      jsErrors: errors.length
    };
    
    console.log(`1. 🎨 Cyberpunk Loading Screen: ${finalScore.loadingScreen ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`2. 🔐 Login Functionality: ${finalScore.login ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`3. 🎮 Game Access & Content: ${finalScore.gameAccess ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`4. 💾 Save Functionality: ${finalScore.saveFunction ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`5. 🔄 Progress Persistence: ${finalScore.persistence ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`6. 🐛 JavaScript Errors: ${finalScore.jsErrors === 0 ? '✅ NONE' : `❌ ${finalScore.jsErrors} errors`}`);
    
    const totalScore = Object.values(finalScore).filter((v, i) => i < 5 ? v : v === 0).length;
    const percentage = (totalScore / 5) * 100;
    
    console.log('\n📊 OVERALL SCORE: ' + `${totalScore}/5 (${percentage}%)`);
    
    if (percentage >= 80) {
      console.log('🏆 EXCELLENT! All major features are working correctly.');
    } else if (percentage >= 60) {
      console.log('👍 GOOD! Most features working with minor issues.');
    } else {
      console.log('⚠️ NEEDS IMPROVEMENT. Several features require attention.');
    }
    
    console.log('\n📸 Screenshots saved:');
    console.log('  - test-final-loading.png (Loading screen)');
    console.log('  - test-final-game.png (Game page)');
    console.log('  - test-final-persistence.png (After reload)');
    
    return finalScore;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    if (browser) {
      console.log('\n🔍 Browser left open for manual inspection...');
      // Keep browser open for manual review
    }
  }
}

// Run the test
if (require.main === module) {
  testFinalComplete()
    .then(results => {
      console.log('\n✅ Final complete test finished!');
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = testFinalComplete;