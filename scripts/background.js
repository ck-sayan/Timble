// Timble Extension - Background Service Worker
console.log('Timble background script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request.action);

    if (request.action === 'captureScreenshot') {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (!tabs[0]) {
                sendResponse({ success: false, error: 'No active tab found' });
                return;
            }

            try {
                const result = await handleScreenshotCapture(request.type, tabs[0]);
                sendResponse(result);
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        });
        return true;
    }

    if (request.action === 'captureVisibleTab') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            sendResponse({ dataUrl: dataUrl });
        });
        return true;
    }

    // Handle completion messages
    if (request.action === 'fullPageCaptureComplete') {
        handleCaptureComplete(request, 'fullpage');
        sendResponse({ received: true });
        return true;
    }

    if (request.action === 'liveScrollCaptureComplete') {
        handleCaptureComplete(request, 'livescroll');
        sendResponse({ received: true });
        return true;
    }

    if (request.action === 'areaSelectCaptureComplete') {
        handleCaptureComplete(request, 'area');
        sendResponse({ received: true });
        return true;
    }
});

async function handleScreenshotCapture(type, tab) {
    try {
        console.log('Starting capture:', type);
        let scriptFile = '';

        switch (type) {
            case 'fullPage':
                scriptFile = 'scripts/content-fullpage.js';
                break;
            case 'liveScroll':
                scriptFile = 'scripts/content-livescroll.js';
                break;
            case 'areaSelect':
                scriptFile = 'scripts/content-areaselect.js';
                break;
            default:
                throw new Error('Unknown capture type');
        }

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [scriptFile]
        });

        return { success: true };
    } catch (error) {
        console.error('Capture failed:', error);
        throw error;
    }
}

function handleCaptureComplete(message, type) {
    console.log('Capture complete for:', type, 'Success:', message.success);

    if (message.success) {
        let dataUrl = message.dataUrl;

        // Handle chunked data (used by full page capture)
        if (message.chunks) {
            console.log('Reassembling', message.chunks.length, 'chunks');
            const base64 = message.chunks.join('');
            dataUrl = 'data:image/png;base64,' + base64;
        }

        if (dataUrl) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `timble-${type}-${timestamp}.png`;

            console.log('Downloading:', filename);

            // DIRECT DOWNLOAD using data URL to avoid URL.createObjectURL issues
            chrome.downloads.download({
                url: dataUrl,
                filename: filename,
                saveAs: true
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error('Download failed:', chrome.runtime.lastError.message);
                } else {
                    console.log('Download started, ID:', downloadId);
                }
            });
        } else {
            console.error('No data URL found in message');
        }
    } else {
        console.error('Capture reported failure:', message.error);
    }
}


// NOTE: Temporary workaround


// NOTE: Temporary workaround


// NOTE: Review logic for performance


// NOTE: Consider edge cases


// TODO: Add documentation


// TODO: Refactor this section later


// FIXME: Potential edge case


// NOTE: Temporary workaround


// TODO: Update dependency usage


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// NOTE: Review logic for performance


// NOTE: Optimization needed here


// TODO: Improve error handling


// TODO: Cleanup legacy code


// TODO: Cleanup legacy code


// TODO: Improve error handling


// NOTE: Optimization needed here


// TODO: Refactor this section later


// TODO: Cleanup legacy code


// NOTE: Refactor for readability


// TODO: Refactor this section later
