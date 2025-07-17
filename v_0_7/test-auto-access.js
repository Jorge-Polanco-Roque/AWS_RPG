const puppeteer = require('puppeteer');

async function testAutoAccess() {
  console.log('🔍 Testing automatic localhost access...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 1000,
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Clear any existing storage first
    await page.goto('http://localhost:3030');
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    console.log('1️⃣ Testing direct access to game page without credentials...');
    await page.goto('http://localhost:3030/game', { waitUntil: 'networkidle0' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const gameAccess = await page.evaluate(() => {
      return {
        currentUrl: window.location.href,
        hasAuthUser: !!localStorage.getItem('neuro_token') || localStorage.getItem('test_mode_enabled') === 'true',
        testModeEnabled: localStorage.getItem('test_mode_enabled'),
        pageContent: document.body.innerText.substring(0, 100)
      };
    });
    
    console.log('📊 Results:');
    console.log(`   - Current URL: ${gameAccess.currentUrl}`);
    console.log(`   - Has access: ${gameAccess.hasAuthUser}`);
    console.log(`   - Test mode: ${gameAccess.testModeEnabled}`);
    console.log(`   - On game page: ${gameAccess.currentUrl.includes('/game')}`);
    console.log(`   - Page content: ${gameAccess.pageContent.replace(/\n/g, ' ')}`);
    
    const success = gameAccess.currentUrl.includes('/game') && gameAccess.hasAuthUser;
    
    console.log(`\n✅ Automatic access: ${success ? 'WORKING' : 'FAILED'}`);
    
    if (success) {
      console.log('\n2️⃣ Testing that real authentication still works...');
      
      // Test logout
      await page.evaluate(() => {
        if (window.authContext && window.authContext.logout) {
          window.authContext.logout();
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to register to test real auth
      await page.goto('http://localhost:3030/register', { waitUntil: 'networkidle0' });
      
      const timestamp = Date.now();
      await page.type('input[name="username"]', `AuthTest${timestamp}`);
      await page.type('input[name="email"]', `authtest${timestamp}@example.com`);
      await page.type('input[name="password"]', 'password123');
      await page.type('input[name="confirmPassword"]', 'password123');
      await page.click('button[type="submit"]');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const authResult = await page.evaluate(() => ({
        hasRealToken: !!localStorage.getItem('neuro_token'),
        currentUrl: window.location.href
      }));
      
      const realAuthWorks = authResult.hasRealToken && authResult.currentUrl.includes('/game');
      console.log(`✅ Real authentication: ${realAuthWorks ? 'WORKING' : 'FAILED'}`);
      console.log(`   - Real token: ${authResult.hasRealToken}`);
      console.log(`   - On game page: ${authResult.currentUrl.includes('/game')}`);
      
      return { autoAccess: success, realAuth: realAuthWorks };
    }
    
    return { autoAccess: success, realAuth: false };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { autoAccess: false, realAuth: false, error: error.message };
  } finally {
    await browser.close();
  }
}

testAutoAccess().then(results => {
  console.log('\n🏆 FINAL RESULTS:');
  console.log(`🔓 Automatic localhost access: ${results.autoAccess ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`🔐 Real authentication: ${results.realAuth ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (results.error) {
    console.log(`\n❌ Error: ${results.error}`);
  }
  
  if (results.autoAccess && results.realAuth) {
    console.log('\n🎉 Perfect! You now have both:');
    console.log('   • Direct access without credentials on localhost');
    console.log('   • Full authentication system for real users');
  } else {
    console.log('\n🔧 Some adjustments may be needed.');
  }
});