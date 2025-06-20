// SpeedKey 国际化支持
class I18nManager {
  constructor() {
    this.currentLanguage = 'en-US'; // 默认设置为英文
    this.translations = {
      'en-US': {
        // 应用基础信息
        'app_name': 'SpeedKey',
        'version': 'Version',
        'app_description': 'Professional video speed control tool',
        
        // 基础设置
        'basic_settings': 'Basic Settings',
        'trigger_key': 'Trigger Key',
        'trigger_key_desc': 'Select the key to activate speed control',
        'playback_speed': 'Playback Speed',
        'playback_speed_desc': 'Set the video playback speed when activated',
        'display_settings': 'Display Settings',
        'display_settings_desc': 'Customize user interface display options',
        'language_settings': 'Language Settings',
        'language_settings_desc': 'Select interface display language',
        
        // 按键选项
        'ShiftLeft': 'Left Shift',
        'ShiftRight': 'Right Shift',
        'ControlLeft': 'Left Ctrl',
        'ControlRight': 'Right Ctrl',
        'AltLeft': 'Left Alt',
        'AltRight': 'Right Alt',
        'Space': 'Space',
        'KeyZ': 'Z',
        'custom_key': 'Custom',
        
        // 自定义按键
        'custom_key_label': 'Press the key to set:',
        'custom_key_hint': 'Tip: Supports letters, numbers, F-keys and most other keys',
        'clear': 'Clear',
        
        // 速度设置
        'quick_settings': 'Quick Settings:',
        
        // 显示设置
        'show_overlay': 'Show Speed Overlay',
        'show_overlay_desc': 'Display current speed value in top-right corner',
        
        // 页脚
        'footer_text': 'Make video watching more efficient',
        'reset_settings': 'Reset Settings',
        'export_settings': 'Export Settings',
        'import_settings': 'Import Settings',
        
        // 弹窗
        'current_speed': 'Current Speed',
        'how_to_use': 'How to Use',
        'hold_key_speed': 'Hold {key} to speed up videos',
        'open_settings': 'Open Settings',
        
        // 倒退功能
        'reverse_mode': 'Reverse',
        'reverse_settings': 'Reverse Settings',
        'enable_reverse': 'Enable Reverse Mode',
        'reverse_desc': 'Hold trigger key for 1+ seconds to play in reverse',
        
        // 通知消息
        'settings_saved': 'Settings saved successfully',
        'settings_reset': 'Settings reset to default',
        'settings_exported': 'Settings exported',
        'settings_imported': 'Settings imported successfully'
      },
      
      'zh-CN': {
        // 应用基础信息
        'app_name': '键速',
        'version': '版本',
        'app_description': '专业的视频倍速播放工具',
        
        // 基础设置
        'basic_settings': '基础设置',
        'trigger_key': '触发按键',
        'trigger_key_desc': '选择用于激活倍速播放的按键',
        'playback_speed': '播放倍速',
        'playback_speed_desc': '设置激活时的视频播放倍速',
        'display_settings': '显示设置',
        'display_settings_desc': '自定义用户界面显示选项',
        'language_settings': '语言设置',
        'language_settings_desc': '选择界面显示语言',
        
        // 按键选项
        'ShiftLeft': '左 Shift',
        'ShiftRight': '右 Shift',
        'ControlLeft': '左 Ctrl',
        'ControlRight': '右 Ctrl',
        'AltLeft': '左 Alt',
        'AltRight': '右 Alt',
        'Space': '空格键',
        'KeyZ': 'Z',
        'custom_key': '自定义',
        
        // 自定义按键
        'custom_key_label': '按下要设置的键:',
        'custom_key_hint': '提示：支持字母、数字、F键等大部分按键',
        'clear': '清除',
        
        // 速度设置
        'quick_settings': '快速设置：',
        
        // 显示设置
        'show_overlay': '显示倍速浮层',
        'show_overlay_desc': '在页面右上角显示当前倍速值',
        
        // 页脚
        'footer_text': '让视频观看更高效',
        'reset_settings': '重置设置',
        'export_settings': '导出设置',
        'import_settings': '导入设置',
        
        // 弹窗
        'current_speed': '当前速度',
        'how_to_use': '使用方法',
        'hold_key_speed': '按住 {key} 可加速视频播放',
        'open_settings': '打开设置',
        
        // 倒退功能
        'reverse_mode': '倒退',
        'reverse_settings': '倒退设置',
        'enable_reverse': '启用倒退模式',
        'reverse_desc': '按住触发键超过1秒可倒退播放',
        
        // 通知消息
        'settings_saved': '设置保存成功',
        'settings_reset': '设置已重置为默认值',
        'settings_exported': '设置已导出',
        'settings_imported': '设置导入成功'
      }
    };
    
    this.init();
  }
  
  async init() {
    // 从存储中获取语言设置，如果没有则检测浏览器语言
    try {
      const result = await chrome.storage.sync.get(['language']);
      if (result.language) {
        this.currentLanguage = result.language;
      } else {
        // 检测浏览器语言，但默认优先使用英文
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (browserLanguage.startsWith('zh')) {
          this.currentLanguage = 'zh-CN';
        } else {
          this.currentLanguage = 'en-US'; // 默认英文
        }
        // 保存检测到的语言
        await chrome.storage.sync.set({ language: this.currentLanguage });
      }
    } catch (error) {
      console.log('I18n init error:', error);
      this.currentLanguage = 'en-US'; // 出错时使用英文
    }
    
    this.updateUI();
  }
  
  t(key, params = {}) {
    let text = this.translations[this.currentLanguage]?.[key] || 
               this.translations['en-US'][key] || 
               key;
    
    // 替换参数
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  }
  
  async setLanguage(language) {
    this.currentLanguage = language;
    await chrome.storage.sync.set({ language });
    this.updateUI();
  }
  
  updateUI() {
    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const text = this.t(key);
      
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = text;
      } else {
        element.textContent = text;
      }
    });
    
    // 更新语言选择器
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      languageSelect.value = this.currentLanguage;
    }
    
    // 更新 HTML lang 属性
    document.documentElement.lang = this.currentLanguage === 'zh-CN' ? 'zh-CN' : 'en';
  }
  
  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// 全局 i18n 实例
window.i18n = new I18nManager(); 