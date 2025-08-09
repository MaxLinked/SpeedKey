// SpeedKey Options Page Script
class OptionsController {
  constructor() {
    this.speedInput = document.getElementById('speedValue');
    this.speedSlider = document.getElementById('speedSlider');
    this.showOverlayCheckbox = document.getElementById('showOverlay');
    this.presetButtons = document.querySelectorAll('.preset-btn');
    this.triggerKeyRadios = document.querySelectorAll('input[name="triggerKey"]');
    this.notification = document.getElementById('notification');
    
    // Custom key inputs and UI elements
    this.customKeyContainer = document.getElementById('customKeyContainer');
    this.customKeyInput = document.getElementById('customKeyInput');
    this.clearCustomKeyBtn = document.getElementById('clearCustomKey');
    this.customTriggerKey = '';
    
    // Language switcher removed (Chrome controls extension locale)
    this.languageSelect = null;
    
    // Footer action buttons
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

    // Reload UI when settings change elsewhere (e.g., popup)
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

      // Set trigger key (correctly handle custom key)
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

      // No runtime language setting
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.showNotification(window.i18n.t('settings_load_failed'), 'error');
    }
  }

  setupEventListeners() {
    // Speed number input change
    this.speedInput.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      if (value >= 0.1 && value <= 5.0) {
        this.speedSlider.value = value;
        this.updatePresetButtons(value);
        this.saveSettings();
      }
    });

    // Speed slider input change
    this.speedSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.speedInput.value = value;
      this.updatePresetButtons(value);
      this.saveSettings();
    });

    // Preset speed buttons
    this.presetButtons.forEach(button => {
      button.addEventListener('click', () => {
        const speed = parseFloat(button.dataset.speed);
        this.speedInput.value = speed;
        this.speedSlider.value = speed;
        this.updatePresetButtons(speed);
        this.saveSettings();
      });
    });

    // Trigger key radio selection
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

    // Custom key input interactions
    this.customKeyInput.addEventListener('click', () => {
      this.customKeyInput.value = window.i18n ? window.i18n.t('custom_key_label') : 'Press the key to set...';
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

    // Clear custom key
    this.clearCustomKeyBtn.addEventListener('click', () => {
      this.customTriggerKey = '';
      this.customKeyInput.value = '';
      // Switch to default key
      const defaultRadio = document.querySelector('input[name="triggerKey"][value="ShiftLeft"]');
      if (defaultRadio) {
        defaultRadio.checked = true;
        this.customKeyContainer.style.display = 'none';
        this.saveSettings();
      }
    });

    // Overlay visibility toggle
    this.showOverlayCheckbox.addEventListener('change', () => {
      this.saveSettings();
    });

    // Language is controlled by browser/extension locale; no handler needed

    // Footer action buttons
    this.resetButton.addEventListener('click', () => this.resetSettings());
    this.exportButton.addEventListener('click', () => this.exportSettings());
    this.importButton.addEventListener('click', () => this.importSettings());
  }

  formatKeyName(keyCode) {
    // Common key name formatting
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

    // Letter keys
    if (keyCode.startsWith('Key')) {
      return keyCode.replace('Key', '');
    }
    
    // Digit keys
    if (keyCode.startsWith('Digit')) {
      return keyCode.replace('Digit', '');
    }
    
    // Function keys (F1-F12)
    if (keyCode.startsWith('F') && keyCode.length <= 3) {
      return keyCode;
    }
    
    // Other known keys
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
      this.showNotification(window.i18n ? window.i18n.t('settings_saved') : 'Settings saved');
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showNotification(window.i18n ? window.i18n.t('settings_save_failed') : 'Save failed', 'error');
    }
  }

  async resetSettings() {
    const confirmMessage = window.i18n ? window.i18n.t('confirm_reset') : 'Are you sure you want to reset all settings to defaults?';
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

      // Update UI after reset
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
      
      this.showNotification(window.i18n ? window.i18n.t('settings_reset') : 'Settings reset');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      this.showNotification(window.i18n ? window.i18n.t('settings_reset_failed') : 'Reset failed', 'error');
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
      
      this.showNotification(window.i18n ? window.i18n.t('settings_exported') : 'Settings exported');
    } catch (error) {
      console.error('Failed to export settings:', error);
      this.showNotification(window.i18n ? window.i18n.t('settings_export_failed') : 'Export failed', 'error');
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
          
          // Reload settings after import
          await this.loadSettings();
          
          this.showNotification(window.i18n ? window.i18n.t('settings_imported') : 'Settings imported');
        } else {
          throw new Error('Invalid settings file format');
        }
      } catch (error) {
        console.error('Failed to import settings:', error);
        this.showNotification(window.i18n ? window.i18n.t('settings_import_failed') : 'Import failed', 'error');
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

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsController();
}); 