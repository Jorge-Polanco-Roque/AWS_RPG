const puppeteer = require('puppeteer');

async function testUserRequirements() {
  console.log('🎯 TESTING USER REQUIREMENTS');
  console.log('=============================');
  console.log('1. Cyberpunk loading screen');
  console.log('2. Real login functionality');
  console.log('3. Backend progress saving/loading with persistence\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 500,
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('🔍 REQUIREMENT 1: Cyberpunk Loading Screen');
    console.log('===========================================');
    
    await page.goto('http://localhost:3030', { waitUntil: 'networkidle0' });
    
    const cyberpunkElements = await page.evaluate(() => {
      return {
        title: document.title,
        hasNeurpTitle: !!document.querySelector('.cyber-title'),
        neurpTitleText: document.querySelector('.cyber-title')?.textContent,
        hasDataBars: document.querySelectorAll('.data-bar').length,
        loadingText: document.querySelector('.loading-text')?.textContent,
        backgroundColor: getComputedStyle(document.body).backgroundColor
      };
    });
    
    const cyberpunkWorking = cyberpunkElements.title.includes('NEURO-ARCHITECT') && 
                            cyberpunkElements.hasNeurpTitle && 
                            cyberpunkElements.hasDataBars > 0;
    
    console.log(`✅ Cyberpunk theme: ${cyberpunkWorking ? 'WORKING' : 'FAILED'}`);
    console.log(`   - Title: ${cyberpunkElements.title}`);
    console.log(`   - Neuro title: ${cyberpunkElements.neurpTitleText}`);
    console.log(`   - Data bars: ${cyberpunkElements.hasDataBars}`);
    console.log(`   - Loading text: ${cyberpunkElements.loadingText}`);
    
    console.log('\\n🔍 REQUIREMENT 2: Real Login Functionality');
    console.log('============================================');
    
    // Test registration
    console.log('Testing registration...');
    const timestamp = Date.now();
    const testUser = {
      username: `TestUser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123'
    };
    
    await page.goto('http://localhost:3030/register', { waitUntil: 'networkidle0' });
    await page.type('input[name=\"username\"]', testUser.username);
    await page.type('input[name=\"email\"]', testUser.email);
    await page.type('input[name=\"password\"]', testUser.password);
    await page.type('input[name=\"confirmPassword\"]', testUser.password);
    await page.click('button[type=\"submit\"]');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const registrationResult = await page.evaluate(() => ({
      hasToken: !!localStorage.getItem('neuro_token'),
      currentUrl: window.location.href
    }));
    
    const registrationWorking = registrationResult.hasToken && registrationResult.currentUrl.includes('/game');
    console.log(`✅ Registration: ${registrationWorking ? 'WORKING' : 'FAILED'}`);
    console.log(`   - Auth token created: ${registrationResult.hasToken}`);
    console.log(`   - Redirected to game: ${registrationResult.currentUrl.includes('/game')}`);
    
    // Test logout and login
    console.log('\\nTesting logout and login...');
    await page.evaluate(() => localStorage.removeItem('neuro_token'));
    await page.goto('http://localhost:3030/login', { waitUntil: 'networkidle0' });
    
    await page.type('input[name=\"email\"]', testUser.email);
    await page.type('input[name=\"password\"]', testUser.password);
    await page.click('button[type=\"submit\"]');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const loginResult = await page.evaluate(() => ({
      hasToken: !!localStorage.getItem('neuro_token'),
      currentUrl: window.location.href
    }));
    
    const loginWorking = loginResult.hasToken && loginResult.currentUrl.includes('/game');
    console.log(`✅ Login: ${loginWorking ? 'WORKING' : 'FAILED'}`);
    console.log(`   - Auth token recreated: ${loginResult.hasToken}`);
    console.log(`   - Redirected to game: ${loginResult.currentUrl.includes('/game')}`);
    
    console.log('\\n🔍 REQUIREMENT 3: Backend Progress Saving/Loading');
    console.log('==================================================');
    
    // Test that we're on the game page and can access progress functions
    const gamePageStatus = await page.evaluate(() => ({
      isOnGamePage: window.location.pathname === '/game',
      hasGameContent: !!document.querySelector('button') || !!document.querySelector('.game-interface'),
      pageContent: document.body.innerText.substring(0, 200)
    }));
    
    console.log(`Game page loaded: ${gamePageStatus.isOnGamePage}`);
    console.log(`Game content present: ${gamePageStatus.hasGameContent}`);
    
    // Test progress saving via API (since frontend integration might not be available)
    console.log('\\nTesting backend progress API...');
    
    const token = await page.evaluate(() => localStorage.getItem('neuro_token'));
    
    if (token) {
      // Test save progress
      const saveResponse = await page.evaluate(async (authToken) => {
        try {
          const response = await fetch('/api/game/save-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
              level: 10,
              experience: 5000,
              totalScore: 15000,
              gamesPlayed: 25
            })
          });
          return await response.json();
        } catch (error) {
          return { error: error.message };
        }
      }, token);
      
      const saveWorking = saveResponse.success === true;
      console.log(`✅ Progress saving: ${saveWorking ? 'WORKING' : 'FAILED'}`);
      console.log(`   - Save response: ${JSON.stringify(saveResponse)}`);
      
      // Test load progress
      const loadResponse = await page.evaluate(async (authToken) => {
        try {
          const response = await fetch('/api/game/load-progress', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          return await response.json();
        } catch (error) {
          return { error: error.message };
        }
      }, token);
      
      const progressData = loadResponse.progress;
      const loadWorking = loadResponse.success && 
                         progressData.level === 10 && 
                         progressData.experience === 5000 &&
                         progressData.totalScore === 15000;
      
      console.log(`✅ Progress loading: ${loadWorking ? 'WORKING' : 'FAILED'}`);
      console.log(`   - Load response success: ${loadResponse.success}`);
      console.log(`   - Progress data: Level ${progressData?.level}, XP ${progressData?.experience}, Score ${progressData?.totalScore}`);
      
      console.log('\\n🔄 Testing persistence - logout and login again...');
      
      // Logout and login again to test persistence
      await page.evaluate(() => localStorage.removeItem('neuro_token'));
      await page.goto('http://localhost:3030/login', { waitUntil: 'networkidle0' });
      
      await page.type('input[name=\"email\"]', testUser.email);
      await page.type('input[name=\"password\"]', testUser.password);
      await page.click('button[type=\"submit\"]');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newToken = await page.evaluate(() => localStorage.getItem('neuro_token'));
      
      if (newToken) {
        const persistentLoadResponse = await page.evaluate(async (authToken) => {
          try {
            const response = await fetch('/api/game/load-progress', {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            });
            return await response.json();
          } catch (error) {
            return { error: error.message };
          }
        }, newToken);
        
        const persistentData = persistentLoadResponse.progress;
        const persistenceWorking = persistentLoadResponse.success && 
                                  persistentData.level === 10 && 
                                  persistentData.experience === 5000;
        
        console.log(`✅ Progress persistence: ${persistenceWorking ? 'WORKING' : 'FAILED'}`);
        console.log(`   - After re-login: Level ${persistentData?.level}, XP ${persistentData?.experience}, Score ${persistentData?.totalScore}`);
        
        return {
          cyberpunkTheme: cyberpunkWorking,
          realLogin: registrationWorking && loginWorking,
          progressSaving: saveWorking && loadWorking && persistenceWorking
        };
      }
    }
    
    return {
      cyberpunkTheme: cyberpunkWorking,
      realLogin: registrationWorking && loginWorking,
      progressSaving: false
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      cyberpunkTheme: false,
      realLogin: false,
      progressSaving: false,
      error: error.message
    };
  } finally {
    await browser.close();
  }
}

testUserRequirements().then(results => {
  console.log('\\n\\n🏆 USER REQUIREMENTS TEST RESULTS');
  console.log('====================================');
  console.log(`1. ✨ Cyberpunk loading screen: ${results.cyberpunkTheme ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`2. 🔐 Real login functionality: ${results.realLogin ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`3. 💾 Backend progress saving: ${results.progressSaving ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (results.error) {
    console.log(`\\n❌ Error: ${results.error}`);
  }
  
  const successCount = Object.values(results).filter(v => v === true).length;
  const successRate = Math.round((successCount / 3) * 100);
  
  console.log(`\\n📊 SUCCESS RATE: ${successCount}/3 (${successRate}%)`);
  
  if (successRate === 100) {
    console.log('🎉 ALL USER REQUIREMENTS IMPLEMENTED SUCCESSFULLY!');
    console.log('The cyberpunk AWS study game is ready for use!');
  } else {
    console.log('🔧 Some requirements need attention.');
  }
});