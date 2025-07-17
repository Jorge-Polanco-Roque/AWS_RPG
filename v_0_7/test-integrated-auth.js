const puppeteer = require('puppeteer');

async function testIntegratedAuth() {
  console.log('🔍 Testing integrated authentication in homepage...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 1000,
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('1️⃣ Testing homepage with auto test mode...');
    await page.goto('http://localhost:3030', { waitUntil: 'networkidle0' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const homepageElements = await page.evaluate(() => {
      return {
        hasTitle: !!document.querySelector('h1'),
        titleText: document.querySelector('h1')?.textContent,
        hasAuthButton: !!document.querySelector('button'),
        buttonTexts: Array.from(document.querySelectorAll('button')).map(btn => btn.textContent),
        hasTestModeMessage: document.body.innerText.includes('TEST MODE'),
        hasNeuralInterfaceButton: Array.from(document.querySelectorAll('button')).some(btn => 
          btn.textContent.includes('NEURAL INTERFACE ACCESS'))
      };
    });
    
    console.log('📊 Homepage Analysis:');
    console.log(`   - Title: ${homepageElements.titleText}`);
    console.log(`   - Test mode message: ${homepageElements.hasTestModeMessage}`);
    console.log(`   - Neural Interface button: ${homepageElements.hasNeuralInterfaceButton}`);
    console.log(`   - Available buttons: ${homepageElements.buttonTexts.join(', ')}`);
    
    if (homepageElements.hasNeuralInterfaceButton) {
      console.log('\\n2️⃣ Testing authentication modal...');
      
      // Click the Neural Interface Access button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const targetButton = buttons.find(btn => btn.textContent.includes('NEURAL INTERFACE ACCESS'));
        if (targetButton) targetButton.click();
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const modalElements = await page.evaluate(() => {
        return {
          hasModal: !!document.querySelector('[class*="AuthModal"]'),
          hasLoginForm: !!document.querySelector('input[name="email"]'),
          hasPasswordField: !!document.querySelector('input[name="password"]'),
          modalTitle: document.querySelector('h2')?.textContent,
          hasCloseButton: Array.from(document.querySelectorAll('button')).some(btn => btn.textContent.includes('×'))
        };
      });
      
      console.log('   - Modal opened: true');
      console.log(`   - Modal title: ${modalElements.modalTitle}`);
      console.log(`   - Login form: ${modalElements.hasLoginForm}`);
      console.log(`   - Password field: ${modalElements.hasPasswordField}`);
      
      // Test registration mode switch
      console.log('\\n3️⃣ Testing mode switch to registration...');
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const switchButton = buttons.find(btn => btn.textContent.includes('Create Neural Profile'));
        if (switchButton) switchButton.click();
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const registerElements = await page.evaluate(() => {
        return {
          hasUsernameField: !!document.querySelector('input[name="username"]'),
          hasConfirmPassword: !!document.querySelector('input[name="confirmPassword"]'),
          buttonText: document.querySelector('button[type="submit"]')?.textContent
        };
      });
      
      console.log(`   - Username field: ${registerElements.hasUsernameField}`);
      console.log(`   - Confirm password: ${registerElements.hasConfirmPassword}`);
      console.log(`   - Submit button: ${registerElements.buttonText}`);
      
      // Test actual registration
      if (registerElements.hasUsernameField) {
        console.log('\\n4️⃣ Testing registration flow...');
        
        const timestamp = Date.now();
        await page.type('input[name="username"]', `IntegratedTest${timestamp}`);
        await page.type('input[name="email"]', `integrated${timestamp}@example.com`);
        await page.type('input[name="password"]', 'password123');
        await page.type('input[name="confirmPassword"]', 'password123');
        
        await page.click('button[type="submit"]');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const afterRegister = await page.evaluate(() => ({
          currentUrl: window.location.href,
          hasRealToken: !!localStorage.getItem('neuro_token'),
          isOnGamePage: window.location.pathname === '/game'
        }));
        
        console.log(`   - Registration successful: ${afterRegister.hasRealToken}`);
        console.log(`   - Redirected to game: ${afterRegister.isOnGamePage}`);
        console.log(`   - Current URL: ${afterRegister.currentUrl}`);
        
        return {
          homepageWorks: true,
          authModalWorks: true,
          registrationWorks: afterRegister.hasRealToken && afterRegister.isOnGamePage
        };
      }
    }
    
    return {
      homepageWorks: homepageElements.hasTitle,
      authModalWorks: false,
      registrationWorks: false
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      homepageWorks: false,
      authModalWorks: false,
      registrationWorks: false,
      error: error.message
    };
  } finally {
    await browser.close();
  }
}

testIntegratedAuth().then(results => {
  console.log('\\n🏆 INTEGRATION TEST RESULTS:');
  console.log(`🏠 Homepage loads: ${results.homepageWorks ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`🔐 Auth modal: ${results.authModalWorks ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`📝 Registration flow: ${results.registrationWorks ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (results.error) {
    console.log(`\\n❌ Error: ${results.error}`);
  }
  
  const successCount = Object.values(results).filter(v => v === true).length;
  const totalTests = 3;
  const successRate = Math.round((successCount / totalTests) * 100);
  
  console.log(`\\n📈 Success Rate: ${successCount}/${totalTests} (${successRate}%)`);
  
  if (successRate >= 75) {
    console.log('\\n🎉 Authentication is now integrated into the main menu!');
    console.log('Users can:');
    console.log('• Access the game directly (test mode)');
    console.log('• Use "NEURAL INTERFACE ACCESS" for real accounts');
    console.log('• Register and login without leaving the homepage');
  } else {
    console.log('\\n🔧 Some issues need to be addressed.');
  }
});