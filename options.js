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
    // 等待国际化初始化完成
    if (window.i18n) {
      await window.i18n.init();
    }
    
    await this.loadSettings();
    this.setupEventListeners();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      
      // 设置倍速值
      this.speedInput.value = response.speedValue;
      this.speedSlider.value = response.speedValue;
      this.updatePresetButtons(response.speedValue);
      
      // 设置触发键
      const triggerKey = response.triggerKey || 'ShiftLeft';
      
      // 检查是否是预设键
      const triggerKeyRadio = document.querySelector(`input[name="triggerKey"][value="${triggerKey}"]`);
      if (triggerKeyRadio) {
        triggerKeyRadio.checked = true;
        this.customKeyContainer.style.display = 'none';
      } else {
        // 自定义键
        const customRadio = document.querySelector('input[name="triggerKey"][value="custom"]');
        if (customRadio) {
          customRadio.checked = true;
          this.customTriggerKey = triggerKey;
          this.customKeyInput.value = this.formatKeyName(triggerKey);
          this.customKeyContainer.style.display = 'block';
        }
      }
      
      // 设置浮层显示
      this.showOverlayCheckbox.checked = response.showOverlay;
      
      // 设置语言
      if (window.i18n) {
        this.languageSelect.value = window.i18n.getCurrentLanguage();
      }
      
    } catch (error) {
      console.error('加载设置失败:', error);
      this.showNotification(window.i18n ? window.i18n.t('settings_load_failed') : '加载设置失败', 'error');
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
        // 重新加载设置以更新显示的按键名称
        await this.loadSettings();
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
    const selectedTriggerKey = document.querySelector('input[name="triggerKey"]:checked');
    let triggerKey = 'ShiftLeft';
    
    if (selectedTriggerKey) {
      if (selectedTriggerKey.value === 'custom') {
        triggerKey = this.customTriggerKey || 'ShiftLeft';
      } else {
        triggerKey = selectedTriggerKey.value;
      }
    }
    
    const settings = {
      speedValue: parseFloat(this.speedInput.value),
      triggerKey: triggerKey,
      showOverlay: this.showOverlayCheckbox.checked,
      customTriggerKey: this.customTriggerKey
    };

    try {
      await chrome.runtime.sendMessage({
        action: 'saveSettings',
        settings: settings
      });
      
      this.showNotification(window.i18n ? window.i18n.t('settings_saved') : '设置已保存');
    } catch (error) {
      console.error('保存设置失败:', error);
      this.showNotification(window.i18n ? window.i18n.t('settings_save_failed') : '保存设置失败', 'error');
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