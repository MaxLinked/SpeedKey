;(function (root) {
  const { SETTINGS_KEYS, DEFAULT_SETTINGS } = root.SpeedKeyConstants || {};

  function validateSettings(partial) {
    const out = {};
    for (const key of SETTINGS_KEYS) {
      if (Object.prototype.hasOwnProperty.call(partial, key)) {
        out[key] = partial[key];
      }
    }
    return out;
  }

  async function getSettings() {
    try {
      const result = await chrome.storage.sync.get(SETTINGS_KEYS);
      return { ...DEFAULT_SETTINGS, ...result };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  async function setSettings(partial) {
    const safe = validateSettings(partial || {});
    await chrome.storage.sync.set(safe);
    return safe;
  }

  function onSettingsChanged(callback) {
    try {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        const updated = {};
        for (const key of SETTINGS_KEYS) {
          if (changes[key]) updated[key] = changes[key].newValue;
        }
        if (Object.keys(updated).length) callback(updated);
      });
    } catch (_) {}
  }

  root.SpeedKeySettings = { getSettings, setSettings, onSettingsChanged };
})(typeof self !== 'undefined' ? self : window);



