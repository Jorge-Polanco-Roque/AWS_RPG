const puppeteer = require('puppeteer');

async function testButtons() {
    console.log('🚀 Iniciando validación de botones con Puppeteer...');
    
    const browser = await puppeteer.launch({ 
        headless: false, // Para ver qué está pasando
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Escuchar errores de consola
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ Error de consola:', msg.text());
        } else if (msg.type() === 'log') {
            console.log('📝 Log:', msg.text());
        }
    });
    
    // Escuchar errores de página
    page.on('pageerror', error => {
        console.log('💥 Error de página:', error.message);
    });
    
    try {
        // Navegar a la aplicación
        console.log('🌐 Navegando a http://localhost:3030');
        await page.goto('http://localhost:3030', { 
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        
        console.log('✅ Página cargada exitosamente');
        
        // Esperar a que aparezcan los botones
        await page.waitForSelector('#start-adventure-btn', { timeout: 5000 });
        console.log('✅ Botón "Begin Adventure" encontrado');
        
        // Verificar que todos los botones están presentes
        const buttons = [
            '#start-adventure-btn',
            '#show-login-btn', 
            '#show-register-btn'
        ];
        
        for (const buttonId of buttons) {
            const button = await page.$(buttonId);
            if (button) {
                console.log(`✅ Botón ${buttonId} encontrado`);
                
                // Verificar si es clickeable
                const isEnabled = await page.evaluate((id) => {
                    const btn = document.querySelector(id);
                    return btn && !btn.disabled && btn.style.display !== 'none';
                }, buttonId);
                
                console.log(`   Clickeable: ${isEnabled ? '✅' : '❌'}`);
            } else {
                console.log(`❌ Botón ${buttonId} NO encontrado`);
            }
        }
        
        // Intentar hacer click en "Begin Adventure"
        console.log('\n🎯 Intentando hacer click en "Begin Adventure"...');
        await page.click('#start-adventure-btn');
        
        // Esperar un momento para ver si algo cambia
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar si aparece la interfaz de batalla
        const battleInterface = await page.$('.battle-interface');
        if (battleInterface) {
            console.log('✅ Interfaz de batalla apareció correctamente');
        } else {
            console.log('❌ Interfaz de batalla NO apareció');
        }
        
        // Verificar si se oculta la pantalla de bienvenida
        const welcomeScreen = await page.$('#welcome-screen');
        const welcomeHidden = await page.evaluate((el) => {
            return el && (el.style.display === 'none' || el.classList.contains('hidden'));
        }, welcomeScreen);
        
        if (welcomeHidden) {
            console.log('✅ Pantalla de bienvenida se ocultó correctamente');
        } else {
            console.log('❌ Pantalla de bienvenida NO se ocultó');
        }
        
        // Verificar Three.js canvas
        const canvas = await page.$('canvas');
        if (canvas) {
            console.log('✅ Canvas de Three.js encontrado');
        } else {
            console.log('❌ Canvas de Three.js NO encontrado');
        }
        
        // Esperar un poco más para observar
        await new Promise(resolve => setTimeout(resolve, 5000));
        
    } catch (error) {
        console.log('💥 Error durante la prueba:', error.message);
    } finally {
        await browser.close();
        console.log('🏁 Validación completada');
    }
}

// Verificar si el servidor está corriendo
const http = require('http');

function checkServer() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3030', (res) => {
            resolve(true);
        });
        
        req.on('error', () => {
            reject(false);
        });
        
        req.setTimeout(5000, () => {
            req.abort();
            reject(false);
        });
    });
}

async function main() {
    try {
        await checkServer();
        console.log('✅ Servidor detectado en puerto 3030');
        await testButtons();
    } catch (error) {
        console.log('❌ Servidor NO está corriendo en puerto 3030');
        console.log('💡 Ejecuta: npm start');
    }
}

main();