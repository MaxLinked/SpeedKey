// SpeedKey 后台脚本
chrome.runtime.onInstalled.addListener(() => {
    const defaultSettings = {
        speedValue: 2.0,
        triggerKey: 'ShiftLeft',
        customTriggerKey: '',
        showOverlay: true,
        currentLanguage: 'en-US'
    };
    
    chrome.storage.sync.set(defaultSettings);
    console.log('SpeedKey extension installed with default settings');
});

// 监听来自内容脚本和弹窗的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        chrome.storage.sync.get(['speedValue', 'triggerKey', 'customTriggerKey', 'showOverlay', 'currentLanguage'], (result) => {
            const settings = {
                speedValue: result.speedValue || 2.0,
                triggerKey: result.triggerKey || 'ShiftLeft',
                customTriggerKey: result.customTriggerKey || '',
                showOverlay: result.showOverlay !== false,
                currentLanguage: result.currentLanguage || 'en-US'
            };
            sendResponse(settings);
        });
        return true;
    }
    
    if (request.action === 'saveSettings') {
        chrome.storage.sync.set(request.settings, () => {
            console.log('Settings saved:', request.settings);
            
            // 通知所有内容脚本更新设置
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'updateSettings',
                        settings: request.settings
                    }).catch(() => {
                        // 忽略无法发送消息的标签页
                    });
                });
            });
            
            sendResponse({ success: true });
        });
        return true;
    }
});

// 处理快捷键命令
chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-speed') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSpeed' });
            }
        });
    }
});

// 标签页更新时重新注入脚本（如果需要）
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // 可以在这里执行一些标签页更新后的逻辑
  }
}); 