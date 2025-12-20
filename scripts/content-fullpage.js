// Timble Extension - Full Page Screenshot Capture
// FREE FEATURE: Simpler approach using direct blob conversion

(async function () {
    console.log('[Timble] Full page capture started');

    let originalScrollX = 0;
    let originalScrollY = 0;
    let originalOverflow = '';
    let hiddenElements = [];

    try {
        // Store original state
        originalScrollX = window.scrollX;
        originalScrollY = window.scrollY;
        originalOverflow = document.documentElement.style.overflow;

        // Helper to hide fixed elements
        const hideFixedElements = () => {
            const elements = document.querySelectorAll('*');
            const hidden = [];

            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if ((style.position === 'fixed' || style.position === 'sticky') && el.offsetHeight > 0) {
                    el.dataset.timbleOriginalVisibility = el.style.visibility;
                    el.style.visibility = 'hidden';
                    hidden.push(el);
                }
            });
            return hidden;
        };

        const restoreFixedElements = (elements) => {
            elements.forEach(el => {
                el.style.visibility = el.dataset.timbleOriginalVisibility || '';
                delete el.dataset.timbleOriginalVisibility;
            });
        };

        const getPageDimensions = () => {
            const body = document.body;
            const html = document.documentElement;

            return {
                width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth),
                height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio || 1
            };
        };

        const dimensions = getPageDimensions();
        console.log('[Timble] Page dimensions:', dimensions);

        // Use overlap to prevent gaps/black lines
        const overlap = 10; // 10px overlap
        const stepSize = dimensions.viewportHeight - overlap;
        const scrollSteps = Math.ceil(dimensions.height / stepSize);
        const screenshots = [];

        console.log('[Timble] Will capture', scrollSteps, 'sections');

        // Hide scrollbars for cleaner capture
        document.documentElement.style.overflow = 'hidden';

        // Capture each section
        for (let i = 0; i < scrollSteps; i++) {
            let scrollY = i * stepSize;

            // Ensure we don't scroll past the bottom
            if (scrollY + dimensions.viewportHeight > dimensions.height) {
                scrollY = Math.max(0, dimensions.height - dimensions.viewportHeight);
            }

            console.log(`[Timble] Capturing section ${i + 1}/${scrollSteps} at scrollY=${scrollY}`);

            window.scrollTo(0, scrollY);

            // Hide fixed elements after the first screenshot to avoid duplication
            if (i > 0) {
                hiddenElements = hideFixedElements();
            }

            await new Promise(resolve => setTimeout(resolve, 400)); // Increased delay

            // Retry logic for captureVisibleTab (Chrome rate limits after ~15 captures)
            let dataUrl = null;
            let retries = 3;

            for (let attempt = 0; attempt < retries; attempt++) {
                try {
                    dataUrl = await new Promise((resolve, reject) => {
                        chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (response) => {
                            if (chrome.runtime.lastError) {
                                reject(new Error(chrome.runtime.lastError.message));
                            } else if (response?.dataUrl) {
                                resolve(response.dataUrl);
                            } else {
                                reject(new Error('No data URL in response'));
                            }
                        });
                    });
                    break; // Success, exit retry loop
                } catch (err) {
                    console.warn(`[Timble] Capture attempt ${attempt + 1} failed:`, err.message);
                    if (attempt < retries - 1) {
                        // Wait longer before retry (exponential backoff)
                        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
                    } else {
                        throw new Error(`Failed after ${retries} attempts: ${err.message}`);
                    }
                }
            }

            // Restore elements immediately after capture
            if (i > 0) {
                restoreFixedElements(hiddenElements);
                hiddenElements = [];
            }

            screenshots.push({
                dataUrl: dataUrl,
                offsetY: scrollY,
                height: dimensions.viewportHeight
            });

            // If we reached the bottom, stop
            if (scrollY + dimensions.viewportHeight >= dimensions.height) {
                console.log('[Timble] Reached bottom, stopping');
                break;
            }
        }

        console.log('[Timble] Captured', screenshots.length, 'sections, stitching...');

        // Stitch screenshots
        const canvas = document.createElement('canvas');
        // Use device pixel ratio for high resolution
        canvas.width = dimensions.viewportWidth * dimensions.devicePixelRatio;
        canvas.height = dimensions.height * dimensions.devicePixelRatio;
        const ctx = canvas.getContext('2d');

        // Fill with white first to prevent transparency/black lines
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const screenshot of screenshots) {
            const img = new Image();
            await new Promise((resolve) => {
                img.onload = () => {
                    // Draw image at correct position, scaled by pixel ratio
                    ctx.drawImage(
                        img,
                        0,
                        screenshot.offsetY * dimensions.devicePixelRatio
                    );
                    resolve();
                };
                img.src = screenshot.dataUrl;
            });
        }

        console.log('[Timble] Stitching complete, converting to blob...');

        // Convert to blob and send
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            const chunkSize = 1000000;
            const chunks = [];
            for (let i = 0; i < base64.length; i += chunkSize) {
                chunks.push(base64.substring(i, i + chunkSize));
            }

            console.log(`[Timble] Sending ${chunks.length} chunks to background`);

            // Restore page state BEFORE sending message
            cleanupPage(originalScrollX, originalScrollY, originalOverflow, hiddenElements);

            chrome.runtime.sendMessage({
                action: 'fullPageCaptureComplete',
                success: true,
                chunks: chunks,
                totalChunks: chunks.length
            });
        };
        reader.readAsDataURL(blob);

    } catch (error) {
        console.error('[Timble] Capture failed:', error);

        // Clean up on error
        cleanupPage(originalScrollX, originalScrollY, originalOverflow, hiddenElements);

        chrome.runtime.sendMessage({
            action: 'fullPageCaptureComplete',
            success: false,
            error: error.message
        });
    }
})();

function cleanupPage(scrollX, scrollY, overflow, hiddenElements) {
    try {
        console.log('[Timble] Cleaning up page state...');

        // Restore hidden elements
        if (hiddenElements && hiddenElements.length > 0) {
            hiddenElements.forEach(el => {
                el.style.visibility = el.dataset.timbleOriginalVisibility || '';
                delete el.dataset.timbleOriginalVisibility;
            });
        }

        // Restore scroll position
        window.scrollTo(scrollX, scrollY);

        // Restore overflow
        document.documentElement.style.overflow = overflow;

        console.log('[Timble] Cleanup complete');
    } catch (e) {
        console.error('[Timble] Cleanup error:', e);
    }
}


// TODO: Cleanup legacy code


// TODO: Add more tests


// TODO: Improve error handling


// TODO: Add documentation


// NOTE: Temporary workaround


// TODO: Add more tests


// NOTE: Refactor for readability


// TODO: Cleanup legacy code


// TODO: Add documentation


// TODO: Update dependency usage


// NOTE: Review logic for performance


// FIXME: Potential edge case


// TODO: Add documentation


// TODO: Cleanup legacy code


// TODO: Improve error handling


// NOTE: Temporary workaround
