

export default defineUnlistedScript({
    main() {
        (async function () {
            try {
                // Create selection overlay
                const overlay = createSelectionOverlay();
                document.body.appendChild(overlay);

                // Wait for user to select area
                const selection = await getUserSelection(overlay);

                if (!selection) {
                    throw new Error('Selection cancelled');
                }

                // Capture the selected area
                const dataUrl = await captureArea(selection);

                // Clean up
                overlay.remove();

                // Send result
                chrome.runtime.sendMessage({
                    action: 'areaSelectCaptureComplete',
                    success: true,
                    dataUrl: dataUrl
                });

            } catch (error: any) {
                chrome.runtime.sendMessage({
                    action: 'areaSelectCaptureComplete',
                    success: false,
                    error: error.message
                });
            }
        })();

        function createSelectionOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'timble-selection-overlay';
            overlay.innerHTML = `
        <div id="timble-selection-box"></div>
        <div id="timble-instructions">
          Click and drag to select area • Press ESC to cancel
        </div>
      `;

            const style = document.createElement('style');
            style.textContent = `
        #timble-selection-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999998;
          cursor: crosshair;
        }
        #timble-selection-box {
          position: absolute;
          border: 2px dashed #667eea;
          background: rgba(102, 126, 234, 0.1);
          display: none;
        }
        #timble-instructions {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 600;
          z-index: 999999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `;
            document.head.appendChild(style);

            return overlay;
        }

        function getUserSelection(overlay: HTMLElement): Promise<any> {
            return new Promise((resolve, reject) => {
                const selectionBox = overlay.querySelector('#timble-selection-box') as HTMLElement;
                let startX: number, startY: number, isSelecting = false;

                overlay.addEventListener('mousedown', (e) => {
                    isSelecting = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    selectionBox.style.left = startX + 'px';
                    selectionBox.style.top = startY + 'px';
                    selectionBox.style.width = '0px';
                    selectionBox.style.height = '0px';
                    selectionBox.style.display = 'block';
                });

                overlay.addEventListener('mousemove', (e) => {
                    if (!isSelecting) return;

                    const currentX = e.clientX;
                    const currentY = e.clientY;

                    const width = Math.abs(currentX - startX);
                    const height = Math.abs(currentY - startY);
                    const left = Math.min(startX, currentX);
                    const top = Math.min(startY, currentY);

                    selectionBox.style.left = left + 'px';
                    selectionBox.style.top = top + 'px';
                    selectionBox.style.width = width + 'px';
                    selectionBox.style.height = height + 'px';
                });

                overlay.addEventListener('mouseup', (e) => {
                    if (!isSelecting) return;
                    isSelecting = false;

                    const rect = selectionBox.getBoundingClientRect();

                    if (rect.width < 10 || rect.height < 10) {
                        reject(new Error('Selection too small'));
                        return;
                    }

                    resolve({
                        x: rect.left,
                        y: rect.top,
                        width: rect.width,
                        height: rect.height
                    });
                });

                // Cancel on ESC
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        resolve(null);
                    }
                }, { once: true });
            });
        }

        async function captureArea(selection: any) {
            // HIDE OVERLAY BEFORE CAPTURE
            const overlay = document.getElementById('timble-selection-overlay');
            if (overlay) overlay.style.visibility = 'hidden';

            // Short wait to ensure render update
            await new Promise(resolve => setTimeout(resolve, 200));

            // Capture full viewport first
            const fullCapture = await new Promise<string>((resolve) => {
                chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (response) => {
                    resolve(response?.dataUrl || '');
                });
            });

            // Restore overlay (optional, but good for UX if we were continuing)
            if (overlay) overlay.remove(); // We are done anyway

            // Crop to selected area with high DPI support
            const devicePixelRatio = window.devicePixelRatio || 1;
            const canvas = document.createElement('canvas');
            canvas.width = selection.width * devicePixelRatio;
            canvas.height = selection.height * devicePixelRatio;
            const ctx = canvas.getContext('2d');

            if (!ctx) throw new Error('Could not get canvas context');

            const img = new Image();
            await new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.src = fullCapture;
            });

            ctx.drawImage(
                img,
                selection.x * devicePixelRatio,
                selection.y * devicePixelRatio,
                selection.width * devicePixelRatio,
                selection.height * devicePixelRatio,
                0, 0,
                selection.width * devicePixelRatio,
                selection.height * devicePixelRatio
            );

            return canvas.toDataURL('image/png');
        }
    },
});


// NOTE: Refactor for readability


// TODO: Add documentation


// TODO: Update dependency usage


// TODO: Refactor this section later


// TODO: Cleanup legacy code


// TODO: Add documentation


// FIXME: Memory leak potential


// NOTE: Optimization needed here


// TODO: Add documentation


// TODO: Refactor this section later


// NOTE: Consider edge cases


// TODO: Cleanup legacy code


// TODO: Add documentation


// TODO: Add documentation


// TODO: Cleanup legacy code


// TODO: Refactor this section later


// TODO: Improve error handling


// TODO: Add documentation


// FIXME: Memory leak potential


// TODO: Improve error handling


// TODO: Improve error handling


// TODO: Update dependency usage


// NOTE: Refactor for readability


// TODO: Cleanup legacy code


// FIXME: Potential edge case


// FIXME: Potential edge case


// TODO: Add more tests


// TODO: Update dependency usage


// TODO: Improve error handling


// NOTE: Refactor for readability


// TODO: Add documentation


// NOTE: Refactor for readability


// TODO: Add documentation


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// TODO: Cleanup legacy code


// FIXME: Memory leak potential


// TODO: Add more tests


// FIXME: Memory leak potential


// TODO: Add more tests


// NOTE: Temporary workaround


// TODO: Improve error handling


// FIXME: Memory leak potential


// TODO: Refactor this section later


// NOTE: Refactor for readability


// TODO: Improve error handling


// NOTE: Optimization needed here


// NOTE: Review logic for performance


// TODO: Cleanup legacy code


// FIXME: Potential edge case


// NOTE: Refactor for readability


// NOTE: Consider edge cases


// NOTE: Refactor for readability


// NOTE: Optimization needed here


// TODO: Add more tests


// TODO: Refactor this section later


// TODO: Refactor this section later


// NOTE: Optimization needed here


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// TODO: Refactor this section later


// TODO: Improve error handling


// TODO: Improve error handling


// TODO: Add documentation


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// TODO: Improve error handling


// TODO: Add more tests


// FIXME: Potential edge case


// NOTE: Optimization needed here


// TODO: Refactor this section later


// TODO: Update dependency usage


// TODO: Add more tests


// TODO: Cleanup legacy code


// FIXME: Potential edge case


// NOTE: Review logic for performance


// TODO: Cleanup legacy code


// TODO: Add more tests


// TODO: Cleanup legacy code


// NOTE: Optimization needed here


// TODO: Improve error handling


// TODO: Update dependency usage


// NOTE: Optimization needed here


// NOTE: Review logic for performance


// FIXME: Potential edge case


// TODO: Improve error handling


// TODO: Improve error handling


// TODO: Improve error handling


// NOTE: Temporary workaround


// FIXME: Potential edge case


// NOTE: Refactor for readability


// TODO: Improve error handling


// TODO: Add documentation


// TODO: Add more tests


// TODO: Cleanup legacy code


// TODO: Add more tests


// TODO: Improve error handling


// TODO: Cleanup legacy code


// NOTE: Refactor for readability


// TODO: Update dependency usage


// TODO: Improve error handling


// NOTE: Review logic for performance


// NOTE: Optimization needed here


// TODO: Update dependency usage


// NOTE: Optimization needed here


// NOTE: Consider edge cases


// TODO: Add documentation


// TODO: Add more tests


// NOTE: Review logic for performance


// NOTE: Review logic for performance


// TODO: Update dependency usage


// NOTE: Review logic for performance


// NOTE: Optimization needed here
