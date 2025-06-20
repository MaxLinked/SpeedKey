// SpeedKey 选项页面脚本
class OptionsController {
  constructor() {
    this.speedInput = document.getElementById('speedValue');
    this.speedSlider = document.getElementById('speedSlider');
    this.showOverlayCheckbox = document.getElementById('showOverlay');
    this.presetButtons = document.querySelectorAll('.preset-btn');
    this.triggerKeyRadios = document.querySelectorAll('input[name="triggerKey"]');
    this.notification = document.getElementById('notification');
    
    // 底部功能按钮
    this.resetButton = document.getElementById('resetSettings');
    this.exportButton = document.getElementById('exportSettings');
    this.importButton = document.getElementById('importSettings');
    
    this.init();
  }

  async init() {
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
      const triggerKeyRadio = document.querySelector(`input[name="triggerKey"][value="${response.triggerKey}"]`);
      if (triggerKeyRadio) {
        triggerKeyRadio.checked = true;
      }
      
      // 设置浮层显示
      this.showOverlayCheckbox.checked = response.showOverlay;
      
    } catch (error) {
      console.error('加载设置失败:', error);
      this.showNotification('加载设置失败', 'error');
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
        this.saveSettings();
      });
    });

    // 浮层显示开关
    this.showOverlayCheckbox.addEventListener('change', () => {
      this.saveSettings();
    });

    // 底部功能按钮
    this.resetButton.addEventListener('click', () => this.resetSettings());
    this.exportButton.addEventListener('click', () => this.exportSettings());
    this.importButton.addEventListener('click', () => this.importSettings());
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
    
    const settings = {
      speedValue: parseFloat(this.speedInput.value),
      triggerKey: selectedTriggerKey ? selectedTriggerKey.value : 'ShiftLeft',
      showOverlay: this.showOverlayCheckbox.checked
    };

    try {
      await chrome.runtime.sendMessage({
        action: 'saveSettings',
        settings: settings
      });
      
      this.showNotification('设置已保存');
    } catch (error) {
      console.error('保存设置失败:', error);
      this.showNotification('保存设置失败', 'error');
    }
  }

  async resetSettings() {
    if (!confirm('确定要重置所有设置到默认值吗？')) {
      return;
    }

    const defaultSettings = {
      speedValue: 2.0,
      triggerKey: 'ShiftLeft',
      showOverlay: true
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
      
      this.showNotification('设置已重置');
    } catch (error) {
      console.error('重置设置失败:', error);
      this.showNotification('重置设置失败', 'error');
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
      
      this.showNotification('设置已导出');
    } catch (error) {
      console.error('导出设置失败:', error);
      this.showNotification('导出设置失败', 'error');
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
        
        // 验证数据格式
        if (!data.settings || !data.version) {
          throw new Error('无效的设置文件格式');
        }

        const settings = data.settings;
        
        // 验证设置值
        if (settings.speedValue < 0.1 || settings.speedValue > 5.0) {
          throw new Error('倍速值超出有效范围');
        }

        // 保存导入的设置
        await chrome.runtime.sendMessage({
          action: 'saveSettings',
          settings: settings
        });

        // 重新加载页面设置
        await this.loadSettings();
        
        this.showNotification('设置已导入');
      } catch (error) {
        console.error('导入设置失败:', error);
        this.showNotification('导入设置失败: ' + error.message, 'error');
      }
    });
    
    input.click();
  }

  showNotification(message, type = 'success') {
    this.notification.textContent = message;
    this.notification.className = `notification ${type}`;
    this.notification.classList.add('show');
    
    setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new OptionsController();
}); 