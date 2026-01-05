// @ts-ignore
import fullpagePath from './fullpage?script';
// @ts-ignore
import livescrollPath from './livescroll?script';
// @ts-ignore
import areaselectPath from './areaselect?script';

export default defineBackground(() => {
  console.log('Timble background script loaded');

  // Visual indicator that background script is running
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.action.setBadgeBackgroundColor({ color: '#4caf50' });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request.action);

    if (request.action === 'captureScreenshot') {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (!tabs[0]?.id) {
          sendResponse({ success: false, error: 'No active tab found' });
          return;
        }

        try {
          const result = await handleScreenshotCapture(request.type, tabs[0].id);
          sendResponse(result);
        } catch (error: any) {
          sendResponse({ success: false, error: error.message });
        }
      });
      return true;
    }

    if (request.action === 'captureVisibleTab') {
      chrome.tabs.captureVisibleTab(null as any, { format: 'png' }, (dataUrl) => {
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

  async function handleScreenshotCapture(type: string, tabId: number) {
    try {
      console.log('Starting capture:', type);
      let scriptFile = '';

      switch (type) {
        case 'fullPage':
          scriptFile = fullpagePath;
          break;
        case 'liveScroll':
          scriptFile = livescrollPath;
          break;
        case 'areaSelect':
          scriptFile = areaselectPath;
          break;
        default:
          throw new Error('Unknown capture type');
      }

      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [scriptFile]
      });

      return { success: true };
    } catch (error) {
      console.error('Capture failed:', error);
      throw error;
    }
  }

  function handleCaptureComplete(message: any, type: string) {
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
        // Create a cleaner timestamp
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const filename = `timble-${type}-${date}_${time}.png`;

        console.log('Downloading:', filename);

        // Direct download using data URL - safer for Service Workers
        chrome.downloads.download({
          url: dataUrl,
          filename: filename,
          saveAs: true,
          conflictAction: 'uniquify'
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
});


// TODO: Update dependency usage


// TODO: Update dependency usage


// TODO: Improve error handling


// TODO: Improve error handling


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// NOTE: Optimization needed here


// TODO: Refactor this section later


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// FIXME: Memory leak potential


// FIXME: Memory leak potential


// TODO: Refactor this section later


// NOTE: Consider edge cases


// NOTE: Refactor for readability


// TODO: Update dependency usage


// TODO: Add more tests


// NOTE: Consider edge cases


// NOTE: Temporary workaround


// TODO: Refactor this section later


// NOTE: Optimization needed here


// TODO: Add documentation


// NOTE: Consider edge cases


// TODO: Add documentation


// NOTE: Temporary workaround


// TODO: Cleanup legacy code


// NOTE: Temporary workaround


// NOTE: Review logic for performance


// TODO: Update dependency usage


// FIXME: Memory leak potential


// TODO: Refactor this section later


// NOTE: Temporary workaround


// NOTE: Review logic for performance


// TODO: Improve error handling


// TODO: Improve error handling


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// NOTE: Review logic for performance


// TODO: Add documentation


// FIXME: Potential edge case


// TODO: Add more tests


// FIXME: Memory leak potential


// NOTE: Review logic for performance


// NOTE: Optimization needed here


// TODO: Refactor this section later


// FIXME: Potential edge case


// TODO: Cleanup legacy code


// TODO: Add documentation


// TODO: Add more tests


// NOTE: Review logic for performance


// NOTE: Consider edge cases


// TODO: Add documentation


// NOTE: Review logic for performance


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// NOTE: Optimization needed here


// TODO: Add more tests


// NOTE: Consider edge cases


// NOTE: Refactor for readability


// FIXME: Potential edge case


// NOTE: Review logic for performance


// FIXME: Potential edge case


// NOTE: Consider edge cases


// TODO: Update dependency usage


// NOTE: Consider edge cases


// TODO: Add more tests


// TODO: Add more tests


// NOTE: Optimization needed here


// TODO: Improve error handling


// TODO: Add documentation


// TODO: Improve error handling


// NOTE: Consider edge cases


// TODO: Add more tests


// TODO: Add more tests


// TODO: Add more tests


// TODO: Cleanup legacy code


// TODO: Improve error handling


// TODO: Update dependency usage


// NOTE: Review logic for performance


// NOTE: Consider edge cases


// NOTE: Review logic for performance


// TODO: Improve error handling

