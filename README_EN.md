<p align="center">
  <img src="icons/icon_original.png" alt="SpeedKey Logo" width="128">
</p>
<h1 align="center">SpeedKey</h1>

<p align="center">
  <a href="README.md">中文</a> | <strong>English</strong>
</p>

<p align="center">
  <a href="https://github.com/MaxLinked/SpeedKey/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>
  <a href="https://github.com/MaxLinked/SpeedKey/releases"><img src="https://img.shields.io/badge/version-v1.0.0-blue.svg" alt="Version"></a>
  <a href="https://chrome.google.com/webstore"><img src="https://img.shields.io/badge/Chrome-Web%20Store-orange.svg" alt="Chrome Web Store"></a>
</p>

SpeedKey is a professional Chrome extension that provides intelligent keyboard-based speed control for HTML5 videos. Enhance your video watching experience with simple keyboard operations for efficient speed playback control.

## ✨ Key Features

- **⌨️ Smart Keyboard Control**:
  - **Hold to Speed Up**: Hold the trigger key to activate speed playback; release to restore normal speed.
  - **Custom Key Binding**: Supports preset keys (Shift, Ctrl, Alt, Space, Z, etc.) or fully custom keys.
  - **Scroll Wheel Fine-tuning**: Precisely adjust speed (±0.1x) with the mouse wheel while holding the trigger key.
- **📺 Wide Video Compatibility**:
  - Supports all HTML5 `<video>` elements.
  - Compatible with major video websites (YouTube, Bilibili, Netflix, etc.).
  - Automatically detects newly added videos on the page.
- **🚀 Smooth User Experience**:
  - **Input Protection**: Automatically ignores shortcuts in text input fields to avoid interference.
  - **Speed Overlay**: Optional top-right corner overlay to display the current speed.
  - **Settings Sync**: All settings are instantly synced across tabs.
- **🌍 Multi-language Support**:
  - Simplified Chinese & English interfaces.
  - Automatically saves language preferences.

## 🚀 Installation Guide

1.  Clone or download this repository to your local machine:
    ```bash
    git clone https://github.com/MaxLinked/SpeedKey.git
    ```
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable "Developer mode" in the top-right corner.
4.  Click "Load unpacked" and select the project folder.
5.  Done! The SpeedKey icon will appear in your browser's toolbar.

## 📖 How to Use

- **Basic Operation**:
  1.  On any page with a video, hold down your configured trigger key (defaults to Left `Shift`).
  2.  The video will play at your set speed.
  3.  Release the key to return to normal speed (1x).
- **Configuration**:
  - Click the extension icon, or go to Extension Details -> Extension options to configure settings.
  - **Basic Settings**: Customize trigger key, playback speed, and quick presets.
  - **Display Settings**: Control the visibility of the speed overlay.
  - **Language Settings**: Switch between Chinese and English interfaces.
- **Advanced Features**:
  - **Real-time Adjustment**: Fine-tune speed by ±0.1x using the mouse wheel while holding the trigger key.
  - **Settings Management**: Reset, export, or import your settings.

## 🔧 Technical Architecture

- **Manifest Version**: Manifest V3
- **Core Scripts**:
  - `content.js`: Injected into pages to handle video detection, keyboard listening, and speed control.
  - `background.js`: Manages extension state and settings synchronization.
  - `options.js` / `popup.js`: Powers the user settings interfaces.
- **Internationalization (`i18n.js`)**: Provides support for Chinese and English.

## 🤝 Contributing

We welcome all forms of contributions! Feel free to open an issue, submit a pull request, or improve the documentation.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the [MIT](https://github.com/MaxLinked/SpeedKey/blob/main/LICENSE) License.

## 🙏 Acknowledgments

Thanks to all developers and users who contribute code, suggestions, and feedback to this project!

---

**Make video watching more efficient with SpeedKey!** ⚡ 