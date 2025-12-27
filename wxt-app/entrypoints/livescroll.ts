

export default defineUnlistedScript({
    main() {
        (async function () {
            let overlay: HTMLElement | null = null;
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

                const captures: any[] = [];

                // Scroll and capture - using instant scroll to avoid conflicts
                for (let i = 0; i < scrollSteps; i++) {
                    const progress = ((i + 1) / scrollSteps * 100).toFixed(0);
                    updateOverlay(overlay, `Capturing... ${progress}%`);

                    const scrollY = i * viewportHeight;

                    // Use instant scroll to avoid conflicts with page animations
                    window.scrollTo(0, scrollY);

                    // Wait for content to load and animations to trigger
                    await wait(800);

                    // Hide overlay specifically for capture
                    if (overlay) overlay.style.visibility = 'hidden';
                    await wait(250); // Increased wait time to ensure overlay is gone

                    // Capture this chunk
                    const dataUrl = await captureCurrentView();

                    // Restore overlay
                    if (overlay) overlay.style.visibility = 'visible';
                    await wait(50);

                    captures.push({
                        dataUrl,
                        offsetY: scrollY,
                        // Use actual image height later, but estimate here
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

            } catch (error: any) {
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

        function cleanupPage(overlay: HTMLElement | null, originalScrollY: number, originalOverflow: string) {
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

        function updateOverlay(overlay: HTMLElement | null, text: string) {
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

        async function stitchCaptures(captures: any[], fullHeight: number) {
            const devicePixelRatio = window.devicePixelRatio || 1;
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth * devicePixelRatio;
            canvas.height = fullHeight * devicePixelRatio;
            const ctx = canvas.getContext('2d');

            if (!ctx) throw new Error('Could not get canvas context');

            // Fill with white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let index = 0; index < captures.length; index++) {
                const capture = captures[index];
                const img = new Image();
                await new Promise<void>((resolve) => {
                    img.onload = () => resolve();
                    img.src = capture.dataUrl;
                });

                // Draw at high resolution coordinates with 1px overlap to prevent gaps
                ctx.drawImage(
                    img,
                    0,
                    // Use Math.floor to ensure integer alignment
                    Math.floor(capture.offsetY * devicePixelRatio) - (index > 0 ? 1 : 0)
                );
            }

            return canvas.toDataURL('image/png');
        }

        function wait(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },
});


// NOTE: Review logic for performance


// NOTE: Refactor for readability


// FIXME: Potential edge case


// TODO: Update dependency usage


// FIXME: Memory leak potential


// TODO: Update dependency usage


// TODO: Cleanup legacy code


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// TODO: Improve error handling


// NOTE: Review logic for performance


// NOTE: Optimization needed here


// TODO: Improve error handling


// NOTE: Optimization needed here


// TODO: Improve error handling


// TODO: Add documentation


// NOTE: Review logic for performance


// TODO: Cleanup legacy code


// NOTE: Refactor for readability


// TODO: Update dependency usage


// NOTE: Optimization needed here


// TODO: Add more tests


// FIXME: Potential edge case


// NOTE: Temporary workaround


// TODO: Improve error handling


// TODO: Improve error handling


// NOTE: Temporary workaround


// NOTE: Review logic for performance


// NOTE: Temporary workaround


// NOTE: Temporary workaround


// NOTE: Consider edge cases


// TODO: Improve error handling


// TODO: Refactor this section later


// NOTE: Review logic for performance


// TODO: Update dependency usage


// NOTE: Optimization needed here


// NOTE: Consider edge cases


// FIXME: Potential edge case


// NOTE: Temporary workaround


// NOTE: Temporary workaround


// NOTE: Refactor for readability


// TODO: Cleanup legacy code
