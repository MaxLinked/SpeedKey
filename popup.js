document.addEventListener('DOMContentLoaded', async function() {
    const speedSlider = document.getElementById('speedSlider');
    const speedDisplay = document.getElementById('speedDisplay');
    const currentSpeedValue = document.getElementById('currentSpeedValue');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const triggerKeySelect = document.getElementById('triggerKeySelect');
    const customKeyContainer = document.getElementById('customKeyContainer');
    const customKeyInput = document.getElementById('customKeyInput');
    const showOverlayCheckbox = document.getElementById('showOverlayCheckbox');
    const settingsBtn = document.getElementById('settingsBtn');

    // Initialize i18n
    // Reuse global i18n if available; otherwise create a local instance
    // Remove runtime i18n switching: rely on Chrome _locales

    // Load settings and populate UI
    async function loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['speedValue', 'triggerKey', 'customTriggerKey', 'showOverlay']);
            
            const speedValue = result.speedValue || 2.0;
            const triggerKey = result.triggerKey || 'ShiftLeft';
            const customTriggerKey = result.customTriggerKey || '';
            const showOverlay = result.showOverlay !== false;

            // Set speed slider and labels
            speedSlider.value = speedValue;
            speedDisplay.textContent = speedValue + '×';
            currentSpeedValue.textContent = speedValue + '×';

            // Set trigger key (correctly handle custom key)
            if (customTriggerKey) {
                triggerKeySelect.value = 'custom';
                customKeyContainer.style.display = 'block';
                customKeyInput.value = formatKeyName(customTriggerKey);
                customKeyInput.dataset.keyCode = customTriggerKey;
            } else {
                triggerKeySelect.value = triggerKey;
                customKeyContainer.style.display = 'none';
                customKeyInput.dataset.keyCode = '';
            }

            // Set overlay visibility switch
            showOverlayCheckbox.checked = showOverlay;

            // Update preset button active state
            updatePresetButtons(speedValue);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    // Persist settings to chrome.storage
    async function saveSettings() {
        try {
            const speedValue = parseFloat(speedSlider.value);
            let triggerKey = triggerKeySelect.value;
            let customTriggerKey = '';

            if (triggerKey === 'custom') {
                customTriggerKey = customKeyInput.dataset.keyCode || '';
                triggerKey = 'ShiftLeft'; // Fallback
            }

            const settings = {
                speedValue: speedValue,
                triggerKey: triggerKey,
                customTriggerKey: customTriggerKey,
                showOverlay: showOverlayCheckbox.checked
            };

            await chrome.storage.sync.set(settings);
            // The onChanged listener will handle propagation. No need to send message.
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Update preset button active state
    function updatePresetButtons(currentSpeed) {
        presetButtons.forEach(btn => {
            const btnSpeed = parseFloat(btn.dataset.speed);
            if (Math.abs(btnSpeed - currentSpeed) < 0.01) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Speed slider events
    speedSlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        speedDisplay.textContent = value + '×';
        currentSpeedValue.textContent = value + '×';
        updatePresetButtons(value);
        saveSettings();
    });

    // Preset button events
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const speed = parseFloat(this.dataset.speed);
            speedSlider.value = speed;
            speedDisplay.textContent = speed + '×';
            currentSpeedValue.textContent = speed + '×';
            updatePresetButtons(speed);
            saveSettings();
        });
    });

    // Trigger key select change event
    triggerKeySelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customKeyContainer.style.display = 'block';
            customKeyInput.focus();
        } else {
            customKeyContainer.style.display = 'none';
            customKeyInput.value = '';
            saveSettings();
        }
    });

    // Custom key input events
    customKeyInput.addEventListener('keydown', function(e) {
        e.preventDefault();
        const key = e.code;
        this.value = formatKeyName(key);
        this.dataset.keyCode = key;
        saveSettings();
    });

    // Overlay visibility toggle event
    showOverlayCheckbox.addEventListener('change', saveSettings);

    // No language selector; Chrome controls extension locale

    // Open options page button
    settingsBtn.addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });

    // Reload UI when settings are changed elsewhere (e.g., options page)
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
            console.log('Popup detected settings change, reloading UI.');
            loadSettings();
        }
    });

    // Initial load
    await loadSettings();
});

function formatKeyName(keyCode) {
    const keyNameMap = {
        'ShiftLeft': 'Left Shift', 'ShiftRight': 'Right Shift',
        'ControlLeft': 'Left Ctrl', 'ControlRight': 'Right Ctrl',
        'AltLeft': 'Left Alt', 'AltRight': 'Right Alt',
        'Space': 'Space', 'Enter': 'Enter', 'Escape': 'Escape',
        'Tab': 'Tab', 'Backspace': 'Backspace',
    };
    if (keyCode.startsWith('Key')) return keyCode.replace('Key', '');
    if (keyCode.startsWith('Digit')) return keyCode.replace('Digit', '');
    if (keyCode.startsWith('F') && keyCode.length <= 3) return keyCode;
    return keyNameMap[keyCode] || keyCode;
} 