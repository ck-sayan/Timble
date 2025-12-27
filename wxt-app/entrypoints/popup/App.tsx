import { useState, useEffect } from 'react';
import './style.css';

const DAILY_FREE_LIMIT = 10;

function App() {
  const [usageCount, setUsageCount] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' | 'info' | '' }>({ msg: '', type: '' });
  const [showUpgrade, setShowUpgrade] = useState<boolean>(false);

  useEffect(() => {
    // Initialize usage and pro status
    const init = async () => {
      const usage = await getUsageToday();
      setUsageCount(usage);
      const pro = await checkProStatus();
      setIsPro(pro);
    };
    init();
  }, []);

  const getUsageToday = async (): Promise<number> => {
    const today = new Date().toDateString();
    const result = await browser.storage.local.get(['usageDate', 'usageCount']);

    if (result.usageDate !== today) {
      await browser.storage.local.set({ usageDate: today, usageCount: 0 });
      return 0;
    }
    return (result.usageCount as number) || 0;
  };

  const checkProStatus = async (): Promise<boolean> => {
    const result = await browser.storage.local.get(['isPro']);
    return (result.isPro as boolean) || false;
  };

  const incrementUsage = async () => {
    const today = new Date().toDateString();
    const usage = await getUsageToday();
    await browser.storage.local.set({
      usageDate: today,
      usageCount: usage + 1
    });
    setUsageCount(usage + 1);
  };

  const showStatusMsg = (msg: string, type: 'success' | 'error' | 'info') => {
    setStatus({ msg, type });
    setTimeout(() => setStatus({ msg: '', type: '' }), 3000);
  };

  const handleCapture = async (type: 'fullPage' | 'liveScroll' | 'areaSelect') => {
    console.log('[Popup] Handle capture clicked:', type);
    const isFreeFeature = type === 'fullPage';

    if (!isFreeFeature && !isPro) {
      if (usageCount >= DAILY_FREE_LIMIT) {
        setShowUpgrade(true);
        showStatusMsg('Daily limit reached! Upgrade to Pro', 'info');
        return;
      }
    }

    setLoading(true);
    try {
      console.log('[Popup] Sending message to background...');
      const response = await chrome.runtime.sendMessage({
        action: 'captureScreenshot',
        type: type
      });
      console.log('[Popup] Response received:', response);

      if (response && response.success) {
        showStatusMsg('Screenshot captured successfully! ✓', 'success');
        if (!isFreeFeature && !isPro) {
          await incrementUsage();
        }
      } else {
        console.error('[Popup] Error in response:', response);
        showStatusMsg('Error: ' + (response?.error || 'Unknown error'), 'error');
      }
    } catch (error: any) {
      console.error('[Popup] Message sending failed:', error);
      showStatusMsg('Failed to capture screenshot', 'error');
    } finally {
      setLoading(false);
    }
  };

  const remaining = Math.max(0, DAILY_FREE_LIMIT - usageCount);
  const usageColor = remaining === 0 ? '#fca5a5' : remaining <= 3 ? '#fde047' : '#ffd700';
  const badgeBg = remaining === 0 ? 'rgba(239, 68, 68, 0.3)' : remaining <= 3 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 255, 255, 0.2)';

  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          <h1>Timble</h1>
        </div>
        {!isPro && (
          <div className="usage-badge" style={{ background: badgeBg }}>
            <span id="usageCount" style={{ color: usageColor }}>{remaining}</span>/10 today
          </div>
        )}
      </div>

      <div className="options">
        <button
          className="option-btn primary"
          onClick={() => handleCapture('fullPage')}
          disabled={loading}
        >
          <div className="btn-icon">📄</div>
          <div className="btn-content">
            <div className="btn-title">Full Page</div>
            <div className="btn-subtitle">Capture entire page • FREE</div>
          </div>
        </button>

        <button
          className="option-btn"
          onClick={() => handleCapture('liveScroll')}
          disabled={loading}
        >
          <div className="btn-icon">🎬</div>
          <div className="btn-content">
            <div className="btn-title">Live Scrollable</div>
            <div className="btn-subtitle">Captures animations • PRO</div>
          </div>
          {!isPro && <div className="pro-badge">PRO</div>}
        </button>

        <button
          className="option-btn"
          onClick={() => handleCapture('areaSelect')}
          disabled={loading}
        >
          <div className="btn-icon">✂️</div>
          <div className="btn-content">
            <div className="btn-title">Select Area</div>
            <div className="btn-subtitle">Choose specific region • PRO</div>
          </div>
          {!isPro && <div className="pro-badge">PRO</div>}
        </button>
      </div>

      {status.msg && (
        <div className={`status ${status.type}`}>
          {status.msg}
        </div>
      )}

      {showUpgrade && (
        <div className="upgrade-section">
          <div className="upgrade-content">
            <h3>🚀 Upgrade to Pro</h3>
            <p>Unlock live scrollable & area screenshots</p>
            <button className="upgrade-btn" onClick={() => window.open('https://timble.app/upgrade', '_blank')}>
              Get Pro - $4.99/month
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Capturing screenshot...</p>
        </div>
      )}
    </div>
  );
}

export default App;


// TODO: Refactor this section later


// NOTE: Review logic for performance


// TODO: Add documentation


// NOTE: Refactor for readability


// NOTE: Consider edge cases


// TODO: Refactor this section later


// FIXME: Potential edge case


// TODO: Refactor this section later


// NOTE: Temporary workaround


// TODO: Update dependency usage


// TODO: Add more tests


// TODO: Update dependency usage


// TODO: Add documentation


// FIXME: Memory leak potential


// TODO: Add documentation


// NOTE: Temporary workaround


// TODO: Add more tests


// TODO: Add more tests


// NOTE: Review logic for performance


// NOTE: Review logic for performance


// TODO: Add more tests


// NOTE: Temporary workaround


// FIXME: Memory leak potential


// TODO: Improve error handling


// NOTE: Consider edge cases


// TODO: Cleanup legacy code


// TODO: Add documentation


// TODO: Update dependency usage


// FIXME: Memory leak potential


// FIXME: Memory leak potential


// NOTE: Consider edge cases


// FIXME: Memory leak potential


// NOTE: Consider edge cases


// NOTE: Optimization needed here


// TODO: Update dependency usage


// TODO: Add documentation


// TODO: Add more tests


// TODO: Add more tests


// TODO: Improve error handling


// NOTE: Temporary workaround


// NOTE: Review logic for performance
