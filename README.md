<p align="center">
  <img src="icons/icon_original.png" alt="SpeedKey Logo" width="128">
  <br/>
  <strong>SpeedKey (键速)</strong>
  <br/>
  <a href="README_EN.md">English</a>
  · <strong>Chinese</strong>
  <br/>
  <a href="https://github.com/MaxLinked/SpeedKey/blob/main/LICENSE">MIT</a>
  · v1.0.0
  · Chrome MV3
  <br/>
</p>

## 简介

SpeedKey 是一款用于 HTML5 视频的「按住即倍速、松开即恢复」的浏览器扩展，支持自定义触发按键、滚轮微调、倍速浮层与中英双语界面。

## 功能特性

- 按住加速与松开恢复；支持 Shift/Ctrl/Alt/Space 或自定义任意键
- 滚轮微调倍速（±0.1×），范围 0.5× ~ 5.0×
- 右上角倍速浮层（可开关）
- 设置跨标签页即时同步
- 中英界面，语言偏好持久化

## 安装（本地开发/WSL2/Windows）

1) 克隆代码

```bash
git clone https://github.com/MaxLinked/SpeedKey.git
```

2) Chrome 加载

- 打开 `chrome://extensions/`
- 打开右上角「开发者模式」
- 点击「加载已解压的扩展程序」，选择 `SpeedKey/SpeedKey` 目录

3) WSL2 与 Windows 调试说明

- 方案A：在 Windows 侧克隆仓库，直接按上面步骤加载即可
- 方案B（WSL2）：使用资源管理器访问 `\\wsl$\Ubuntu\home\<你的用户名>\max_projects\SpeedKey\SpeedKey`，选择该目录加载
- 变更代码后，在 `chrome://extensions/` 中点击 SpeedKey 卡片的「刷新」按钮即可热重载

Edge(Chromium) 同理：`edge://extensions/`

## 使用方法

- 在有视频的页面，按住设定的触发键（默认 Left Shift），所有 `<video>` 将以设定倍速播放；松开恢复原速
- 按住触发键滚动滚轮进行 ±0.1× 微调
- 点击扩展图标打开弹窗，可快速调整；进入「选项页」可细致配置

## 快捷键命令（系统级触发）

- 已在 `manifest.json` 中注册命令 `toggle-speed`（默认 Alt+Shift+S）
- 在扩展详情页可自定义浏览器层的快捷键；触发后会在当前活动页切换倍速模式

## 架构说明

- `content.js`：页面脚本，监听键盘/滚轮，控制视频倍速与浮层，观察动态新增视频，失焦保护
- `background.js`：初始化默认设置，接收/保存设置，向所有标签广播 `settingsUpdated`，处理命令
- `popup.*`：弹窗界面，读取/保存设置，应用 i18n
- `options.*`：选项页界面，完整配置、导入导出、重置
- `i18n.js`：简单国际化实现（en-US/zh-CN）

## 已知修复与改进

- 修复消息动作名不一致：统一使用 `settingsUpdated`
- 内容脚本新增 `chrome.storage.onChanged` 监听，跨页实时生效
- 新增 `MutationObserver` 与失焦保护，避免新视频不受控与「卡住」
- 注册浏览器命令 `toggle-speed`（原功能未在清单中暴露）
- 弹窗与选项页 i18n 应用一致化

## 故障排除

- 按键无响应：检查是否在输入框内；确认触发键设置；刷新页面
- 倍速无效：确认页面为 HTML5 `<video>`；某些站点可能拦截播放速率
- 浮层不显示：确认设置已开启；检查是否被页面样式遮挡

## 许可

MIT License

— 让视频观看更高效 ⚡