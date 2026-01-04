

export default defineUnlistedScript({
    main() {
        console.log('[Timble] Full page capture started');
        // ... (rest of the code is same, just wrapped)
        // I will copy the code from previous step but change the wrapper
        (async function () {
            let originalScrollX = 0;
            let originalScrollY = 0;
            let originalOverflow = '';
            let hiddenElements: HTMLElement[] = [];

            try {
                // Store original state
                originalScrollX = window.scrollX;
                originalScrollY = window.scrollY;
                originalOverflow = document.documentElement.style.overflow;

                // Helper to hide fixed elements
                const hideFixedElements = () => {
                    const elements = document.querySelectorAll('*');
                    const hidden: HTMLElement[] = [];

                    elements.forEach((el: any) => {
                        const style = window.getComputedStyle(el);
                        if ((style.position === 'fixed' || style.position === 'sticky') && el.offsetHeight > 0) {
                            el.dataset.timbleOriginalVisibility = el.style.visibility;
                            el.style.visibility = 'hidden';
                            hidden.push(el);
                        }
                    });
                    return hidden;
                };

                const restoreFixedElements = (elements: HTMLElement[]) => {
                    elements.forEach((el: any) => {
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
                const screenshots: any[] = [];

                console.log('[Timble] Will capture', scrollSteps, 'sections');

                // Hide scrollbars for cleaner capture
                document.documentElement.style.overflow = 'hidden';

                // Create and add overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4f46e5;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-family: system-ui;
                    z-index: 999999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                `;
                overlay.textContent = 'Preparing Full Page Capture...';
                document.body.appendChild(overlay);

                const updateOverlay = (text: string) => {
                    if (overlay) overlay.textContent = text;
                };

                // Capture each section
                for (let i = 0; i < scrollSteps; i++) {
                    const progress = Math.round(((i + 1) / scrollSteps) * 100);
                    updateOverlay(`Capturing... ${progress}%`);

                    let scrollY = i * stepSize;
                    // ... (rest of logic)

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

                    // IMPORTANT: Hide overlay before capture so it doesn't appear in screenshot
                    overlay.style.visibility = 'hidden';
                    await new Promise(resolve => setTimeout(resolve, 400)); // Increased delay

                    // Retry logic for captureVisibleTab
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
                        } catch (err: any) {
                            console.warn(`[Timble] Capture attempt ${attempt + 1} failed:`, err.message);
                            if (attempt < retries - 1) {
                                await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
                            } else {
                                throw new Error(`Failed after ${retries} attempts: ${err.message}`);
                            }
                        }
                    }

                    // Restore overlay visibility
                    overlay.style.visibility = 'visible';

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

                updateOverlay('Stitching images...');
                console.log('[Timble] Captured', screenshots.length, 'sections, stitching...');

                // Stitch screenshots
                const canvas = document.createElement('canvas');
                // ... (stitching logic) ... 
                // Use device pixel ratio for high resolution
                canvas.width = dimensions.viewportWidth * dimensions.devicePixelRatio;
                canvas.height = dimensions.height * dimensions.devicePixelRatio;
                const ctx = canvas.getContext('2d');

                if (!ctx) throw new Error('Could not get canvas context');

                // Fill with white first to prevent transparency/black lines
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                for (const screenshot of screenshots) {
                    const img = new Image();
                    await new Promise<void>((resolve) => {
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
                updateOverlay('Saving...');

                // Convert to blob and send
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));

                if (!blob) throw new Error('Blob creation failed');

                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    const base64 = result.split(',')[1];
                    const chunkSize = 1000000;
                    const chunks = [];
                    for (let i = 0; i < base64.length; i += chunkSize) {
                        chunks.push(base64.substring(i, i + chunkSize));
                    }

                    console.log(`[Timble] Sending ${chunks.length} chunks to background`);

                    // Clean up before sending
                    if (overlay) overlay.remove();
                    cleanupPage(originalScrollX, originalScrollY, originalOverflow, hiddenElements);

                    chrome.runtime.sendMessage({
                        action: 'fullPageCaptureComplete',
                        success: true,
                        chunks: chunks,
                        totalChunks: chunks.length
                    });
                };
                reader.readAsDataURL(blob);

            } catch (error: any) {
                console.error('[Timble] Capture failed:', error);

                // Clean up on error
                const overlay = document.querySelector('div[style*="background: #4f46e5"]'); // Simple selector for our overlay
                if (overlay) overlay.remove();

                cleanupPage(originalScrollX, originalScrollY, originalOverflow, hiddenElements);

                chrome.runtime.sendMessage({
                    action: 'fullPageCaptureComplete',
                    success: false,
                    error: error.message
                });
            }
        })();

        function cleanupPage(scrollX: number, scrollY: number, overflow: string, hiddenElements: HTMLElement[]) {
            try {
                console.log('[Timble] Cleaning up page state...');

                // Restore hidden elements
                if (hiddenElements && hiddenElements.length > 0) {
                    hiddenElements.forEach((el: any) => {
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
    },
});


// NOTE: Refactor for readability


// TODO: Add more tests


// NOTE: Temporary workaround


// TODO: Add more tests


// NOTE: Refactor for readability


// NOTE: Review logic for performance


// NOTE: Refactor for readability


// TODO: Add more tests


// TODO: Refactor this section later


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// TODO: Add more tests


// NOTE: Temporary workaround


// TODO: Improve error handling


// TODO: Cleanup legacy code


// TODO: Refactor this section later


// NOTE: Temporary workaround


// NOTE: Consider edge cases


// TODO: Add documentation


// FIXME: Memory leak potential


// NOTE: Optimization needed here


// NOTE: Optimization needed here


// TODO: Add documentation


// NOTE: Consider edge cases


// FIXME: Potential edge case


// NOTE: Consider edge cases


// NOTE: Consider edge cases


// FIXME: Potential edge case


// NOTE: Consider edge cases


// FIXME: Memory leak potential


// NOTE: Consider edge cases


// FIXME: Memory leak potential


// TODO: Add documentation


// FIXME: Memory leak potential


// NOTE: Consider edge cases


// TODO: Cleanup legacy code


// NOTE: Review logic for performance


// TODO: Add more tests


// TODO: Cleanup legacy code


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// TODO: Add more tests


// NOTE: Optimization needed here


// TODO: Add more tests


// FIXME: Potential edge case


// NOTE: Optimization needed here


// NOTE: Review logic for performance


// NOTE: Temporary workaround


// TODO: Improve error handling


// NOTE: Consider edge cases


// TODO: Improve error handling


// TODO: Add more tests


// TODO: Add more tests


// TODO: Add documentation


// NOTE: Optimization needed here


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// NOTE: Consider edge cases


// TODO: Refactor this section later


// FIXME: Memory leak potential


// TODO: Refactor this section later


// TODO: Refactor this section later


// TODO: Add documentation


// NOTE: Refactor for readability


// NOTE: Refactor for readability


// NOTE: Temporary workaround


// FIXME: Potential edge case


// FIXME: Memory leak potential


// TODO: Improve error handling


// NOTE: Consider edge cases


// TODO: Add more tests


// NOTE: Consider edge cases


// NOTE: Refactor for readability


// TODO: Cleanup legacy code


// TODO: Add documentation


// TODO: Add documentation


// NOTE: Refactor for readability


// NOTE: Refactor for readability


// NOTE: Review logic for performance


// TODO: Add documentation


// TODO: Add documentation


// TODO: Cleanup legacy code


// TODO: Improve error handling


// FIXME: Memory leak potential


// NOTE: Temporary workaround


// NOTE: Review logic for performance


// FIXME: Memory leak potential


// TODO: Cleanup legacy code


// TODO: Add documentation
