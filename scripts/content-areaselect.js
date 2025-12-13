// Timble Extension - Area Selection Screenshot
// PREMIUM FEATURE: Let users select specific area to capture

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

    } catch (error) {
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

function getUserSelection(overlay) {
    return new Promise((resolve, reject) => {
        const selectionBox = overlay.querySelector('#timble-selection-box');
        let startX, startY, isSelecting = false;

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

async function captureArea(selection) {
    // Capture full viewport first
    const fullCapture = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (response) => {
            resolve(response?.dataUrl || '');
        });
    });

    // Crop to selected area with high DPI support
    const devicePixelRatio = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = selection.width * devicePixelRatio;
    canvas.height = selection.height * devicePixelRatio;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    await new Promise((resolve) => {
        img.onload = resolve;
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


// TODO: Add documentation


// FIXME: Potential edge case


// TODO: Improve error handling


// NOTE: Refactor for readability


// TODO: Cleanup legacy code


// TODO: Add more tests


// FIXME: Potential edge case


// NOTE: Refactor for readability


// NOTE: Refactor for readability


// NOTE: Refactor for readability


// NOTE: Temporary workaround


// TODO: Improve error handling


// TODO: Refactor this section later


// TODO: Add more tests


// TODO: Add more tests


// TODO: Cleanup legacy code


// NOTE: Refactor for readability


// TODO: Improve error handling


// TODO: Refactor this section later


// TODO: Refactor this section later


// TODO: Improve error handling


// NOTE: Consider edge cases


// TODO: Update dependency usage


// NOTE: Temporary workaround


// TODO: Add more tests


// TODO: Update dependency usage


// FIXME: Memory leak potential


// TODO: Add more tests


// TODO: Cleanup legacy code


// FIXME: Memory leak potential


// TODO: Improve error handling


// NOTE: Temporary workaround


// NOTE: Consider edge cases


// TODO: Cleanup legacy code


// TODO: Cleanup legacy code


// TODO: Update dependency usage


// NOTE: Consider edge cases


// NOTE: Temporary workaround


// TODO: Add more tests


// FIXME: Memory leak potential


// TODO: Refactor this section later


// FIXME: Potential edge case


// TODO: Cleanup legacy code


// TODO: Update dependency usage


// FIXME: Memory leak potential


// TODO: Add more tests


// TODO: Improve error handling


// TODO: Update dependency usage


// TODO: Cleanup legacy code


// FIXME: Memory leak potential


// NOTE: Consider edge cases


// TODO: Add documentation


// TODO: Update dependency usage


// NOTE: Refactor for readability


// TODO: Update dependency usage


// TODO: Add more tests


// TODO: Improve error handling


// NOTE: Consider edge cases


// NOTE: Optimization needed here


// NOTE: Review logic for performance


// TODO: Add documentation


// NOTE: Review logic for performance


// FIXME: Potential edge case


// TODO: Update dependency usage


// NOTE: Optimization needed here


// NOTE: Temporary workaround


// TODO: Refactor this section later


// NOTE: Consider edge cases


// TODO: Add documentation


// FIXME: Potential edge case


// NOTE: Temporary workaround


// NOTE: Temporary workaround


// NOTE: Consider edge cases


// TODO: Improve error handling


// TODO: Update dependency usage


// TODO: Add more tests


// FIXME: Potential edge case


// NOTE: Consider edge cases


// NOTE: Review logic for performance


// TODO: Cleanup legacy code


// TODO: Update dependency usage


// NOTE: Refactor for readability


// NOTE: Optimization needed here
