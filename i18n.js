// SpeedKey Internationalization (i18n) - deprecated in favor of Chrome _locales for UI

class I18n {
  constructor() {
    this.currentLanguage = 'en-US';
    this.translations = {
      'en-US': {
        // App basics
        'app_name': 'SpeedKey',
        'version': 'Version',
        'app_description': 'Professional video speed control tool',
        
        // Basic settings
        'basic_settings': 'Basic Settings',
        'trigger_key': 'Trigger Key',
        'trigger_key_desc': 'Select the key to activate speed control',
        'playback_speed': 'Playback Speed',
        'playback_speed_desc': 'Set the video playback speed when activated',
        'display_settings': 'Display Settings',
        'display_settings_desc': 'Customize user interface display options',
        'language_settings': 'Language Settings',
        'language_settings_desc': 'Select interface display language',
        
        // Key options
        'ShiftLeft': 'Left Shift',
        'ShiftRight': 'Right Shift',
        'ControlLeft': 'Left Ctrl',
        'ControlRight': 'Right Ctrl',
        'AltLeft': 'Left Alt',
        'AltRight': 'Right Alt',
        'Space': 'Space',
        'KeyZ': 'Z',
        'custom_key': 'Custom',
        
        // Custom key
        'custom_key_label': 'Press the key to set:',
        'custom_key_hint': 'Tip: Supports letters, numbers, F-keys and most other keys',
        'clear': 'Clear',
        
        // Speed settings
        'quick_settings': 'Quick Settings:',
        
        // Display settings
        'show_overlay': 'Show Speed Overlay',
        'show_overlay_desc': 'Display current speed value in top-right corner',
        
        // Footer
        'footer_text': 'Make video watching more efficient',
        'reset_settings': 'Reset Settings',
        'export_settings': 'Export Settings',
        'import_settings': 'Import Settings',
        
        // Popup
        'current_speed': 'Current Speed',
        'how_to_use': 'How to Use',
        'hold_key_speed': 'Hold {key} to speed up videos',
        'open_settings': 'Open Settings',
        
        // Reverse mode (future)
        'reverse_mode': 'Reverse',
        'reverse_settings': 'Reverse Settings',
        'enable_reverse': 'Enable Reverse Mode',
        'reverse_desc': 'Hold trigger key for 1+ seconds to play in reverse',
        
        // Notifications
        'settings_saved': 'Settings saved successfully',
        'settings_reset': 'Settings reset to default',
        'settings_exported': 'Settings exported',
        'settings_imported': 'Settings imported successfully',

        // Popup
        'popup.title': 'SpeedKey',
        'popup.subtitle': 'Video Speed Controller',
        'popup.currentSpeed': 'Current Speed',
        'popup.adjustSpeed': 'Adjust Speed',
        'popup.quickSet': 'Quick Set:',
        'popup.showOverlay': 'Show Speed Overlay',
        'popup.advancedSettings': 'Advanced Settings',
        'popup.usage.title': 'How to use:',
        'popup.usage.step1': '• Hold trigger key: Activate speed playback',
        'popup.usage.step2': '• Release key: Return to normal speed',
        'popup.usage.step3': '• Scroll wheel while holding: Fine adjust (±0.1×)',
        'popup.status.ready': 'Ready',
        'popup.quickHint': 'Hold trigger key to activate',
        'popup.settings': 'Settings',

        // Options page
        'options.title': 'SpeedKey',
        'options.subtitle': 'Professional Video Speed Controller',
        'options.description': 'Intelligent video playback speed control for HTML5 videos, enhancing your viewing experience.',
        'options.triggerKeySettings': 'Trigger Key Settings',
        'options.triggerKeyTitle': 'Trigger Key Selection',
        'options.triggerKeyDesc': 'Choose the key to control video speed',
        'options.customKey': 'Custom Key',
        'options.customKeyPlaceholder': 'Press any key...',
        'options.clearCustom': 'Clear',
        'options.customKeyHint': 'Click the input box and press the key you want to use',
        'options.speedSettings': 'Speed Settings',
        'options.speedTitle': 'Default Speed',
        'options.speedDesc': 'Set the speed when trigger key is pressed',
        'options.currentSpeed': 'Current: ',
        'options.quickPresets': 'Quick presets: ',
        'options.otherSettings': 'Other Settings',
        'options.overlayTitle': 'Speed Overlay Display',
        'options.overlayDesc': 'Show speed indicator on video',
        'options.autoRestoreTitle': 'Auto Restore Normal Speed',
        'options.autoRestoreDesc': 'Automatically restore to 1× when switching tabs',
        'options.scrollAdjustTitle': 'Scroll Wheel Adjustment',
        'options.scrollAdjustDesc': 'Use scroll wheel to fine-tune speed while holding trigger key',
        'options.languageSettings': 'Language Settings',
        'options.footer.madeWith': 'Made with ❤️ for better video experience',
        'options.footer.github': 'GitHub',
        'options.footer.issues': 'Report Issues',
        'options.footer.help': 'Help',
        'settings_load_failed': 'Failed to load settings',
        'settings_save_failed': 'Failed to save settings'
      },
      
      'zh-CN': {
        // App basics (Chinese)
        'app_name': '键速',
        'version': '版本',
        'app_description': '专业的视频倍速播放工具',
        
        // Basic settings (Chinese)
        'basic_settings': '基础设置',
        'trigger_key': '触发按键',
        'trigger_key_desc': '选择用于激活倍速播放的按键',
        'playback_speed': '播放倍速',
        'playback_speed_desc': '设置激活时的视频播放倍速',
        'display_settings': '显示设置',
        'display_settings_desc': '自定义用户界面显示选项',
        'language_settings': '语言设置',
        'language_settings_desc': '选择界面显示语言',
        
        // Key options (Chinese)
        'ShiftLeft': '左 Shift',
        'ShiftRight': '右 Shift',
        'ControlLeft': '左 Ctrl',
        'ControlRight': '右 Ctrl',
        'AltLeft': '左 Alt',
        'AltRight': '右 Alt',
        'Space': '空格键',
        'KeyZ': 'Z',
        'custom_key': '自定义',
        
        // Custom key (Chinese)
        'custom_key_label': '按下要设置的键:',
        'custom_key_hint': '提示：支持字母、数字、F键等大部分按键',
        'clear': '清除',
        
        // Speed settings (Chinese)
        'quick_settings': '快速设置：',
        
        // Display settings (Chinese)
        'show_overlay': '显示倍速浮层',
        'show_overlay_desc': '在页面右上角显示当前倍速值',
        
        // Footer (Chinese)
        'footer_text': '让视频观看更高效',
        'reset_settings': '重置设置',
        'export_settings': '导出设置',
        'import_settings': '导入设置',
        
        // Popup (Chinese)
        'current_speed': '当前速度',
        'how_to_use': '使用方法',
        'hold_key_speed': '按住 {key} 可加速视频播放',
        'open_settings': '打开设置',
        
        // Reverse mode (Chinese)
        'reverse_mode': '倒退',
        'reverse_settings': '倒退设置',
        'enable_reverse': '启用倒退模式',
        'reverse_desc': '按住触发键超过1秒可倒退播放',
        
        // Notifications (Chinese)
        'settings_saved': '设置保存成功',
        'settings_reset': '设置已重置为默认值',
        'settings_exported': '设置已导出',
        'settings_imported': '设置导入成功',

        // Popup (Chinese)
        'popup.title': 'SpeedKey',
        'popup.subtitle': '视频倍速控制器',
        'popup.currentSpeed': '当前倍速',
        'popup.adjustSpeed': '调整倍速',
        'popup.quickSet': '快速设置：',
        'popup.showOverlay': '显示倍速浮层',
        'popup.advancedSettings': '高级设置',
        'popup.usage.title': '使用方法：',
        'popup.usage.step1': '• 按住触发键：激活倍速播放',
        'popup.usage.step2': '• 松开按键：恢复正常速度',
        'popup.usage.step3': '• 按住时滚轮：微调倍速（±0.1×）',
        'popup.status.ready': '准备就绪',
        'popup.quickHint': '按住触发键以激活',
        'popup.settings': '设置',

        // Options page (Chinese)
        'options.title': 'SpeedKey',
        'options.subtitle': '专业视频倍速播放插件',
        'options.description': '智能控制HTML5视频播放倍速，提升您的观看体验。',
        'options.triggerKeySettings': '触发按键设置',
        'options.triggerKeyTitle': '触发按键选择',
        'options.triggerKeyDesc': '选择控制视频倍速的按键',
        'options.customKey': '自定义按键',
        'options.customKeyPlaceholder': '按任意键...',
        'options.clearCustom': '清除',
        'options.customKeyHint': '点击输入框并按下您要使用的按键',
        'options.speedSettings': '倍速设置',
        'options.speedTitle': '默认倍速',
        'options.speedDesc': '设置按下触发键时的播放倍速',
        'options.currentSpeed': '当前：',
        'options.quickPresets': '快速预设：',
        'options.otherSettings': '其他设置',
        'options.overlayTitle': '倍速浮层显示',
        'options.overlayDesc': '在视频上显示倍速指示器',
        'options.autoRestoreTitle': '自动恢复正常倍速',
        'options.autoRestoreDesc': '切换标签页时自动恢复到1×倍速',
        'options.scrollAdjustTitle': '滚轮调节',
        'options.scrollAdjustDesc': '按住触发键时可用滚轮微调倍速',
        'options.languageSettings': '语言设置',
        'options.footer.madeWith': '用 ❤️ 制作，为了更好的视频体验',
        'options.footer.github': 'GitHub',
        'options.footer.issues': '反馈问题',
        'options.footer.help': '帮助',
        'settings_load_failed': '加载设置失败',
        'settings_save_failed': '保存设置失败'
      }
    };
    this.initPromise = this.init();
  }
  
  async init() {
    try {
      console.error("SpeedKey i18n: Error initializing from storage.", e);
      this.currentLanguage = 'en-US';
    } finally {
      this.applyLanguage(this.currentLanguage);
    }
  }
  
  async setLanguage(lang) {
    this.currentLanguage = lang;
    try {
      console.error("SpeedKey i18n: Error saving language.", e);
    }
    this.applyLanguage(lang);
  }
  
  t(key) {
    return this.translations[this.currentLanguage]?.[key] 
        || this.translations['en-US']?.[key] 
        || key;
  }
  
  applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const text = this.t(key);
      if (element.hasAttribute('placeholder')) {
        element.placeholder = text;
      } else {
        element.textContent = text;
      }
    });
    document.documentElement.lang = lang.startsWith('zh') ? 'zh' : 'en';
  }
  
  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

window.i18n = new I18n();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.i18n.initPromise) {
        window.i18n.initPromise = window.i18n.init();
    }
  });
} else {
    if (!window.i18n.initPromise) {
        window.i18n.initPromise = window.i18n.init();
    }
} 