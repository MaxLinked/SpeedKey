# SpeedKey - Professional Video Speed Control Extension

[中文](README.md) | **English**

## 🚀 Overview

SpeedKey is a professional Chrome extension designed to enhance your video watching experience by providing intuitive keyboard-based speed control for HTML5 videos on any webpage.

## ✨ Key Features

### 🎯 **Smart Key Control**
- **Instant Speed Boost**: Hold your trigger key to activate speed playback, release to restore normal speed
- **Custom Key Binding**: Choose from preset keys (Shift, Ctrl, Alt, Space, Z) or set any custom key
- **Real-time Adjustment**: Fine-tune speed with mouse wheel while holding the trigger key (±0.1x increments)

### 🛡️ **Intelligent User Experience**
- **Input Protection**: Automatically ignores key presses in text fields and input areas
- **Focus Protection**: Auto-restores normal speed when switching tabs or windows
- **Universal Compatibility**: Works on all websites with HTML5 video elements

### 🎨 **Modern Interface Design**
- **Speed Overlay**: Real-time speed indicator in the top-right corner of videos
- **Responsive Design**: Beautiful interface that adapts to different screen sizes
- **Dark Mode Support**: Seamless integration with system themes
- **Multi-language Support**: Available in Chinese (Simplified) and English

### ⚙️ **Powerful Configuration**
- **Flexible Speed Range**: Adjustable from 0.5x to 5.0x speed
- **Quick Presets**: One-click access to common speeds (1.25x, 1.5x, 2.0x, 2.5x, 3.0x)
- **Settings Import/Export**: Backup and restore your personalized settings
- **Dynamic Detection**: Automatically detects newly loaded video elements

## 🔧 Installation

1. **Download**: Clone or download this repository to your local machine
2. **Chrome Extensions**: Open Chrome and navigate to `chrome://extensions/`
3. **Developer Mode**: Enable "Developer mode" in the top-right corner
4. **Load Extension**: Click "Load unpacked" and select the SpeedKey folder
5. **Ready to Use**: The extension is now active on all webpages with videos!

## 🎮 How to Use

### Basic Operation
1. **Navigate** to any webpage containing videos (YouTube, Netflix, local videos, etc.)
2. **Hold** your configured trigger key (default: Left Shift)
3. **Watch** as all videos speed up to your preset rate
4. **Release** the key to return to normal playback speed

### Advanced Features
- **Speed Adjustment**: While holding the trigger key, scroll with your mouse wheel to fine-tune speed
- **Custom Keys**: Go to extension options to set your preferred trigger key
- **Speed Presets**: Quickly switch between different speed settings
- **Visual Feedback**: Speed overlay shows current playback rate

## ⚙️ Configuration Options

Access the options page by:
1. Right-clicking the extension icon
2. Selecting "Options" from the context menu

### Available Settings:
- **Trigger Key**: Choose from preset keys or set a custom key
- **Playback Speed**: Set your preferred speed (0.5x - 5.0x)
- **Speed Overlay**: Toggle the visual speed indicator
- **Language**: Switch between Chinese and English interface

## 🔧 Technical Details

### Browser Compatibility
- **Chrome**: Version 88+ (full support)
- **Edge**: Version 88+ (Chromium-based)
- **Other Chromium browsers**: Generally supported

### Video Compatibility
- ✅ HTML5 `<video>` elements
- ✅ YouTube, Netflix, Twitch, Bilibili
- ✅ Local video files
- ✅ Embedded videos and iframes
- ✅ Dynamically loaded content

### Performance
- **Lightweight**: Minimal memory footprint
- **Efficient**: No background processing when not in use
- **Fast**: Instant response to key presses
- **Stable**: Robust error handling and edge case management

## 🛠️ Development

### Project Structure
```
SpeedKey/
├── manifest.json          # Extension manifest
├── content.js            # Main functionality script
├── content.css           # Visual styling
├── background.js         # Background service worker
├── options.html          # Settings page
├── options.css           # Settings page styling
├── options.js            # Settings page logic
├── i18n.js              # Internationalization support
├── popup.html            # Extension popup
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
└── icons/                # Extension icons
```

### Building from Source
1. Clone the repository: `git clone https://github.com/[your-username]/SpeedKey.git`
2. Navigate to the project folder
3. Load as unpacked extension in Chrome

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs by opening an issue
- Suggest new features
- Submit pull requests
- Improve documentation
- Add translations for other languages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who help improve SpeedKey
- Inspired by the need for better video speed control on the web
- Built with modern web technologies and Chrome Extension APIs

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/[your-username]/SpeedKey/issues) page
2. Create a new issue with detailed information
3. We'll respond as quickly as possible

---

**Make video watching more efficient with SpeedKey!** ⚡ 