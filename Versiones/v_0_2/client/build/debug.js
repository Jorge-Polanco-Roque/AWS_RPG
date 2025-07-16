// Debug script to test buttons
console.log('🔧 DEBUG: Testing button functionality');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DEBUG: DOM loaded, testing buttons...');
    
    setTimeout(() => {
        const buttons = document.querySelectorAll('.pixel-button');
        console.log('🔧 DEBUG: Found', buttons.length, 'buttons');
        
        buttons.forEach((btn, index) => {
            console.log(`Button ${index}:`, {
                id: btn.id,
                className: btn.className,
                visible: btn.offsetParent !== null,
                pointerEvents: getComputedStyle(btn).pointerEvents,
                zIndex: getComputedStyle(btn).zIndex,
                position: getComputedStyle(btn).position,
                display: getComputedStyle(btn).display,
                opacity: getComputedStyle(btn).opacity
            });
        });
        
        // Test start button specifically
        const startBtn = document.getElementById('start-adventure-btn');
        if (startBtn) {
            console.log('🔧 DEBUG: Start button found');
            console.log('🔧 DEBUG: Start button styles:', {
                pointerEvents: getComputedStyle(startBtn).pointerEvents,
                zIndex: getComputedStyle(startBtn).zIndex,
                position: getComputedStyle(startBtn).position,
                display: getComputedStyle(startBtn).display,
                opacity: getComputedStyle(startBtn).opacity,
                visibility: getComputedStyle(startBtn).visibility,
                cursor: getComputedStyle(startBtn).cursor
            });
            
            // Force click test
            startBtn.addEventListener('click', function() {
                console.log('🎯 DEBUG: Start button clicked successfully!');
            });
            
            // Manual trigger test
            setTimeout(() => {
                console.log('🔧 DEBUG: Triggering manual click...');
                startBtn.click();
            }, 1000);
        } else {
            console.error('❌ DEBUG: Start button not found');
        }
    }, 2000);
});