# Timble - Smart Screenshot Extension

> Capture full-page, live scrollable, and specific area screenshots effortlessly

## 🚀 Features

### FREE
- **Full Page Screenshot** - Capture entire webpage, unlimited use

### PREMIUM ($4.99/month)
- **Live Scrollable Screenshot** - Captures animations as page scrolls (Android-like feature)
- **Specific Area Selection** - Select and capture any region
- **10 free premium captures/day** for non-Pro users

## 📦 Installation (Developer Mode)

Since this extension isn't published to Chrome Web Store yet, install it in Developer Mode:

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" switch in top-right corner

3. **Load Extension**
   - Click "Load unpacked" button
   - Select the `Timble-extension` folder
   - Extension icon should appear in your toolbar

## 🎯 How to Use

1. **Click the Timble icon** in your Chrome toolbar
2. **Choose capture mode:**
   - **Full Page** - Instantly captures entire page (FREE)
   - **Live Scrollable** - Smoothly scrolls and captures animations (PRO)
   - **Select Area** - Click and drag to select region (PRO)
3. **Screenshot auto-downloads** to your Downloads folder

## 💎 Upgrade to Pro

Click "Get Pro" in the extension popup to unlock:
- Unlimited live scrollable screenshots
- Unlimited area selection captures
- No daily limits

## 🛠️ Technical Architecture

### Manifest V3 Extension
- **Popup UI** (`popup/`) - User interface with premium/free distinction
- **Background Worker** (`scripts/background.js`) - Orchestrates captures
- **Content Scripts** (`scripts/content-*.js`) - Injected into pages for capture

### Capture Methods
- **Full Page**: Scroll-and-stitch technique
- **Live Scroll**: Super smooth scroll with animation triggers
- **Area Select**: Interactive drag-to-select UI

## 🔧 Development

### Project Structure
```
Timble-extension/
├── manifest.json              # Extension configuration
├── popup/
│   ├── popup.html            # Popup UI
│   ├── popup.css             # Styling
│   └── popup.js              # UI logic
├── scripts/
│   ├── background.js         # Service worker
│   ├── content-fullpage.js   # Full page capture
│   ├── content-livescroll.js # Live scroll capture
│   └── content-areaselect.js # Area selection
└── assets/
    └── icons/                # Extension icons
```

### Testing
1. Make changes to any file
2. Go to `chrome://extensions/`
3. Click refresh icon (⟳) on Timble extension
4. Test your changes

## 🐛 Troubleshooting

**Extension doesn't appear:**
- Make sure Developer Mode is enabled
- Check that you selected the correct folder

**Screenshot not capturing:**
- Some pages (like `chrome://` pages) can't be captured for security
- Try on regular websites like Wikipedia or news sites

**Premium features not working:**
- Check your daily usage count in popup
- Premium features have 10/day limit for free users

## 📝 License

Proprietary - All rights reserved

## 🎯 Roadmap

- [ ] Firefox support
- [ ] Cloud storage & sync
- [ ] Advanced editing tools
- [ ] Team collaboration features
- [ ] Chrome Web Store publication

---

**Built with ❤️ by Sayan Chakraborty for the $500/month SaaS goal**
