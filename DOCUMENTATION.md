# Timble Extension Documentation

## Project Overview

Timble is a smart screenshot tool Chrome extension that allows users to capture full-page, live scrollable, and specific area screenshots. This repository contains both the legacy implementation and the new WXT-based migration.

## Directory Structure

The project has a dual structure representing the migration process:

### 1. Root Directory (Legacy Implementation)
The root directory contains the original, vanilla JavaScript/HTML/CSS implementation of the extension.
*   **`manifest.json`**: The extension manifest (MV3).
*   **`popup/`**: Contains the UI for the extension popup (`popup.html`, `popup.css`, `popup.js`).
*   **`scripts/`**: Contains the background and content scripts.
    *   `background.js`: Service worker handling capture coordination.
    *   `content-fullpage.js`: Logic for full-page captures.
    *   `content-livescroll.js`: Logic for live scrolling captures.
    *   `content-areaselect.js`: Logic for area selection.

### 2. `wxt-app/` (Modern Implementation)
This directory contains the new version of the extension being rebuilt using the [WXT Framework](https://wxt.dev/) with React and TypeScript.
*   **`entrypoints/`**: WXT entry points definition.
    *   `popup/`: The React-based Popup UI.
    *   `background.ts`: The background service worker.
    *   `*.content.ts`: Content scripts (livescroll, fullpage, areaselect) ported to TypeScript.
*   **`wxt.config.ts`**: Configuration for the WXT build tool.
*   **`tailwind.config.js`**: Utility-first styling configuration.

## Setup & Installation

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or pnpm

### Running the Legacy Extension
1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** (top right toggle).
3.  Click **Load unpacked**.
4.  Select the **root** `Timble-extension` folder.

### Running the New WXT App
1.  Navigate to the app directory:
    ```bash
    cd wxt-app
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server (HMR enabled):
    ```bash
    npm run dev
    ```
    Chrome will open a new instance with the extension loaded.

## Build & Deployment

To build the WXT version for production:

1.  Navigate to `wxt-app`:
    ```bash
    cd wxt-app
    ```
2.  Run the build command:
    ```bash
    npm run build
    ```
    Output will be generated in `.output/`.
3.  To create a submit-ready zip file:
    ```bash
    npm run zip
    ```

## Debugging Guide

### Common Issues
*   **Protocol Errors**: Ensure you are not trying to capture `chrome://` URLs or the New Tab page, as extensions are restricted there.
*   **Styling Conflicts**: The WXT app uses Shadow DOM to prevent CSS leaks, but legacy scripts inject directly. Check for CSS specificity issues.

### Logs
*   **Popup Logs**: Right-click the extension icon -> "Inspect Popup" to see React/UI logs.
*   **Background Logs**: In `chrome://extensions/`, click "service worker" (or "Inspect views: background page") under the extension card.
*   **Content Script Logs**: Open the Developer Tools (F12) on the target web page.

## Key Features Logic

*   **Full Page**: Scrolls the window programmatically, taking screenshots at each step and stitching them on a canvas.
*   **Live Scroll**: Detects user scroll events or auto-scrolls, capturing 'frames' to create a long screenshot or GIF-like capture.
*   **Area Select**: Overlays a transparent div on the DOM, calculates coordinates of the user's drag selection, and captures the visible tab area cropped to those coordinates.
