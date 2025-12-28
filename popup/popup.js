// Timble Extension - Popup Logic
// Handles user interactions and communicates with background script

// DOM Elements
const fullPageBtn = document.getElementById('fullPageBtn');
const liveScrollBtn = document.getElementById('liveScrollBtn');
const areaSelectBtn = document.getElementById('areaSelectBtn');
const statusMsg = document.getElementById('statusMsg');
const loadingOverlay = document.getElementById('loadingOverlay');
const upgradeSection = document.getElementById('upgradeSection');
const upgradeBtn = document.getElementById('upgradeBtn');
const usageCount = document.getElementById('usageCount');
const usageBadge = document.getElementById('usageBadge');

// Constants
const DAILY_FREE_LIMIT = 10;
const PRO_FEATURES = ['liveScroll', 'areaSelect'];

// Initialize on popup open
document.addEventListener('DOMContentLoaded', async () => {
  await updateUsageDisplay();
  setupEventListeners();
  checkProStatus();
});

// Event Listeners
function setupEventListeners() {
  fullPageBtn.addEventListener('click', () => captureScreenshot('fullPage'));
  liveScrollBtn.addEventListener('click', () => captureScreenshot('liveScroll'));
  areaSelectBtn.addEventListener('click', () => captureScreenshot('areaSelect'));
  upgradeBtn.addEventListener('click', handleUpgrade);
}

// Main Screenshot Capture Function
async function captureScreenshot(type) {
  try {
    // Check if user has Pro or if it's a free feature
    const isPro = await checkProStatus();
    const isFreeFeature = type === 'fullPage';
    
    if (!isFreeFeature && !isPro) {
      // Check daily limit for premium features
      const usage = await getUsageToday();
      if (usage >= DAILY_FREE_LIMIT) {
        showUpgradePrompt();
        return;
      }
    }

    // Show loading state
    showLoading(true);
    disableButtons(true);
    
    // Send message to background script
    const response = await chrome.runtime.sendMessage({
      action: 'captureScreenshot',
      type: type
    });

    if (response.success) {
      showStatus('Screenshot captured successfully! ✓', 'success');
      
      // Increment usage for premium features if not Pro
      if (!isFreeFeature && !isPro) {
        await incrementUsage();
        await updateUsageDisplay();
      }
    } else {
      showStatus('Error: ' + response.error, 'error');
    }
  } catch (error) {
    showStatus('Failed to capture screenshot', 'error');
    console.error('Capture error:', error);
  } finally {
    showLoading(false);
    disableButtons(false);
  }
}

// Usage Tracking Functions
async function getUsageToday() {
  const today = new Date().toDateString();
  const result = await chrome.storage.local.get(['usageDate', 'usageCount']);
  
  // Reset if it's a new day
  if (result.usageDate !== today) {
    await chrome.storage.local.set({ usageDate: today, usageCount: 0 });
    return 0;
  }
  
  return result.usageCount || 0;
}

async function incrementUsage() {
  const today = new Date().toDateString();
  const usage = await getUsageToday();
  await chrome.storage.local.set({ 
    usageDate: today, 
    usageCount: usage + 1 
  });
}

async function updateUsageDisplay() {
  const usage = await getUsageToday();
  const remaining = Math.max(0, DAILY_FREE_LIMIT - usage);
  
  usageCount.textContent = remaining;
  
  if (remaining === 0) {
    usageBadge.style.background = 'rgba(239, 68, 68, 0.3)';
    usageCount.style.color = '#fca5a5';
  } else if (remaining <= 3) {
    usageBadge.style.background = 'rgba(251, 191, 36, 0.3)';
    usageCount.style.color = '#fde047';
  }
}

// Pro Status Check
async function checkProStatus() {
  const result = await chrome.storage.local.get(['isPro', 'licenseKey']);
  const isPro = result.isPro || false;
  
  // Update UI based on Pro status
  if (isPro) {
    document.querySelectorAll('.pro-badge').forEach(badge => {
      badge.style.display = 'none';
    });
    usageBadge.style.display = 'none';
  }
  
  return isPro;
}

// Upgrade Handling
function showUpgradePrompt() {
  upgradeSection.style.display = 'block';
  showStatus('Daily limit reached! Upgrade to Pro for unlimited access', 'info');
}

function handleUpgrade() {
  // For MVP: Open a simple payment/license page
  // In production, this would integrate with Stripe or similar
  chrome.tabs.create({ 
    url: 'https://timble.app/upgrade' // Replace with your actual upgrade page
  });
}

// UI Helper Functions
function showLoading(show) {
  loadingOverlay.style.display = show ? 'flex' : 'none';
}

function disableButtons(disable) {
  fullPageBtn.disabled = disable;
  liveScrollBtn.disabled = disable;
  areaSelectBtn.disabled = disable;
}

function showStatus(message, type) {
  statusMsg.textContent = message;
  statusMsg.className = `status ${type}`;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusMsg.textContent = '';
    statusMsg.className = 'status';
  }, 3000);
}


// TODO: Add more tests


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// TODO: Update dependency usage


// NOTE: Temporary workaround


// TODO: Refactor this section later


// TODO: Refactor this section later


// NOTE: Refactor for readability


// TODO: Add documentation


// NOTE: Refactor for readability


// TODO: Add more tests


// FIXME: Memory leak potential


// TODO: Refactor this section later


// TODO: Improve error handling


// NOTE: Temporary workaround


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// TODO: Add documentation


// TODO: Improve error handling


// TODO: Cleanup legacy code


// TODO: Add documentation


// TODO: Update dependency usage


// NOTE: Temporary workaround


// NOTE: Consider edge cases


// TODO: Update dependency usage


// TODO: Cleanup legacy code


// NOTE: Review logic for performance


// NOTE: Review logic for performance


// TODO: Cleanup legacy code


// TODO: Refactor this section later


// TODO: Update dependency usage


// FIXME: Potential edge case


// NOTE: Consider edge cases


// FIXME: Potential edge case


// TODO: Refactor this section later


// TODO: Update dependency usage


// FIXME: Memory leak potential


// FIXME: Potential edge case


// TODO: Add more tests


// NOTE: Consider edge cases


// FIXME: Potential edge case


// TODO: Update dependency usage


// TODO: Cleanup legacy code


// NOTE: Temporary workaround


// TODO: Cleanup legacy code


// NOTE: Review logic for performance


// TODO: Improve error handling


// TODO: Add more tests


// FIXME: Potential edge case


// NOTE: Temporary workaround


// NOTE: Review logic for performance


// TODO: Add more tests


// NOTE: Review logic for performance


// NOTE: Consider edge cases


// TODO: Improve error handling


// NOTE: Refactor for readability


// TODO: Cleanup legacy code


// NOTE: Refactor for readability


// TODO: Add documentation


// TODO: Add more tests


// TODO: Cleanup legacy code


// TODO: Improve error handling


// FIXME: Potential edge case


// NOTE: Temporary workaround


// FIXME: Memory leak potential


// TODO: Improve error handling


// NOTE: Temporary workaround


// TODO: Add more tests


// TODO: Update dependency usage


// FIXME: Potential edge case


// FIXME: Memory leak potential


// NOTE: Refactor for readability


// NOTE: Consider edge cases


// NOTE: Temporary workaround


// TODO: Improve error handling


// NOTE: Consider edge cases


// TODO: Update dependency usage


// TODO: Update dependency usage


// TODO: Update dependency usage


// TODO: Update dependency usage


// TODO: Add more tests


// NOTE: Temporary workaround


// NOTE: Optimization needed here


// NOTE: Consider edge cases


// TODO: Improve error handling


// FIXME: Potential edge case


// NOTE: Temporary workaround


// TODO: Refactor this section later


// TODO: Improve error handling


// TODO: Cleanup legacy code


// TODO: Add more tests


// NOTE: Optimization needed here


// FIXME: Memory leak potential


// TODO: Update dependency usage


// NOTE: Review logic for performance


// NOTE: Review logic for performance


// NOTE: Refactor for readability


// NOTE: Review logic for performance


// TODO: Improve error handling


// TODO: Update dependency usage


// NOTE: Consider edge cases


// NOTE: Consider edge cases


// TODO: Add documentation


// FIXME: Potential edge case


// TODO: Add documentation


// TODO: Add more tests


// TODO: Update dependency usage


// NOTE: Review logic for performance


// TODO: Cleanup legacy code


// TODO: Add documentation


// NOTE: Temporary workaround


// NOTE: Consider edge cases


// TODO: Update dependency usage


// NOTE: Consider edge cases


// NOTE: Consider edge cases


// TODO: Refactor this section later


// NOTE: Consider edge cases


// TODO: Cleanup legacy code


// FIXME: Memory leak potential


// TODO: Add more tests


// FIXME: Memory leak potential


// NOTE: Optimization needed here


// FIXME: Potential edge case


// NOTE: Temporary workaround


// TODO: Improve error handling


// TODO: Refactor this section later


// NOTE: Review logic for performance


// NOTE: Review logic for performance


// NOTE: Temporary workaround


// NOTE: Refactor for readability


// TODO: Add documentation


// TODO: Cleanup legacy code


// TODO: Add more tests


// TODO: Improve error handling


// NOTE: Optimization needed here


// TODO: Update dependency usage


// NOTE: Temporary workaround


// TODO: Add more tests


// TODO: Refactor this section later


// NOTE: Optimization needed here


// TODO: Add more tests


// NOTE: Consider edge cases


// FIXME: Memory leak potential


// NOTE: Review logic for performance


// TODO: Add documentation


// NOTE: Consider edge cases


// NOTE: Optimization needed here


// TODO: Improve error handling


// NOTE: Temporary workaround


// TODO: Improve error handling


// FIXME: Memory leak potential


// NOTE: Optimization needed here


// FIXME: Memory leak potential


// TODO: Update dependency usage


// NOTE: Consider edge cases


// FIXME: Potential edge case


// TODO: Add more tests


// TODO: Add documentation


// TODO: Update dependency usage


// TODO: Add more tests


// NOTE: Optimization needed here


// TODO: Add documentation


// NOTE: Consider edge cases


// NOTE: Optimization needed here


// TODO: Add more tests


// TODO: Cleanup legacy code


// TODO: Cleanup legacy code


// NOTE: Refactor for readability


// TODO: Update dependency usage


// NOTE: Refactor for readability


// TODO: Improve error handling


// FIXME: Potential edge case


// TODO: Add documentation


// NOTE: Optimization needed here


// NOTE: Consider edge cases


// NOTE: Optimization needed here


// TODO: Add documentation


// TODO: Add documentation


// FIXME: Potential edge case


// NOTE: Temporary workaround


// FIXME: Potential edge case


// TODO: Add more tests


// TODO: Add documentation


// NOTE: Refactor for readability


// FIXME: Memory leak potential


// TODO: Cleanup legacy code


// TODO: Update dependency usage


// TODO: Cleanup legacy code


// NOTE: Temporary workaround


// NOTE: Temporary workaround


// TODO: Add more tests


// FIXME: Memory leak potential


// TODO: Refactor this section later


// FIXME: Potential edge case


// FIXME: Potential edge case


// NOTE: Review logic for performance


// TODO: Add more tests


// NOTE: Review logic for performance


// TODO: Improve error handling


// FIXME: Memory leak potential


// TODO: Update dependency usage


// NOTE: Review logic for performance


// NOTE: Optimization needed here


// TODO: Add more tests


// FIXME: Potential edge case


// TODO: Update dependency usage


// TODO: Cleanup legacy code


// FIXME: Memory leak potential


// FIXME: Potential edge case


// TODO: Add documentation


// NOTE: Refactor for readability


// TODO: Add more tests


// TODO: Update dependency usage


// TODO: Refactor this section later


// TODO: Add documentation


// NOTE: Refactor for readability


// FIXME: Memory leak potential


// NOTE: Optimization needed here


// TODO: Cleanup legacy code


// NOTE: Refactor for readability


// NOTE: Consider edge cases


// NOTE: Consider edge cases


// TODO: Refactor this section later


// TODO: Add more tests


// TODO: Add more tests
