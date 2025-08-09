;(function (root) {
  class SpeedOverlay {
    constructor() {
      this.element = null;
      this.create();
    }

    create() {
      this.element = document.createElement('div');
      this.element.id = 'speedkey-overlay';
      this.element.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,.8); color: #fff;
        padding: 8px 16px; border-radius: 20px; font: 600 14px/1 Arial, sans-serif; z-index: 10000;
        display: none; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.2);
      `;
      document.body.appendChild(this.element);
    }

    show(speed) {
      if (!this.element) return;
      this.element.textContent = `${speed}×`;
      this.element.style.display = 'block';
    }

    hide() {
      if (!this.element) return;
      this.element.style.display = 'none';
    }

    updateVisibility(visible) {
      if (!this.element) return;
      this.element.style.display = visible ? (this.element.textContent ? 'block' : 'none') : 'none';
    }

    remove() {
      if (this.element && this.element.parentNode) this.element.parentNode.removeChild(this.element);
    }
  }

  root.SpeedOverlay = SpeedOverlay;
})(typeof self !== 'undefined' ? self : window);



