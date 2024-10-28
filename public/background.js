// Handle authentication and background tasks
chrome.runtime.onInstalled.addListener(() => {
  // Initialize extension settings
  chrome.storage.local.set({
    rateLimit: {
      count: 0,
      lastReset: Date.now()
    }
  });
});

// Reset rate limit counter every minute
setInterval(() => {
  chrome.storage.local.set({
    rateLimit: {
      count: 0,
      lastReset: Date.now()
    }
  });
}, 60000);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "checkRateLimit") {
    chrome.storage.local.get("rateLimit", (data) => {
      const { rateLimit } = data;
      const now = Date.now();
      
      // Reset if more than a minute has passed
      if (now - rateLimit.lastReset > 60000) {
        chrome.storage.local.set({
          rateLimit: {
            count: 1,
            lastReset: now
          }
        });
        sendResponse({ allowed: true });
      } else if (rateLimit.count < 5) {
        // Increment counter if under limit
        chrome.storage.local.set({
          rateLimit: {
            ...rateLimit,
            count: rateLimit.count + 1
          }
        });
        sendResponse({ allowed: true });
      } else {
        sendResponse({ allowed: false });
      }
    });
    return true; // Required for async response
  }
});