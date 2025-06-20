document.addEventListener('DOMContentLoaded', async function() {
    const speedSlider = document.getElementById('speedSlider');
    const speedDisplay = document.getElementById('speedDisplay');
    const currentSpeedValue = document.getElementById('currentSpeedValue');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const triggerKeySelect = document.getElementById('triggerKeySelect');
    const customKeyContainer = document.getElementById('customKeyContainer');
    const customKeyInput = document.getElementById('customKeyInput');
    const showOverlayCheckbox = document.getElementById('showOverlayCheckbox');
    const languageSelect = document.getElementById('languageSelect');
    const settingsBtn = document.getElementById('settingsBtn');

    // 初始化多语言
    const i18n = new I18n();
    await i18n.init();

    // 加载设置
    async function loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['speedValue', 'triggerKey', 'customTriggerKey', 'showOverlay', 'currentLanguage']);
            
            const speedValue = result.speedValue || 2.0;
            const triggerKey = result.triggerKey || 'ShiftLeft';
            const customTriggerKey = result.customTriggerKey || '';
            const showOverlay = result.showOverlay !== false;
            const currentLanguage = result.currentLanguage || 'en-US';

            // 设置速度滑块
            speedSlider.value = speedValue;
            speedDisplay.textContent = speedValue + '×';
            currentSpeedValue.textContent = speedValue + '×';

            // 设置触发键 (Correctly handle custom key)
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

            // 设置覆盖层显示
            showOverlayCheckbox.checked = showOverlay;

            // 设置语言
            languageSelect.value = currentLanguage;
            await i18n.setLanguage(currentLanguage);

            // 更新预设按钮状态
            updatePresetButtons(speedValue);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    // 保存设置
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
                showOverlay: showOverlayCheckbox.checked,
                currentLanguage: languageSelect.value
            };

            await chrome.storage.sync.set(settings);
            // The onChanged listener will handle propagation. No need to send message.
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // 更新预设按钮状态
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

    // 速度滑块事件
    speedSlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        speedDisplay.textContent = value + '×';
        currentSpeedValue.textContent = value + '×';
        updatePresetButtons(value);
        saveSettings();
    });

    // 预设按钮事件
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

    // 触发键选择事件
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

    // 自定义按键输入事件
    customKeyInput.addEventListener('keydown', function(e) {
        e.preventDefault();
        const key = e.code;
        this.value = formatKeyName(key);
        this.dataset.keyCode = key;
        saveSettings();
    });

    // 覆盖层显示切换事件
    showOverlayCheckbox.addEventListener('change', saveSettings);

    // 语言选择事件
    languageSelect.addEventListener('change', async function() {
        await i18n.setLanguage(this.value);
        saveSettings();
    });

    // 设置按钮事件
    settingsBtn.addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });

    // 当设置从其他地方（如options page）更改时，重新加载UI
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
            console.log('Popup detected settings change, reloading UI.');
            loadSettings();
        }
    });

    // 初始化加载设置
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