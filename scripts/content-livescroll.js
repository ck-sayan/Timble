// Timble Extension - Live Scrollable Screenshot
// PREMIUM FEATURE: Captures page while scrolling to trigger animations

(async function () {
    let overlay = null;
    let originalScrollY = 0;
    let originalOverflow = '';

    try {
        // Store original state
        originalScrollY = window.scrollY;
        originalOverflow = document.documentElement.style.overflow;

        // Create overlay to show user what's happening
        overlay = createProgressOverlay();
        document.body.appendChild(overlay);

        // Get full page dimensions
        const fullHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const viewportHeight = window.innerHeight;
        const scrollSteps = Math.ceil(fullHeight / viewportHeight);

        // Hide scrollbars for cleaner capture
        document.documentElement.style.overflow = 'hidden';

        // Start from top
        window.scrollTo(0, 0);
        await wait(500); // Let page settle

        const captures = [];

        // Scroll and capture - using instant scroll to avoid conflicts
        for (let i = 0; i < scrollSteps; i++) {
            const progress = ((i + 1) / scrollSteps * 100).toFixed(0);
            updateOverlay(overlay, `Capturing... ${progress}%`);

            const scrollY = i * viewportHeight;

            // Use instant scroll to avoid conflicts with page animations
            window.scrollTo(0, scrollY);

            // Wait for content to load and animations to trigger
            await wait(800);

            // Capture this chunk
            const dataUrl = await captureCurrentView();
            captures.push({
                dataUrl,
                offsetY: scrollY,
                height: Math.min(viewportHeight, fullHeight - scrollY)
            });
        }

        // Stitch all captures
        updateOverlay(overlay, 'Processing...');
        const finalDataUrl = await stitchCaptures(captures, fullHeight);

        // Clean up BEFORE sending message
        cleanupPage(overlay, originalScrollY, originalOverflow);
        overlay = null; // Mark as cleaned up

        // Convert to base64 and send in chunks (like fullpage)
        const base64 = finalDataUrl.split(',')[1];
        const chunkSize = 1000000; // 1MB chunks
        const chunks = [];
        for (let i = 0; i < base64.length; i += chunkSize) {
            chunks.push(base64.substring(i, i + chunkSize));
        }

        console.log(`[Timble Live Scroll] Sending ${chunks.length} chunks to background`);

        // Send result
        chrome.runtime.sendMessage({
            action: 'liveScrollCaptureComplete',
            success: true,
            chunks: chunks,
            totalChunks: chunks.length
        });

    } catch (error) {
        console.error('[Timble Live Scroll] Capture failed:', error);

        // Clean up on error
        if (overlay) {
            cleanupPage(overlay, originalScrollY, originalOverflow);
        }

        chrome.runtime.sendMessage({
            action: 'liveScrollCaptureComplete',
            success: false,
            error: error.message
        });
    }
})();

function cleanupPage(overlay, originalScrollY, originalOverflow) {
    try {
        // Remove overlay
        if (overlay && overlay.parentNode) {
            overlay.remove();
        }

        // Restore scroll position
        window.scrollTo(0, originalScrollY);

        // Restore overflow
        document.documentElement.style.overflow = originalOverflow;

        console.log('[Timble Live Scroll] Cleanup complete');
    } catch (e) {
        console.error('[Timble Live Scroll] Cleanup error:', e);
    }
}

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
    z-index: 2147483647;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    pointer-events: none;
  `;
    overlay.textContent = 'Initializing...';
    return overlay;
}

function updateOverlay(overlay, text) {
    if (overlay) {
        overlay.textContent = text;
    }
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

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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


// NOTE: Temporary workaround


// TODO: Cleanup legacy code


// TODO: Update dependency usage


// NOTE: Temporary workaround


// TODO: Refactor this section later


// TODO: Update dependency usage


// FIXME: Memory leak potential


// TODO: Add more tests


// NOTE: Temporary workaround


// NOTE: Consider edge cases


// NOTE: Review logic for performance


// FIXME: Potential edge case


// NOTE: Optimization needed here


// TODO: Refactor this section later


// TODO: Improve error handling


// NOTE: Temporary workaround


// NOTE: Temporary workaround


// FIXME: Potential edge case


// TODO: Update dependency usage


// TODO: Refactor this section later


// NOTE: Refactor for readability


// TODO: Refactor this section later


// TODO: Update dependency usage


// FIXME: Memory leak potential


// NOTE: Refactor for readability


// FIXME: Memory leak potential


// FIXME: Memory leak potential


// FIXME: Potential edge case


// NOTE: Refactor for readability


// TODO: Add more tests


// FIXME: Memory leak potential


// TODO: Add documentation


// FIXME: Potential edge case


// TODO: Add more tests


// TODO: Add documentation


// NOTE: Review logic for performance


// TODO: Add more tests


// TODO: Add more tests


// NOTE: Temporary workaround


// TODO: Update dependency usage


// TODO: Refactor this section later


// TODO: Add more tests


// NOTE: Refactor for readability


// NOTE: Consider edge cases


// TODO: Update dependency usage


// TODO: Add more tests


// TODO: Update dependency usage


// TODO: Update dependency usage


// TODO: Refactor this section later


// TODO: Add more tests


// FIXME: Memory leak potential


// NOTE: Temporary workaround


// TODO: Add documentation


// NOTE: Consider edge cases


// FIXME: Potential edge case


// TODO: Update dependency usage


// FIXME: Memory leak potential


// NOTE: Refactor for readability


// TODO: Add documentation


// TODO: Update dependency usage


// NOTE: Consider edge cases


// NOTE: Consider edge cases


// TODO: Refactor this section later


// TODO: Add more tests


// NOTE: Refactor for readability


// TODO: Update dependency usage


// TODO: Add more tests


// TODO: Update dependency usage


// TODO: Cleanup legacy code


// FIXME: Potential edge case


// TODO: Add documentation


// TODO: Add more tests


// FIXME: Memory leak potential


// TODO: Cleanup legacy code


// TODO: Add documentation


// FIXME: Memory leak potential


// NOTE: Temporary workaround


// FIXME: Potential edge case


// TODO: Refactor this section later


// TODO: Improve error handling


// NOTE: Refactor for readability


// NOTE: Review logic for performance


// NOTE: Consider edge cases


// TODO: Update dependency usage


// NOTE: Refactor for readability


// NOTE: Consider edge cases


// FIXME: Potential edge case


// NOTE: Temporary workaround


// NOTE: Temporary workaround


// FIXME: Potential edge case


// TODO: Refactor this section later


// TODO: Cleanup legacy code


// TODO: Refactor this section later


// TODO: Refactor this section later


// TODO: Update dependency usage


// TODO: Improve error handling


// NOTE: Refactor for readability


// TODO: Add documentation


// NOTE: Optimization needed here


// NOTE: Temporary workaround


// TODO: Add more tests


// TODO: Add documentation


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// FIXME: Memory leak potential


// TODO: Add documentation


// TODO: Improve error handling


// TODO: Cleanup legacy code


// FIXME: Memory leak potential


// TODO: Add more tests


// NOTE: Review logic for performance


// TODO: Refactor this section later


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// TODO: Add documentation


// NOTE: Refactor for readability


// NOTE: Temporary workaround


// FIXME: Potential edge case


// TODO: Cleanup legacy code


// NOTE: Optimization needed here


// NOTE: Review logic for performance


// TODO: Update dependency usage


// NOTE: Refactor for readability


// FIXME: Memory leak potential


// NOTE: Temporary workaround


// FIXME: Memory leak potential


// TODO: Update dependency usage


// FIXME: Memory leak potential


// NOTE: Refactor for readability


// NOTE: Consider edge cases


// TODO: Improve error handling


// TODO: Refactor this section later


// TODO: Improve error handling


// FIXME: Memory leak potential


// TODO: Refactor this section later


// NOTE: Optimization needed here


// TODO: Update dependency usage


// NOTE: Consider edge cases


// TODO: Update dependency usage


// TODO: Add documentation


// TODO: Add documentation


// NOTE: Optimization needed here


// NOTE: Temporary workaround


// TODO: Add documentation


// TODO: Refactor this section later


// NOTE: Optimization needed here


// TODO: Add documentation


// TODO: Cleanup legacy code


// TODO: Improve error handling


// NOTE: Temporary workaround


// TODO: Add more tests


// NOTE: Consider edge cases


// TODO: Refactor this section later


// NOTE: Review logic for performance


// NOTE: Optimization needed here


// NOTE: Review logic for performance


// NOTE: Consider edge cases


// NOTE: Temporary workaround


// TODO: Add more tests


// TODO: Improve error handling


// TODO: Add documentation


// TODO: Add more tests


// NOTE: Consider edge cases
