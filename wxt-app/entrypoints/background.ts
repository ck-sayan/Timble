import { defineBackground } from 'wxt/sandbox';
// @ts-ignore
import fullpagePath from '~/entrypoints/fullpage?script';
// @ts-ignore
import livescrollPath from '~/entrypoints/livescroll?script';
// @ts-ignore
import areaselectPath from '~/entrypoints/areaselect?script';

export default defineBackground(() => {
  console.log('Timble background script loaded');

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
});


// TODO: Update dependency usage


// TODO: Update dependency usage


// TODO: Improve error handling


// TODO: Improve error handling


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// TODO: Cleanup legacy code
