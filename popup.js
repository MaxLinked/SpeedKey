// SpeedKey 弹出页面脚本
class PopupController {
  constructor() {
    this.speedSlider = document.getElementById('speedValue');
    this.speedDisplay = document.getElementById('speedDisplay');
    this.triggerKeySelect = document.getElementById('triggerKey');
    this.showOverlayCheckbox = document.getElementById('showOverlay');
    this.openOptionsBtn = document.getElementById('openOptions');
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      
      this.speedSlider.value = response.speedValue;
      this.speedDisplay.textContent = `${response.speedValue}×`;
      this.triggerKeySelect.value = response.triggerKey;
      this.showOverlayCheckbox.checked = response.showOverlay;
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  }

  setupEventListeners() {
    // 倍速滑块变化
    this.speedSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.speedDisplay.textContent = `${value}×`;
      this.saveSettings();
    });

    // 触发键选择变化
    this.triggerKeySelect.addEventListener('change', () => {
      this.saveSettings();
    });

    // 浮层显示开关变化
    this.showOverlayCheckbox.addEventListener('change', () => {
      this.saveSettings();
    });

    // 打开选项页面
    this.openOptionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
      window.close();
    });
  }

  async saveSettings() {
    const settings = {
      speedValue: parseFloat(this.speedSlider.value),
      triggerKey: this.triggerKeySelect.value,
      showOverlay: this.showOverlayCheckbox.checked
    };

    try {
      await chrome.runtime.sendMessage({
        action: 'saveSettings',
        settings: settings
      });
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
}); 