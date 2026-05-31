// background.js

async function getMruState() {
  const result = await chrome.storage.local.get('mruState');
  return result.mruState || {};
}

async function setMruState(state) {
  await chrome.storage.local.set({ mruState: state });
}

// Ensure MRU lists are initialized and synced when the service worker starts
async function init() {
  const state = await getMruState();
  const windows = await chrome.windows.getAll({ populate: true });
  
  const validTabIds = new Set();
  
  for (const win of windows) {
    if (!state[win.id]) {
      state[win.id] = [];
    }
    const currentTabIds = win.tabs.map(t => t.id);
    currentTabIds.forEach(id => validTabIds.add(id));
    
    // Remove tabs that don't exist anymore in this window
    state[win.id] = state[win.id].filter(id => currentTabIds.includes(id));
    
    // Add missing tabs
    const activeTab = win.tabs.find(t => t.active);
    if (activeTab && !state[win.id].includes(activeTab.id)) {
      state[win.id].unshift(activeTab.id);
    }
    for (const tab of win.tabs) {
      if (!state[win.id].includes(tab.id)) {
        state[win.id].push(tab.id);
      }
    }
  }
  
  // Remove state for windows that no longer exist
  const windowIds = windows.map(w => w.id.toString());
  for (const winId in state) {
    if (!windowIds.includes(winId)) {
      delete state[winId];
    }
  }
  
  await setMruState(state);
  
  // Cleanup old screenshots only
  const allStorage = await chrome.storage.local.get(null);
  for (const key in allStorage) {
    if (key.startsWith('screenshot_')) {
      const tabId = parseInt(key.replace('screenshot_', ''), 10);
      if (!validTabIds.has(tabId)) {
        chrome.storage.local.remove(key);
      }
    }
  }
}

// Initialize only when the extension is installed or Chrome starts up
chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tabId = activeInfo.tabId;
  const windowId = activeInfo.windowId;
  
  const state = await getMruState();
  if (!state[windowId]) state[windowId] = [];
  
  // Move activated tab to the front
  state[windowId] = state[windowId].filter(id => id !== tabId);
  state[windowId].unshift(tabId);
  
  await setMruState(state);
  
  tryCapture(tabId);
});

chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.id) return;
  const state = await getMruState();
  const windowId = tab.windowId;
  
  if (!state[windowId]) state[windowId] = [];
  
  if (!state[windowId].includes(tab.id)) {
    if (tab.active) {
       state[windowId].unshift(tab.id);
    } else {
       state[windowId].push(tab.id);
    }
    await setMruState(state);
  }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const windowId = removeInfo.windowId;
  const state = await getMruState();
  
  if (state[windowId]) {
    state[windowId] = state[windowId].filter(id => id !== tabId);
    await setMruState(state);
  }
  
  chrome.storage.local.remove(`screenshot_${tabId}`);
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const state = await getMruState();
  delete state[windowId];
  await setMruState(state);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    tryCapture(tabId);
  }
});

async function tryCapture(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.active) {
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 10 });
      if (dataUrl) {
        await chrome.storage.local.set({ [`screenshot_${tabId}`]: dataUrl });
      }
    }
  } catch (e) {
    // Expected error if tab cannot be captured (e.g. extension pages, devtools)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTabs') {
    (async () => {
      try {
        const currentWindow = await chrome.windows.getCurrent();
        const windowId = currentWindow.id;
        const tabs = await chrome.tabs.query({ windowId: windowId });
        
        const state = await getMruState();
        let mruTabIds = state[windowId] || [];
        
        // Sync with actual current tabs in case they got out of sync
        const currentTabIds = tabs.map(t => t.id);
        mruTabIds = mruTabIds.filter(id => currentTabIds.includes(id));
        currentTabIds.forEach(id => {
          if (!mruTabIds.includes(id)) {
            mruTabIds.push(id);
          }
        });
        
        state[windowId] = mruTabIds;
        await setMruState(state);

        const mruTabs = mruTabIds.map(id => tabs.find(t => t.id === id)).filter(Boolean);
        
        const storageKeys = mruTabs.map(t => `screenshot_${t.id}`);
        const screenshots = await chrome.storage.local.get(storageKeys);
        
        sendResponse({ tabs: mruTabs, screenshots });
      } catch (e) {
        console.error(e);
        sendResponse({ tabs: [], screenshots: {} });
      }
    })();
    return true; // Keep message channel open for async response
  } else if (message.action === 'switchTab') {
    chrome.tabs.update(message.tabId, { active: true });
    chrome.tabs.get(message.tabId, (tab) => {
      chrome.windows.update(tab.windowId, { focused: true });
    });
  }
});
