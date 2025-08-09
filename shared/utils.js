;(function (root) {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function roundTo(value, step) {
    const inv = 1 / step;
    return Math.round(value * inv) / inv;
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  root.SpeedKeyUtils = { clamp, roundTo, debounce };
})(typeof self !== 'undefined' ? self : window);



