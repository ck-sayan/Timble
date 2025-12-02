# Timble Extension - Testing Guide

## Quick Start Testing

### 1. Load Extension in Chrome

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select folder: `c:\Users\ck-sayan\Documents\Timble-extension`
5. Extension should appear with Timble icon

### 2. Test FREE Feature: Full Page Screenshot

**Test Page:** https://en.wikipedia.org/wiki/Web_browser

1. Click Timble icon in toolbar
2. Click **"Full Page"** button
3. Wait for loading indicator
4. Screenshot should auto-download
5. Open downloaded PNG - verify entire page is captured
6. **Expected:** Success message, unlimited usage

### 3. Test PREMIUM Feature: Live Scrollable Screenshot

**Test Page:** https://www.apple.com (has lots of animations)

1. Click Timble icon
2. Click **"Live Scrollable"** button
3. Watch page scroll smoothly (triggers animations)
4. Progress indicator shows in top-right
5. Screenshot downloads when complete
6. **Expected:** Animations visible in screenshot, usage count decrements

### 4. Test PREMIUM Feature: Area Selection

**Test Page:** Any webpage

1. Click Timble icon
2. Click **"Select Area"** button
3. Page dims with crosshair cursor
4. Click and drag to select region
5. Release mouse - screenshot downloads
6. **Expected:** Only selected area captured, usage count decrements

### 5. Test Usage Limits

1. Use Live Scrollable or Area Select **10 times**
2. Check usage badge (should show 0/10)
3. Try to use premium feature again
4. **Expected:** Upgrade prompt appears, feature blocked

### 6. Test Edge Cases

**Restricted Pages:**
- Try on `chrome://extensions/`
- **Expected:** Error message (can't capture chrome:// pages)

**Small Selections:**
- Try area select with tiny drag
- **Expected:** Error or cancellation

**ESC to Cancel:**
- Start area selection, press ESC
- **Expected:** Selection cancelled, no screenshot

## Common Issues & Fixes

### Extension Not Loading
- **Issue:** "Could not load extension"
- **Fix:** Check manifest.json syntax, ensure all files exist

### Screenshots Not Downloading
- **Issue:** No download happens
- **Fix:** Check Chrome's download settings, ensure downloads aren't blocked

### Premium Features Always Free
- **Issue:** No usage limit enforced
- **Fix:** Check browser console for errors in popup.js

### Icons Not Showing
- **Issue:** Extension has default icon
- **Fix:** Verify icons exist in `assets/icons/` folder

## Browser Console Debugging

### Check Popup Console
1. Right-click extension icon → "Inspect popup"
2. Console shows popup.js errors

### Check Background Worker Console
1. Go to `chrome://extensions/`
2. Click "Inspect views: service worker" under Timble
3. Console shows background.js errors

### Check Content Script Console
1. Open any webpage
2. Press F12 → Console tab
3. Capture screenshot
4. Console shows content script errors

## Performance Benchmarks

- **Full Page (short page):** ~2-3 seconds
- **Full Page (long page):** ~5-10 seconds
- **Live Scrollable:** ~8-15 seconds (depends on page length)
- **Area Select:** Instant (after selection)

## Next Steps After Testing

1. ✅ Fix any bugs found
2. ✅ Test on different websites
3. ✅ Test on Firefox (requires minor manifest changes)
4. ✅ Prepare Chrome Web Store listing
5. ✅ Set up payment/licensing system
6. ✅ Launch!

---

**Ready to test? Start with Step 1!** 🚀
