// SpeedKey 国际化支持
class I18nManager {
  constructor() {
    this.currentLang = 'zh-CN';
    this.translations = {
      'zh-CN': {
        // 基本信息
        app_name: 'SpeedKey',
        app_description: '专业的视频倍速播放工具',
        version: '版本',
        
        // 设置页面
        basic_settings: '基础设置',
        trigger_key: '触发按键',
        trigger_key_desc: '选择用于激活倍速播放的按键',
        custom_key: '自定义',
        custom_key_label: '按下要设置的键:',
        custom_key_hint: '提示：支持字母、数字、F键等大部分按键',
        clear: '清除',
        
        playback_speed: '播放倍速',
        playback_speed_desc: '设置激活时的视频播放倍速',
        quick_settings: '快速设置：',
        
        display_settings: '显示设置',
        display_settings_desc: '自定义用户界面显示选项',
        show_overlay: '显示倍速浮层',
        show_overlay_desc: '在页面右上角显示当前倍速值',
        
        language_settings: '语言设置',
        language_settings_desc: '选择界面显示语言',
        
        // 使用说明
        usage_guide: '使用说明',
        basic_operation: '基本操作',
        basic_operation_desc: '在任意包含视频的网页上，按住设定的触发键即可激活倍速播放，松开后恢复正常速度。',
        realtime_adjust: '实时调节',
        realtime_adjust_desc: '按住触发键的同时，使用鼠标滚轮可以实时微调播放倍速（每次±0.1倍）。',
        smart_protection: '智能保护',
        smart_protection_desc: '在输入框、文本区域内按键不会触发功能；切换标签页或窗口时自动恢复正常速度。',
        dynamic_detection: '动态检测',
        dynamic_detection_desc: '自动检测页面中新加载的视频元素，确保所有视频都能享受倍速功能。',
        
        // 按钮和操作
        reset_settings: '重置设置',
        export_settings: '导出设置',
        import_settings: '导入设置',
        save_settings: '保存设置',
        
        // 通知消息
        settings_saved: '设置已保存',
        settings_reset: '设置已重置',
        settings_exported: '设置已导出',
        settings_imported: '设置已导入',
        settings_load_failed: '加载设置失败',
        settings_save_failed: '保存设置失败',
        settings_reset_failed: '重置设置失败',
        settings_export_failed: '导出设置失败',
        settings_import_failed: '导入设置失败',
        confirm_reset: '确定要重置所有设置到默认值吗？',
        
        // 键名翻译
        'ShiftLeft': '左 Shift',
        'ShiftRight': '右 Shift',
        'ControlLeft': '左 Ctrl',
        'ControlRight': '右 Ctrl',
        'AltLeft': '左 Alt',
        'AltRight': '右 Alt',
        'Space': '空格键',
        'KeyZ': 'Z',
        
        // 底部版权
        footer_text: '让视频观看更高效',
      },
      
      'en-US': {
        // Basic info
        app_name: 'SpeedKey',
        app_description: 'Professional Video Speed Control Tool',
        version: 'Version',
        
        // Settings page
        basic_settings: 'Basic Settings',
        trigger_key: 'Trigger Key',
        trigger_key_desc: 'Select the key to activate speed playback',
        custom_key: 'Custom',
        custom_key_label: 'Press the key to set:',
        custom_key_hint: 'Tip: Supports letters, numbers, F keys and most other keys',
        clear: 'Clear',
        
        playback_speed: 'Playback Speed',
        playback_speed_desc: 'Set the video playback speed when activated',
        quick_settings: 'Quick Settings:',
        
        display_settings: 'Display Settings',
        display_settings_desc: 'Customize user interface display options',
        show_overlay: 'Show Speed Overlay',
        show_overlay_desc: 'Display current speed value in the top-right corner of the page',
        
        language_settings: 'Language Settings',
        language_settings_desc: 'Select interface display language',
        
        // Usage guide
        usage_guide: 'Usage Guide',
        basic_operation: 'Basic Operation',
        basic_operation_desc: 'On any webpage with videos, hold the set trigger key to activate speed playback, release to restore normal speed.',
        realtime_adjust: 'Real-time Adjustment',
        realtime_adjust_desc: 'While holding the trigger key, use mouse wheel to fine-tune playback speed in real-time (±0.1x each time).',
        smart_protection: 'Smart Protection',
        smart_protection_desc: 'Key presses in input fields or text areas won\'t trigger the function; automatically restore normal speed when switching tabs or windows.',
        dynamic_detection: 'Dynamic Detection',
        dynamic_detection_desc: 'Automatically detect newly loaded video elements on the page to ensure all videos can enjoy speed functionality.',
        
        // Buttons and actions
        reset_settings: 'Reset Settings',
        export_settings: 'Export Settings',
        import_settings: 'Import Settings',
        save_settings: 'Save Settings',
        
        // Notification messages
        settings_saved: 'Settings saved',
        settings_reset: 'Settings reset',
        settings_exported: 'Settings exported',
        settings_imported: 'Settings imported',
        settings_load_failed: 'Failed to load settings',
        settings_save_failed: 'Failed to save settings',
        settings_reset_failed: 'Failed to reset settings',
        settings_export_failed: 'Failed to export settings',
        settings_import_failed: 'Failed to import settings',
        confirm_reset: 'Are you sure you want to reset all settings to default values?',
        
        // Key name translations
        'ShiftLeft': 'Left Shift',
        'ShiftRight': 'Right Shift',
        'ControlLeft': 'Left Ctrl',
        'ControlRight': 'Right Ctrl',
        'AltLeft': 'Left Alt',
        'AltRight': 'Right Alt',
        'Space': 'Space',
        'KeyZ': 'Z',
        
        // Footer
        footer_text: 'Make video watching more efficient',
      }
    };
    
    this.init();
  }

  async init() {
    await this.loadLanguage();
    this.updatePageLanguage();
  }

  async loadLanguage() {
    try {
      const result = await chrome.storage.sync.get(['language']);
      this.currentLang = result.language || this.detectBrowserLanguage();
    } catch (error) {
      this.currentLang = this.detectBrowserLanguage();
    }
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US';
  }

  async setLanguage(lang) {
    this.currentLang = lang;
    try {
      await chrome.storage.sync.set({ language: lang });
      this.updatePageLanguage();
    } catch (error) {
      console.error('Failed to save language setting:', error);
    }
  }

  t(key) {
    return this.translations[this.currentLang]?.[key] || key;
  }

  updatePageLanguage() {
    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang;
    
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });
    
    // Update title if exists
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.textContent.includes('SpeedKey')) {
      titleElement.textContent = `${this.t('app_name')} - ${this.t('basic_settings')}`;
    }
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  getSupportedLanguages() {
    return [
      { code: 'zh-CN', name: '中文（简体）' },
      { code: 'en-US', name: 'English' }
    ];
  }
}

// 全局实例
window.i18n = new I18nManager(); 