const puppeteer = require('puppeteer');

async function testRegistrationFlow() {
  console.log('🔄 Testing Registration Flow...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 500,
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging from the page
    page.on('console', msg => {
      console.log('🌐 PAGE LOG:', msg.text());
    });
    
    page.on('pageerror', error => {
      console.log('❌ PAGE ERROR:', error.message);
    });
    
    console.log('1️⃣ Navigating to registration page...');
    await page.goto('http://localhost:3030/register', { waitUntil: 'networkidle0' });
    
    console.log('2️⃣ Filling registration form...');
    const timestamp = Date.now();
    await page.type('input[name="username"]', `TestUser${timestamp}`);
    await page.type('input[name="email"]', `test${timestamp}@example.com`);
    await page.type('input[name="password"]', 'password123');
    await page.type('input[name="confirmPassword"]', 'password123');
    
    console.log('3️⃣ Submitting registration...');
    await page.click('button[type="submit"]');
    
    // Wait for potential navigation or state changes
    console.log('4️⃣ Waiting for response...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    // Check authentication state
    const authData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('neuro_token'),
        testMode: localStorage.getItem('test_mode_enabled')
      };
    });
    
    console.log('🔐 Auth Data:', authData);
    
    // Check if we're on the game page
    const isOnGamePage = currentUrl.includes('/game');
    const isOnRegisterPage = currentUrl.includes('/register');
    const isOnLoginPage = currentUrl.includes('/login');
    
    console.log('\n📊 RESULTS:');
    console.log('✅ Registration completed:', !!authData.token);
    console.log('🎮 On game page:', isOnGamePage);
    console.log('📝 Still on register page:', isOnRegisterPage);
    console.log('🔑 Redirected to login:', isOnLoginPage);
    
    // If not on game page, try navigating manually
    if (!isOnGamePage && authData.token) {
      console.log('\n5️⃣ Attempting manual navigation to game...');
      await page.goto('http://localhost:3030/game', { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalUrl = page.url();
      console.log('📍 Final URL after manual navigation:', finalUrl);
      
      const gamePageLoaded = finalUrl.includes('/game');
      console.log('🎮 Game page loaded manually:', gamePageLoaded);
      
      if (gamePageLoaded) {
        // Check if game content is actually loaded
        const gameContent = await page.evaluate(() => {
          return {
            hasGameHeader: !!document.querySelector('h1, h2, h3'),
            hasGameContent: !!document.querySelector('.game-container, .combat-arena, .skill-bar'),
            pageText: document.body.innerText.substring(0, 200)
          };
        });
        
        console.log('📋 Game content check:', gameContent);
      }
    }
    
    return {
      registrationSuccess: !!authData.token,
      gamePageAccess: isOnGamePage,
      authToken: !!authData.token
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      registrationSuccess: false,
      gamePageAccess: false,
      authToken: false,
      error: error.message
    };
  } finally {
    await browser.close();
  }
}

// Run the test
testRegistrationFlow().then(results => {
  console.log('\n🏆 FINAL TEST RESULTS:');
  console.log('Registration Success:', results.registrationSuccess ? '✅' : '❌');
  console.log('Game Page Access:', results.gamePageAccess ? '✅' : '❌');
  console.log('Auth Token Present:', results.authToken ? '✅' : '❌');
  
  if (results.error) {
    console.log('Error:', results.error);
  }
  
  const successRate = Object.values(results).filter(v => v === true).length;
  console.log(`\n📈 Success Rate: ${successRate}/3 (${Math.round(successRate/3*100)}%)`);
});