// SpeedKey Background Service Worker
chrome.runtime.onInstalled.addListener(async () => {
    try {
        if (self.SpeedKeyConstants) {
            await chrome.storage.sync.set(self.SpeedKeyConstants.DEFAULT_SETTINGS);
        } else {
            await chrome.storage.sync.set({
                speedValue: 2.0,
                triggerKey: 'ShiftLeft',
                customTriggerKey: '',
                showOverlay: true,
                currentLanguage: 'en-US'
            });
        }
    } catch (_) {}
    console.log('SpeedKey extension installed with default settings');
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        chrome.storage.sync.get(['speedValue', 'triggerKey', 'customTriggerKey', 'showOverlay'], (result) => {
            const defaults = (self.SpeedKeyConstants && self.SpeedKeyConstants.DEFAULT_SETTINGS) || {
                speedValue: 2.0,
                triggerKey: 'ShiftLeft',
                customTriggerKey: '',
                showOverlay: true
            };
            const settings = { ...defaults, ...result };
            sendResponse(settings);
        });
        return true;
    }
    
    if (request.action === 'saveSettings') {
        chrome.storage.sync.set(request.settings, () => {
            console.log('Settings saved:', request.settings);
            
            // Notify all content scripts to update settings (avoid errors if not injected)
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    if (!tab.id) return;
                    try {
                        chrome.tabs.sendMessage(tab.id, {
                            action: 'settingsUpdated',
                            settings: request.settings
                        }, () => void chrome.runtime.lastError);
                     } catch (_) {
                        // ignore errors
                    }
                });
            });
            
            sendResponse({ success: true });
        });
        return true;
    }
});

// Handle keyboard commands registered in manifest
chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-speed') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSpeed' });
            }
        });
    }
});

// Tab updates hook (placeholder for future logic)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // You can add logic to handle tab updates here if needed
  }
}); 