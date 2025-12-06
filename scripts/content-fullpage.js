// Timble Extension - Full Page Screenshot Capture
// FREE FEATURE: Simpler approach using direct blob conversion

(async function () {
    console.log('[Timble] Full page capture started');

    try {
        // Helper to hide fixed elements
        const hideFixedElements = () => {
            const elements = document.querySelectorAll('*');
            const hiddenElements = [];

            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if ((style.position === 'fixed' || style.position === 'sticky') && el.offsetHeight > 0) {
                    el.dataset.timbleOriginalVisibility = el.style.visibility;
                    el.style.visibility = 'hidden';
                    hiddenElements.push(el);
                }
            });
            return hiddenElements;
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
        const originalScrollX = window.scrollX;
        const originalScrollY = window.scrollY;

        // Use overlap to prevent gaps/black lines
        const overlap = 10; // 10px overlap
        const stepSize = dimensions.viewportHeight - overlap;
        const scrollSteps = Math.ceil(dimensions.height / stepSize);
        const screenshots = [];

        // Hide scrollbars for cleaner capture
        const originalOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';

        // Capture each section
        for (let i = 0; i < scrollSteps; i++) {
            let scrollY = i * stepSize;

            // Ensure we don't scroll past the bottom
            if (scrollY + dimensions.viewportHeight > dimensions.height) {
                scrollY = dimensions.height - dimensions.viewportHeight;
                if (scrollY < 0) scrollY = 0;
            }

            window.scrollTo(0, scrollY);

            // Hide fixed elements after the first screenshot to avoid duplication
            let hiddenElements = [];
            if (i > 0) {
                hiddenElements = hideFixedElements();
            }

            await new Promise(resolve => setTimeout(resolve, 300));

            const dataUrl = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (response) => {
                    if (response?.dataUrl) resolve(response.dataUrl);
                    else reject(new Error('No data URL'));
                });
            });

            // Restore elements immediately after capture
            if (i > 0) {
                restoreFixedElements(hiddenElements);
            }

            screenshots.push({
                dataUrl: dataUrl,
                offsetY: scrollY,
                height: dimensions.viewportHeight
            });

            // If we reached the bottom, stop
            if (scrollY + dimensions.viewportHeight >= dimensions.height) {
                break;
            }
        }

        // Restore state
        window.scrollTo(originalScrollX, originalScrollY);
        document.documentElement.style.overflow = originalOverflow;

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
        chrome.runtime.sendMessage({
            action: 'fullPageCaptureComplete',
            success: false,
            error: error.message
        });
    }
})();


// TODO: Cleanup legacy code


// NOTE: Consider edge cases


// TODO: Add documentation


// NOTE: Consider edge cases


// NOTE: Optimization needed here


// TODO: Add documentation


// NOTE: Consider edge cases


// FIXME: Memory leak potential


// TODO: Refactor this section later
