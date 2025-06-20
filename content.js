// SpeedKey 内容脚本 - 核心功能实现
class SpeedKeyController {
  constructor() {
    this.isKeyPressed = false;
    this.originalSpeeds = new Map();
    this.videos = new Set();
    this.overlay = null;
    this.settings = {
      triggerKey: 'ShiftLeft',
      speedValue: 2.0,
      showOverlay: true
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.createOverlay();
    this.setupEventListeners();
    this.findVideos();
    this.setupMutationObserver();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['triggerKey', 'speedValue', 'showOverlay']);
      this.settings = {
        triggerKey: result.triggerKey || 'ShiftLeft',
        speedValue: result.speedValue || 2.0,
        showOverlay: result.showOverlay !== false
      };
    } catch (error) {
      console.log('使用默认设置');
    }
  }

  createOverlay() {
    if (!this.settings.showOverlay) return;
    
    this.overlay = document.createElement('div');
    this.overlay.id = 'speedkey-overlay';
    this.overlay.className = 'speedkey-hidden';
    this.overlay.innerHTML = `
      <div class="speedkey-content">
        <span class="speedkey-icon">⚡</span>
        <span class="speedkey-text">${this.settings.speedValue}×</span>
      </div>
    `;
    document.body.appendChild(this.overlay);
  }

  setupEventListeners() {
    // 键盘事件监听
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    document.addEventListener('keyup', this.handleKeyUp.bind(this), true);
    
    // 鼠标滚轮微调
    document.addEventListener('wheel', this.handleWheel.bind(this), true);
    
    // 窗口失焦保护
    window.addEventListener('blur', this.handleWindowBlur.bind(this));
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    
    // 标签页可见性变化
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  handleKeyDown(event) {
    // 忽略在输入框内的按键
    if (this.isInInputElement(event.target)) return;
    
    // 检查是否是触发键
    if (event.code === this.settings.triggerKey && !this.isKeyPressed) {
      this.isKeyPressed = true;
      this.activateSpeedMode();
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    if (event.code === this.settings.triggerKey && this.isKeyPressed) {
      this.isKeyPressed = false;
      this.deactivateSpeedMode();
    }
  }

  handleWheel(event) {
    if (!this.isKeyPressed) return;
    
    event.preventDefault();
    
    // 滚轮微调倍速
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.settings.speedValue = Math.max(0.1, Math.min(5.0, this.settings.speedValue + delta));
    this.settings.speedValue = Math.round(this.settings.speedValue * 10) / 10;
    
    // 更新所有视频速度
    this.updateVideoSpeeds();
    this.updateOverlay();
  }

  handleWindowBlur() {
    if (this.isKeyPressed) {
      this.deactivateSpeedMode();
    }
  }

  handleWindowFocus() {
    // 窗口重新获得焦点时重置状态
    this.isKeyPressed = false;
  }

  handleVisibilityChange() {
    if (document.hidden && this.isKeyPressed) {
      this.deactivateSpeedMode();
    }
  }

  isInInputElement(element) {
    const inputTags = ['input', 'textarea', 'select'];
    const editableElements = ['true', 'plaintext-only'];
    
    return inputTags.includes(element.tagName.toLowerCase()) ||
           editableElements.includes(element.contentEditable) ||
           element.isContentEditable;
  }

  findVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (!this.videos.has(video)) {
        this.videos.add(video);
        this.originalSpeeds.set(video, video.playbackRate);
      }
    });
  }

  setupMutationObserver() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查新增的视频元素
            if (node.tagName === 'VIDEO') {
              this.videos.add(node);
              this.originalSpeeds.set(node, node.playbackRate);
              
              // 如果当前正在倍速模式，立即应用到新视频
              if (this.isKeyPressed) {
                node.playbackRate = this.settings.speedValue;
              }
            }
            
            // 检查新增节点内的视频元素
            const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
            videos.forEach(video => {
              if (!this.videos.has(video)) {
                this.videos.add(video);
                this.originalSpeeds.set(video, video.playbackRate);
                
                if (this.isKeyPressed) {
                  video.playbackRate = this.settings.speedValue;
                }
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  activateSpeedMode() {
    this.findVideos(); // 重新扫描视频元素
    
    this.videos.forEach(video => {
      if (!this.originalSpeeds.has(video)) {
        this.originalSpeeds.set(video, video.playbackRate);
      }
      video.playbackRate = this.settings.speedValue;
    });
    
    this.showOverlay();
  }

  deactivateSpeedMode() {
    this.videos.forEach(video => {
      const originalSpeed = this.originalSpeeds.get(video) || 1.0;
      video.playbackRate = originalSpeed;
    });
    
    this.hideOverlay();
  }

  updateVideoSpeeds() {
    this.videos.forEach(video => {
      video.playbackRate = this.settings.speedValue;
    });
  }

  showOverlay() {
    if (this.overlay) {
      this.overlay.className = 'speedkey-visible';
      this.updateOverlay();
    }
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.className = 'speedkey-hidden';
    }
  }

  updateOverlay() {
    if (this.overlay) {
      const textElement = this.overlay.querySelector('.speedkey-text');
      if (textElement) {
        textElement.textContent = `${this.settings.speedValue}×`;
      }
    }
  }

  // 监听来自popup或options的设置更新
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    
    if (this.overlay) {
      this.overlay.remove();
      this.createOverlay();
    }
  }
}

// 初始化控制器
const speedKeyController = new SpeedKeyController();

// 监听来自扩展的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateSettings') {
    speedKeyController.updateSettings(request.settings);
    sendResponse({ success: true });
  }
}); 