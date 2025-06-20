// SpeedKey 内容脚本 - 核心功能实现
class SpeedKeyController {
  constructor() {
    this.isSpeedActive = false;
    this.overlay = null;
    this.settings = {
      speedValue: 2.0,
      triggerKey: 'ShiftLeft',
      customTriggerKey: '',
      showOverlay: true
    };
    this.originalSpeeds = new Map();

    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.createOverlay();
    console.log('SpeedKey initialized with settings:', this.settings);
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response) {
        this.settings = { ...this.settings, ...response };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    document.addEventListener('keyup', this.handleKeyUp.bind(this), true);
    document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    
    // 监听来自背景脚本的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateSettings') {
            this.updateSettings(request.settings);
        } else if (request.action === 'toggleSpeed') {
            this.toggleSpeedMode();
        }
    });
  }

  updateSettings(newSettings) {
    // 更新内存设置
    const relevantKeys = ['triggerKey', 'customTriggerKey', 'speedValue', 'showOverlay'];
    let changed = false;
    for (const key of relevantKeys) {
        if (newSettings[key] !== undefined && this.settings[key] !== newSettings[key]) {
            this.settings[key] = newSettings[key];
            changed = true;
        }
    }
    if (changed) {
        console.log('Settings updated:', this.settings);
        if (this.overlay) {
            this.overlay.updateVisibility(this.settings.showOverlay);
        }
    }
  }

  createOverlay() {
    if (this.overlay) {
      this.overlay.remove();
    }
    this.overlay = new SpeedOverlay();
    this.overlay.updateVisibility(this.settings.showOverlay);
  }

  handleKeyDown(event) {
    // 检查是否在输入元素中
    if (this.isInInputElement(event.target)) {
      return;
    }

    // 获取实际使用的触发键
    const actualTriggerKey = this.settings.customTriggerKey || this.settings.triggerKey;
    
    if (event.code === actualTriggerKey && !this.isSpeedActive) {
      this.isSpeedActive = true;
      this.activateSpeedMode();
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    // 获取实际使用的触发键
    const actualTriggerKey = this.settings.customTriggerKey || this.settings.triggerKey;
    
    if (event.code === actualTriggerKey && this.isSpeedActive) {
      this.isSpeedActive = false;
      this.deactivateSpeedMode();
      event.preventDefault();
    }
  }

  handleWheel(event) {
    if (!this.isSpeedActive) return;
    
    event.preventDefault();
    
    // 滚轮微调倍速
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.settings.speedValue = Math.max(0.1, Math.min(5.0, this.settings.speedValue + delta));
    this.settings.speedValue = Math.round(this.settings.speedValue * 10) / 10;
    
    // 更新所有视频速度
    this.updateVideoSpeeds();
    this.updateOverlay();
  }

  isInInputElement(element) {
    const inputTags = ['input', 'textarea', 'select'];
    const editableElements = ['true', 'plaintext-only'];
    
    return inputTags.includes(element.tagName.toLowerCase()) ||
           editableElements.includes(element.contentEditable) ||
           element.isContentEditable;
  }

  activateSpeedMode() {
    const videos = document.querySelectorAll('video');
    console.log('Found videos:', videos.length);
    
    videos.forEach(video => {
      if (!this.originalSpeeds.has(video)) {
        this.originalSpeeds.set(video, video.playbackRate);
        console.log('Saved original speed:', video.playbackRate);
      }
      video.playbackRate = this.settings.speedValue;
      console.log('Set speed to:', this.settings.speedValue);
    });
    
    if (this.overlay && this.settings.showOverlay) {
      this.overlay.show(this.settings.speedValue);
    }
  }

  deactivateSpeedMode() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      const originalSpeed = this.originalSpeeds.get(video);
      if (originalSpeed !== undefined) {
        video.playbackRate = originalSpeed;
        console.log('Restored speed to:', originalSpeed);
      }
    });
    
    if (this.overlay) {
      this.overlay.hide();
    }
  }

  updateVideoSpeeds() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.playbackRate = this.settings.speedValue;
    });
  }

  updateOverlay() {
    if (this.overlay) {
      this.overlay.show(this.settings.speedValue);
    }
  }

  toggleSpeedMode() {
    if (this.isSpeedActive) {
      this.deactivateSpeedMode();
      this.isSpeedActive = false;
    } else {
      this.activateSpeedMode();
      this.isSpeedActive = true;
    }
  }
}

// 速度显示覆盖层
class SpeedOverlay {
  constructor() {
    this.element = null;
    this.createOverlay();
  }

  createOverlay() {
    this.element = document.createElement('div');
    this.element.id = 'speedkey-overlay';
    this.element.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      z-index: 10000;
      display: none;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    document.body.appendChild(this.element);
  }

  show(speed) {
    if (this.element) {
      this.element.textContent = `${speed}×`;
      this.element.style.display = 'block';
    }
  }

  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }

  updateVisibility(visible) {
    if (this.element) {
      this.element.style.display = visible ? (this.element.textContent ? 'block' : 'none') : 'none';
    }
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// 初始化控制器
const speedKeyController = new SpeedKeyController(); 