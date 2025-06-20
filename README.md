<p align="center">
  <img src="icons/icon_original.png" alt="SpeedKey Logo" width="128">
</p>
<h1 align="center">SpeedKey (键速)</h1>

<p align="center">
  <strong>中文</strong> | <a href="README_EN.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/MaxLinked/SpeedKey/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>
  <a href="https://github.com/MaxLinked/SpeedKey/releases"><img src="https://img.shields.io/badge/version-v1.0.0-blue.svg" alt="Version"></a>
  <a href="https://chrome.google.com/webstore"><img src="https://img.shields.io/badge/Chrome-Web%20Store-orange.svg" alt="Chrome Web Store"></a>
</p>

SpeedKey (键速) 是一款专业的 Chrome 浏览器扩展，为 HTML5 视频提供智能键盘倍速控制功能。通过简单的按键操作即可实现视频倍速播放，让您的视频观看体验更加高效。

## ✨ 主要功能

- **⌨️ 智能键盘控制**:
  - **按住加速**: 按住触发键激活倍速播放，松开恢复正常速度。
  - **自定义按键**: 支持预设按键（Shift, Ctrl, Alt, Space, Z 等）或完全自定义。
  - **滚轮微调**: 按住触发键时使用鼠标滚轮精细调节倍速 (±0.1x)。
- **📺 广泛的视频兼容性**:
  - 支持所有 HTML5 `<video>` 元素。
  - 兼容主流视频网站（YouTube, Bilibili, Netflix 等）。
  - 自动检测页面中的新增视频。
- **🚀 流畅的用户体验**:
  - **输入保护**: 在文本输入框中自动忽略快捷键，避免干扰。
  - **倍速浮层**: 可选的右上角倍速浮层，实时显示当前倍速。
  - **设置同步**: 所有设置在不同标签页间即时同步。
- **🌍 多语言支持**:
  - 简体中文 & 英文界面。
  - 自动保存语言偏好。

## 🚀 安装指南

1.  下载或克隆此项目到本地：
    ```bash
    git clone https://github.com/MaxLinked/SpeedKey.git
    ```
2.  打开 Chrome 浏览器，访问 `chrome://extensions/`。
3.  开启右上角的"开发者模式"。
4.  点击"加载已解压的扩展程序"，选择项目文件夹。
5.  安装完成！SpeedKey 图标将出现在浏览器工具栏。

## 📖 使用方法

- **基础操作**:
  1.  在任何有视频的网页上，按住您设定的触发键（默认为左 `Shift` 键）。
  2.  视频将以您设定的倍速播放。
  3.  松开按键，视频恢复正常速度 (1x)。
- **设置配置**:
  - 点击扩展图标，或在扩展管理页面点击"详细信息" -> "扩展程序选项"进行配置。
  - **基础设置**: 自定义触发按键、播放倍速及快速预设。
  - **显示设置**: 控制倍速浮层的显示。
  - **语言设置**: 在中英文界面间切换。
- **高级功能**:
  - **实时微调**: 按住触发键时滚动鼠标滚轮可 ±0.1x 微调倍速。
  - **设置管理**: 支持设置的重置、导出和导入。

## 🔧 技术架构

- **清单版本**: Manifest V3
- **核心脚本**:
  - `content.js`: 注入页面，实现视频检测、键盘监听和速度控制。
  - `background.js`: 管理扩展状态和设置同步。
  - `options.js` / `popup.js`: 处理用户设置界面逻辑。
- **国际化 (`i18n.js`)**: 提供中英文语言支持。

## 🤝 参与贡献

我们欢迎各种形式的贡献！无论是提交 Issue、发起 Pull Request 还是改进文档。

1.  Fork 本项目。
2.  创建您的功能分支 (`git checkout -b feature/AmazingFeature`)。
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4.  推送到分支 (`git push origin feature/AmazingFeature`)。
5.  打开一个 Pull Request。

## 📄 开源协议

本项目基于 [MIT](https://github.com/MaxLinked/SpeedKey/blob/main/LICENSE) 协议开源。

## 🙏 致谢

感谢所有为本项目贡献代码、建议和反馈的开发者和用户！

---

**让视频观看更高效！** ⚡ 