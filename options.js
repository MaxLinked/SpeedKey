// SpeedKey 选项页面脚本
class OptionsController {
  constructor() {
    this.speedInput = document.getElementById('speedValue');
    this.speedSlider = document.getElementById('speedSlider');
    this.showOverlayCheckbox = document.getElementById('showOverlay');
    this.presetButtons = document.querySelectorAll('.preset-btn');
    this.triggerKeyRadios = document.querySelectorAll('input[name="triggerKey"]');
    this.notification = document.getElementById('notification');
    
    // 新增：自定义按键相关
    this.customKeyContainer = document.getElementById('customKeyContainer');
    this.customKeyInput = document.getElementById('customKeyInput');
    this.clearCustomKeyBtn = document.getElementById('clearCustomKey');
    this.customTriggerKey = '';
    
    // 新增：语言切换
    this.languageSelect = document.getElementById('languageSelect');
    
    // 底部功能按钮
    this.resetButton = document.getElementById('resetSettings');
    this.exportButton = document.getElementById('exportSettings');
    this.importButton = document.getElementById('importSettings');
    
    this.init();
  }

  async init() {
    if (window.i18n && window.i18n.initPromise) {
      await window.i18n.initPromise;
    }
    await this.loadSettings();
    this.setupEventListeners();

    // 当设置从其他地方（如popup）更改时，重新加载UI
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        console.log('Options page detected settings change, reloading UI.');
        this.loadSettings();
      }
    });
  }

  async loadSettings() {
    try {
      const settings = await chrome.runtime.sendMessage({ action: 'getSettings' });

      // Set speed
      this.speedInput.value = settings.speedValue;
      this.speedSlider.value = settings.speedValue;
      this.updatePresetButtons(settings.speedValue);

      // Set trigger key (Correctly handle custom key)
      const { triggerKey, customTriggerKey } = settings;
      
      if (customTriggerKey) {
        const customRadio = document.querySelector('input[name="triggerKey"][value="custom"]');
        if (customRadio) {
          customRadio.checked = true;
          this.customKeyContainer.style.display = 'block';
          this.customKeyInput.value = this.formatKeyName(customTriggerKey);
          this.customTriggerKey = customTriggerKey;
        }
      } else {
        const presetRadio = document.querySelector(`input[name="triggerKey"][value="${triggerKey}"]`);
        if (presetRadio) {
          presetRadio.checked = true;
        }
        this.customKeyContainer.style.display = 'none';
        this.customTriggerKey = '';
      }
      
      this.showOverlayCheckbox.checked = settings.showOverlay;

      if (window.i18n) {
        this.languageSelect.value = settings.currentLanguage || 'en-US';
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.showNotification(window.i18n.t('settings_load_failed'), 'error');
    }
  }

  setupEventListeners() {
    // 倍速输入框变化
    this.speedInput.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      if (value >= 0.1 && value <= 5.0) {
        this.speedSlider.value = value;
        this.updatePresetButtons(value);
        this.saveSettings();
      }
    });

    // 倍速滑块变化
    this.speedSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.speedInput.value = value;
      this.updatePresetButtons(value);
      this.saveSettings();
    });

    // 预设倍速按钮
    this.presetButtons.forEach(button => {
      button.addEventListener('click', () => {
        const speed = parseFloat(button.dataset.speed);
        this.speedInput.value = speed;
        this.speedSlider.value = speed;
        this.updatePresetButtons(speed);
        this.saveSettings();
      });
    });

    // 触发键选择
    this.triggerKeyRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'custom') {
          this.customKeyContainer.style.display = 'block';
          this.customKeyInput.focus();
        } else {
          this.customKeyContainer.style.display = 'none';
          this.customTriggerKey = '';
        }
        this.saveSettings();
      });
    });

    // 自定义按键输入
    this.customKeyInput.addEventListener('click', () => {
      this.customKeyInput.value = window.i18n ? window.i18n.t('custom_key_label') : '按下要设置的键...';
      this.customKeyInput.classList.add('listening');
    });

    this.customKeyInput.addEventListener('keydown', (e) => {
      e.preventDefault();
      
      if (this.customKeyInput.classList.contains('listening')) {
        this.customTriggerKey = e.code;
        this.customKeyInput.value = this.formatKeyName(e.code);
        this.customKeyInput.classList.remove('listening');
        this.saveSettings();
      }
    });

    this.customKeyInput.addEventListener('blur', () => {
      this.customKeyInput.classList.remove('listening');
      if (!this.customTriggerKey) {
        this.customKeyInput.value = '';
      }
    });

    // 清除自定义按键
    this.clearCustomKeyBtn.addEventListener('click', () => {
      this.customTriggerKey = '';
      this.customKeyInput.value = '';
      // 切换到默认按键
      const defaultRadio = document.querySelector('input[name="triggerKey"][value="ShiftLeft"]');
      if (defaultRadio) {
        defaultRadio.checked = true;
        this.customKeyContainer.style.display = 'none';
        this.saveSettings();
      }
    });

    // 浮层显示开关
    this.showOverlayCheckbox.addEventListener('change', () => {
      this.saveSettings();
    });

    // 语言切换
    this.languageSelect.addEventListener('change', async () => {
      const selectedLang = this.languageSelect.value;
      if (window.i18n) {
        await window.i18n.setLanguage(selectedLang);
        // Do not reload all settings, just update UI text
        // This prevents resetting the user's unsaved changes
      }
    });

    // 底部功能按钮
    this.resetButton.addEventListener('click', () => this.resetSettings());
    this.exportButton.addEventListener('click', () => this.exportSettings());
    this.importButton.addEventListener('click', () => this.importSettings());
  }

  formatKeyName(keyCode) {
    // 常见按键名称格式化
    const keyNameMap = {
      'ShiftLeft': 'Left Shift',
      'ShiftRight': 'Right Shift',
      'ControlLeft': 'Left Ctrl',
      'ControlRight': 'Right Ctrl',
      'AltLeft': 'Left Alt',
      'AltRight': 'Right Alt',
      'Space': 'Space',
      'Enter': 'Enter',
      'Escape': 'Escape',
      'Tab': 'Tab',
      'Backspace': 'Backspace',
    };

    // 字母键
    if (keyCode.startsWith('Key')) {
      return keyCode.replace('Key', '');
    }
    
    // 数字键
    if (keyCode.startsWith('Digit')) {
      return keyCode.replace('Digit', '');
    }
    
    // F键
    if (keyCode.startsWith('F') && keyCode.length <= 3) {
      return keyCode;
    }
    
    // 其他已知按键
    return keyNameMap[keyCode] || keyCode;
  }

  updatePresetButtons(currentSpeed) {
    this.presetButtons.forEach(button => {
      const speed = parseFloat(button.dataset.speed);
      if (Math.abs(speed - currentSpeed) < 0.01) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  async saveSettings() {
    const selectedRadio = document.querySelector('input[name="triggerKey"]:checked');
    let triggerKey = 'ShiftLeft';
    let customTriggerKey = '';

    if (selectedRadio) {
        if (selectedRadio.value === 'custom') {
            customTriggerKey = this.customTriggerKey || '';
        } else {
            triggerKey = selectedRadio.value;
        }
    }

    const settings = {
      speedValue: parseFloat(this.speedInput.value),
      triggerKey: triggerKey,
      customTriggerKey: customTriggerKey,
      showOverlay: this.showOverlayCheckbox.checked,
    };

    try {
      await chrome.runtime.sendMessage({ action: 'saveSettings', settings });
      this.showNotification(window.i18n.t('settings_saved'));
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showNotification(window.i18n.t('settings_save_failed'), 'error');
    }
  }

  async resetSettings() {
    const confirmMessage = window.i18n ? window.i18n.t('confirm_reset') : '确定要重置所有设置到默认值吗？';
    if (!confirm(confirmMessage)) {
      return;
    }

    const defaultSettings = {
      speedValue: 2.0,
      triggerKey: 'ShiftLeft',
      showOverlay: true,
      customTriggerKey: ''
    };

    try {
      await chrome.runtime.sendMessage({
        action: 'saveSettings',
        settings: defaultSettings
      });

      // 更新UI
      this.speedInput.value = defaultSettings.speedValue;
      this.speedSlider.value = defaultSettings.speedValue;
      this.updatePresetButtons(defaultSettings.speedValue);
      
      const triggerKeyRadio = document.querySelector(`input[name="triggerKey"][value="${defaultSettings.triggerKey}"]`);
      if (triggerKeyRadio) {
        triggerKeyRadio.checked = true;
      }
      
      this.showOverlayCheckbox.checked = defaultSettings.showOverlay;
      this.customKeyContainer.style.display = 'none';
      this.customTriggerKey = '';
      this.customKeyInput.value = '';
      
      this.showNotification(window.i18n ? window.i18n.t('settings_reset') : '设置已重置');
    } catch (error) {
      console.error('重置设置失败:', error);
      this.showNotification(window.i18n ? window.i18n.t('settings_reset_failed') : '重置设置失败', 'error');
    }
  }

  async exportSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      
      const settingsData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        settings: response
      };

      const blob = new Blob([JSON.stringify(settingsData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `speedkey-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showNotification(window.i18n ? window.i18n.t('settings_exported') : '设置已导出');
    } catch (error) {
      console.error('导出设置失败:', error);
      this.showNotification(window.i18n ? window.i18n.t('settings_export_failed') : '导出设置失败', 'error');
    }
  }

  importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.settings) {
          await chrome.runtime.sendMessage({
            action: 'saveSettings',
            settings: data.settings
          });
          
          // 重新加载设置
          await this.loadSettings();
          
          this.showNotification(window.i18n ? window.i18n.t('settings_imported') : '设置已导入');
        } else {
          throw new Error('Invalid settings file format');
        }
      } catch (error) {
        console.error('导入设置失败:', error);
        this.showNotification(window.i18n ? window.i18n.t('settings_import_failed') : '导入设置失败', 'error');
      }
    });

    input.click();
  }

  showNotification(message, type = 'success') {
    this.notification.textContent = message;
    this.notification.className = `notification ${type} show`;
    
    setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }
}

// 等待页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new OptionsController();
}); 