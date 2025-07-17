const puppeteer = require('puppeteer');

async function testLoginButton() {
  console.log('🔍 Testing login button visibility...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 1000,
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('1️⃣ Testing with clean state (no localStorage)...');
    await page.goto('http://localhost:3030', { waitUntil: 'networkidle0' });
    
    // Clear localStorage to simulate fresh user
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const cleanStateButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return {
        allButtons: buttons.map(btn => btn.textContent.trim()),
        hasNeuralInterface: buttons.some(btn => btn.textContent.includes('NEURAL INTERFACE ACCESS')),
        hasTestMode: document.body.innerText.includes('TEST MODE'),
        userState: 'clean'
      };
    });
    
    console.log('📊 Clean State Results:');
    console.log(`   - Has Neural Interface button: ${cleanStateButtons.hasNeuralInterface}`);
    console.log(`   - Test mode active: ${cleanStateButtons.hasTestMode}`);
    console.log(`   - All buttons: ${cleanStateButtons.allButtons.join(', ')}`);
    
    console.log('\n2️⃣ Testing with auto test mode activated...');
    
    // Navigate to trigger auto test mode
    await page.goto('http://localhost:3030/game', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.goto('http://localhost:3030', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testModeButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return {
        allButtons: buttons.map(btn => btn.textContent.trim()),
        hasNeuralInterface: buttons.some(btn => btn.textContent.includes('NEURAL INTERFACE ACCESS')),
        hasDisconnect: buttons.some(btn => btn.textContent.includes('DISCONNECT NEURAL LINK')),
        hasTestMode: document.body.innerText.includes('TEST MODE'),
        testModeEnabled: localStorage.getItem('test_mode_enabled'),
        userState: 'test_mode'
      };
    });
    
    console.log('📊 Test Mode Results:');
    console.log(`   - Has Neural Interface button: ${testModeButtons.hasNeuralInterface}`);
    console.log(`   - Has Disconnect button: ${testModeButtons.hasDisconnect}`);
    console.log(`   - Test mode active: ${testModeButtons.hasTestMode}`);
    console.log(`   - Test mode in localStorage: ${testModeButtons.testModeEnabled}`);
    console.log(`   - All buttons: ${testModeButtons.allButtons.join(', ')}`);
    
    console.log('\n3️⃣ Testing modal accessibility...');
    
    if (testModeButtons.hasNeuralInterface) {
      // Click the Neural Interface Access button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const targetButton = buttons.find(btn => btn.textContent.includes('NEURAL INTERFACE ACCESS'));
        if (targetButton) targetButton.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const modalCheck = await page.evaluate(() => {
        return {
          modalVisible: !!document.querySelector('[class*="AuthModal"]') || 
                       !!document.querySelector('input[name="email"]'),
          loginFormVisible: !!document.querySelector('input[name="email"]'),
          passwordVisible: !!document.querySelector('input[name="password"]')
        };
      });
      
      console.log(`   - Modal opens: ${modalCheck.modalVisible}`);
      console.log(`   - Login form present: ${modalCheck.loginFormVisible}`);
      console.log(`   - Password field present: ${modalCheck.passwordVisible}`);
      
      return {
        cleanStateHasButton: cleanStateButtons.hasNeuralInterface,
        testModeHasButton: testModeButtons.hasNeuralInterface,
        modalWorks: modalCheck.modalVisible
      };
    }
    
    return {
      cleanStateHasButton: cleanStateButtons.hasNeuralInterface,
      testModeHasButton: testModeButtons.hasNeuralInterface,
      modalWorks: false
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      cleanStateHasButton: false,
      testModeHasButton: false,
      modalWorks: false,
      error: error.message
    };
  } finally {
    await browser.close();
  }
}

testLoginButton().then(results => {
  console.log('\n🏆 LOGIN BUTTON TEST RESULTS:');
  console.log(`🧹 Clean state has button: ${results.cleanStateHasButton ? '✅ YES' : '❌ NO'}`);
  console.log(`🧪 Test mode has button: ${results.testModeHasButton ? '✅ YES' : '❌ NO'}`);
  console.log(`🔧 Modal works: ${results.modalWorks ? '✅ YES' : '❌ NO'}`);
  
  if (results.error) {
    console.log(`\n❌ Error: ${results.error}`);
  }
  
  const allWorking = results.cleanStateHasButton && results.testModeHasButton && results.modalWorks;
  
  if (allWorking) {
    console.log('\n🎉 PERFECT! Login button is now always accessible!');
    console.log('• Button appears for new users');
    console.log('• Button appears in test mode');
    console.log('• Modal opens correctly');
  } else if (results.cleanStateHasButton || results.testModeHasButton) {
    console.log('\n✅ Good! Button is visible in at least one state.');
  } else {
    console.log('\n❌ Button is missing. Need to check the logic.');
  }
});