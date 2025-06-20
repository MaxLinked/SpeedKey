// SpeedKey 后台脚本
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装时设置默认配置
    chrome.storage.sync.set({
      triggerKey: 'ShiftLeft',
      speedValue: 2.0,
      showOverlay: true
    });
    
    // 打开选项页面
    chrome.runtime.openOptionsPage();
  }
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['triggerKey', 'speedValue', 'showOverlay'], (result) => {
      sendResponse({
        triggerKey: result.triggerKey || 'ShiftLeft',
        speedValue: result.speedValue || 2.0,
        showOverlay: result.showOverlay !== false
      });
    });
    return true; // 表示异步响应
  }
  
  if (request.action === 'saveSettings') {
    chrome.storage.sync.set(request.settings, () => {
      // 通知所有标签页更新设置
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: request.settings
          }).catch(() => {
            // 忽略无法发送消息的标签页（如chrome://页面）
          });
        });
      });
      
      sendResponse({ success: true });
    });
    return true;
  }
});

// 标签页更新时重新注入脚本（如果需要）
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // 可以在这里执行一些标签页更新后的逻辑
  }
}); 