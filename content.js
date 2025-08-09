// SpeedKey Content Script - Core functionality
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
    this.mutationObserver = null;

    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.createOverlay();
    this.observeVideoElements();
    this.setupWindowGuards();
    console.log('SpeedKey initialized with settings:', this.settings);
  }

  async loadSettings() {
    try {
      if (window.SpeedKeySettings) {
        const cfg = await window.SpeedKeySettings.getSettings();
        this.settings = { ...this.settings, ...cfg };
      } else {
        const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
        if (response) this.settings = { ...this.settings, ...response };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    document.addEventListener('keyup', this.handleKeyUp.bind(this), true);
    document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request) => {
      if (request && request.action === 'settingsUpdated') {
        this.updateSettings(request.settings);
      } else if (request && request.action === 'toggleSpeed') {
        this.toggleSpeedMode();
      }
    });

    // Listen to storage changes to take effect across tabs in real-time
    if (window.SpeedKeySettings) {
      window.SpeedKeySettings.onSettingsChanged((updated) => this.updateSettings(updated));
    } else {
      try {
        chrome.storage.onChanged.addListener((changes, area) => {
          if (area !== 'sync') return;
          const updated = {};
          for (const key of ['speedValue', 'triggerKey', 'customTriggerKey', 'showOverlay']) {
            if (changes[key]) updated[key] = changes[key].newValue;
          }
          if (Object.keys(updated).length) this.updateSettings(updated);
        });
      } catch (_) { /* ignore */ }
    }
  }

  updateSettings(newSettings) {
    const oldSettings = { ...this.settings };
    this.settings = { ...this.settings, ...newSettings };
    
    // Check if relevant settings have changed
    const relevantKeys = ['triggerKey', 'customTriggerKey', 'speedValue', 'showOverlay'];
    const changed = relevantKeys.some(key => oldSettings[key] !== this.settings[key]);

    if (changed) {
        console.log('Settings updated in content script:', this.settings);
        if (this.overlay) {
            this.overlay.updateVisibility(this.settings.showOverlay);
        }
    }
  }

  createOverlay() {
    if (this.overlay) {
      this.overlay.remove();
    }
    this.overlay = new (window.SpeedOverlay || SpeedOverlay)();
    this.overlay.updateVisibility(this.settings.showOverlay);
  }

  observeVideoElements() {
    const handleNewVideo = (video) => {
      if (!(video instanceof HTMLVideoElement)) return;
      if (this.isSpeedActive) {
        if (!this.originalSpeeds.has(video)) {
          this.originalSpeeds.set(video, video.playbackRate);
        }
        video.playbackRate = this.settings.speedValue;
      }
    };

    // Handle videos already present on initial load
    document.querySelectorAll('video').forEach((v) => handleNewVideo(v));

    // Observe and handle subsequently added videos
    try {
      this.mutationObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach((node) => {
            if (node instanceof HTMLVideoElement) {
              handleNewVideo(node);
            } else if (node && node.querySelectorAll) {
              node.querySelectorAll('video').forEach((v) => handleNewVideo(v));
            }
          });
        }
      });
      this.mutationObserver.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
      });
    } catch (_) { /* ignore */ }
  }

  setupWindowGuards() {
    const safeDeactivate = () => {
      if (this.isSpeedActive) {
        this.deactivateSpeedMode();
        this.isSpeedActive = false;
      }
    };
    window.addEventListener('blur', safeDeactivate, true);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') safeDeactivate();
    }, true);
    window.addEventListener('pagehide', safeDeactivate, true);
  }

  handleKeyDown(event) {
    // Skip when typing in input elements
    if (this.isInInputElement(event.target)) {
      return;
    }

    // Correctly determine the trigger key
    const actualTriggerKey = this.settings.customTriggerKey || this.settings.triggerKey;
    
    if (event.code === actualTriggerKey && !this.isSpeedActive) {
      this.isSpeedActive = true;
      this.activateSpeedMode();
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    // Correctly determine the trigger key
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
    
    // Fine-tune speed with mouse wheel
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.settings.speedValue = Math.max(0.1, Math.min(5.0, this.settings.speedValue + delta));
    this.settings.speedValue = Math.round(this.settings.speedValue * 10) / 10;
    
    // Update playbackRate for all videos
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

// Speed overlay UI
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

// Initialize controller
const speedKeyController = new SpeedKeyController(); 