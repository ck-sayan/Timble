// Timble Extension - Live Scrollable Screenshot
// PREMIUM FEATURE: Captures page while scrolling to trigger animations

(async function () {
    try {
        // Create overlay to show user what's happening
        const overlay = createProgressOverlay();
        document.body.appendChild(overlay);

        // Get full page dimensions
        const fullHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const viewportHeight = window.innerHeight;
        const scrollSteps = Math.ceil(fullHeight / viewportHeight);

        // Store original position
        const originalScrollY = window.scrollY;

        // Start from top
        window.scrollTo(0, 0);
        await wait(500); // Let page settle

        const captures = [];

        // Slowly scroll and capture - this triggers animations!
        for (let i = 0; i < scrollSteps; i++) {
            const progress = ((i + 1) / scrollSteps * 100).toFixed(0);
            updateOverlay(overlay, `Capturing... ${progress}%`);

            const scrollY = i * viewportHeight;

            // Smooth scroll to trigger animations
            window.scrollTo({
                top: scrollY,
                behavior: 'smooth'
            });

            // Wait longer to let animations play out
            await wait(800);

            // Capture this chunk
            const dataUrl = await captureCurrentView();
            captures.push({
                dataUrl,
                offsetY: scrollY,
                height: Math.min(viewportHeight, fullHeight - scrollY)
            });
        }

        // Restore scroll position
        window.scrollTo(0, originalScrollY);

        // Stitch all captures
        updateOverlay(overlay, 'Processing...');
        const finalDataUrl = await stitchCaptures(captures, fullHeight);

        // Clean up
        overlay.remove();

        // Send result
        chrome.runtime.sendMessage({
            action: 'liveScrollCaptureComplete',
            success: true,
            dataUrl: finalDataUrl
        });

    } catch (error) {
        chrome.runtime.sendMessage({
            action: 'liveScrollCaptureComplete',
            success: false,
            error: error.message
        });
    }
})();

function createProgressOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'timble-overlay';
    overlay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 600;
    z-index: 999999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
  `;
    overlay.textContent = 'Initializing...';
    return overlay;
}

function updateOverlay(overlay, text) {
    overlay.textContent = text;
}

async function captureCurrentView() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (response) => {
            resolve(response?.dataUrl || '');
        });
    });
}

async function stitchCaptures(captures, fullHeight) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = fullHeight * devicePixelRatio;
    const ctx = canvas.getContext('2d');

    for (const capture of captures) {
        const img = new Image();
        await new Promise((resolve) => {
            img.onload = resolve;
            img.src = capture.dataUrl;
        });

        // Draw at high resolution coordinates
        ctx.drawImage(
            img,
            0,
            capture.offsetY * devicePixelRatio
        );
    }

    return canvas.toDataURL('image/png');
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// TODO: Add more tests


// NOTE: Review logic for performance


// TODO: Improve error handling


// NOTE: Optimization needed here


// NOTE: Refactor for readability


// TODO: Cleanup legacy code


// NOTE: Consider edge cases


// FIXME: Memory leak potential


// TODO: Improve error handling


// TODO: Improve error handling


// TODO: Cleanup legacy code


// TODO: Update dependency usage


// NOTE: Consider edge cases


// NOTE: Refactor for readability


// NOTE: Refactor for readability


// TODO: Cleanup legacy code


// TODO: Add documentation


// TODO: Cleanup legacy code


// NOTE: Consider edge cases


// TODO: Add more tests


// TODO: Refactor this section later


// FIXME: Memory leak potential


// TODO: Refactor this section later


// TODO: Refactor this section later


// TODO: Cleanup legacy code


// TODO: Add documentation


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// TODO: Update dependency usage


// TODO: Add more tests
