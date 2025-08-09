;(function (root) {
  const ACTIONS = Object.freeze({
    getSettings: 'getSettings',
    saveSettings: 'saveSettings',
    settingsUpdated: 'settingsUpdated',
    toggleSpeed: 'toggleSpeed'
  });

  const SETTINGS_KEYS = Object.freeze([
    'speedValue',
    'triggerKey',
    'customTriggerKey',
    'showOverlay'
  ]);

  const DEFAULT_SETTINGS = Object.freeze({
    speedValue: 2.0,
    triggerKey: 'ShiftLeft',
    customTriggerKey: '',
    showOverlay: true
  });

  root.SpeedKeyConstants = { ACTIONS, SETTINGS_KEYS, DEFAULT_SETTINGS };
})(typeof self !== 'undefined' ? self : window);


