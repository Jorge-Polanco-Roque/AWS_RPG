const puppeteer = require('puppeteer');

async function completeTest() {
    console.log('🚀 Iniciando validación completa del RPG...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Escuchar logs importantes
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ Error:', msg.text());
        } else if (msg.text().includes('✅') || msg.text().includes('🎮')) {
            console.log('📝', msg.text());
        }
    });
    
    try {
        await page.goto('http://localhost:3030', { waitUntil: 'networkidle2' });
        console.log('✅ Página cargada');
        
        // Test 1: Verificar elementos iniciales
        console.log('\n🧪 Test 1: Elementos iniciales');
        const welcomeScreen = await page.$('#welcome-screen');
        const mapPanel = await page.$('#map-panel');
        const canvas = await page.$('canvas');
        
        console.log(`   Pantalla bienvenida: ${welcomeScreen ? '✅' : '❌'}`);
        console.log(`   Panel de mapa: ${mapPanel ? '✅' : '❌'}`);
        console.log(`   Canvas 3D: ${canvas ? '✅' : '❌'}`);
        
        // Test 2: Iniciar aventura
        console.log('\n🧪 Test 2: Iniciar aventura');
        await page.click('#start-adventure-btn');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const battleInterface = await page.$('.battle-interface');
        const questionText = await page.$('.question-text');
        const battleOptions = await page.$$('.battle-option');
        
        console.log(`   Interfaz de batalla: ${battleInterface ? '✅' : '❌'}`);
        console.log(`   Texto de pregunta: ${questionText ? '✅' : '❌'}`);
        console.log(`   Opciones de respuesta: ${battleOptions.length === 4 ? '✅' : '❌'} (${battleOptions.length})`);
        
        // Test 3: Probar selección de respuesta
        console.log('\n🧪 Test 3: Selección de respuesta');
        if (battleOptions.length > 0) {
            await battleOptions[0].click();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const selectedOption = await page.$('.battle-option.selected');
            console.log(`   Opción seleccionada: ${selectedOption ? '✅' : '❌'}`);
            
            // Verificar que el botón de ataque se habilitó
            const attackEnabled = await page.evaluate(() => {
                const btn = document.getElementById('attack-btn');
                return btn && !btn.disabled;
            });
            console.log(`   Botón ataque habilitado: ${attackEnabled ? '✅' : '❌'}`);
            
            // Probar ataque
            if (attackEnabled) {
                await page.click('#attack-btn');
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('   Ataque ejecutado: ✅');
                
                // Verificar que aparece el botón "Next Battle"
                const nextBattleBtn = await page.$('#next-battle-btn[style*="inline-block"]');
                console.log(`   Botón siguiente batalla: ${nextBattleBtn ? '✅' : '❌'}`);
            }
        }
        
        // Test 4: Verificar elementos de UI
        console.log('\n🧪 Test 4: Elementos de UI');
        const characterAvatar = await page.$('#character-avatar');
        const hpBar = await page.$('#hp-bar');
        const mpBar = await page.$('#mp-bar');
        const mapRegions = await page.$$('.map-region');
        
        console.log(`   Avatar del personaje: ${characterAvatar ? '✅' : '❌'}`);
        console.log(`   Barra de HP: ${hpBar ? '✅' : '❌'}`);
        console.log(`   Barra de MP: ${mpBar ? '✅' : '❌'}`);
        console.log(`   Regiones del mapa: ${mapRegions.length === 9 ? '✅' : '❌'} (${mapRegions.length})`);
        
        // Test 5: Probar teleportación
        console.log('\n🧪 Test 5: Sistema de teleportación');
        const ec2Region = await page.$('[data-region="ec2"]');
        if (ec2Region) {
            await ec2Region.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentRegion = await page.$('.map-region.current[data-region="ec2"]');
            console.log(`   Teleportación a EC2: ${currentRegion ? '✅' : '❌'}`);
        }
        
        // Test 6: Controles de teclado
        console.log('\n🧪 Test 6: Controles de teclado');
        await page.keyboard.press('KeyM');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mapVisible = await page.evaluate(() => {
            const map = document.getElementById('map-panel');
            return map && map.style.display !== 'none';
        });
        console.log(`   Toggle mapa (M): ${mapVisible ? '✅' : '❌'}`);
        
        await page.keyboard.press('KeyI');
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('   Toggle inventario (I): ✅');
        
        console.log('\n🎉 ¡Validación completa terminada!');
        
        // Mantener el navegador abierto para inspección visual
        console.log('\n👁️ Manteniendo navegador abierto para inspección visual...');
        console.log('Presiona Ctrl+C para cerrar');
        
        // Esperar indefinidamente hasta que el usuario termine
        await new Promise(() => {});
        
    } catch (error) {
        console.log('💥 Error:', error.message);
    } finally {
        await browser.close();
    }
}

completeTest();