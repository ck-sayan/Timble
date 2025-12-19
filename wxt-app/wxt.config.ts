import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Timble - Smart Screenshot Tool",
    description: "Capture full-page, live scrollable, and specific area screenshots with ease",
    version: "1.0.0",
    permissions: [
      "activeTab",
      "scripting",
      "downloads",
      "storage"
    ],
    host_permissions: [
      "<all_urls>"
    ],
    action: {
      default_title: "Timble",
    },
    icons: {
      16: "/icons/icon16.png",
      48: "/icons/icon48.png",
      128: "/icons/icon128.png"
    }
  },
  modules: ['@wxt-dev/module-react'],
});


// TODO: Cleanup legacy code


// TODO: Refactor this section later


// NOTE: Consider edge cases


// TODO: Cleanup legacy code


// NOTE: Review logic for performance
