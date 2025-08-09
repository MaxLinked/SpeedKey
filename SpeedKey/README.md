<p align="center">
  <img src="icons/icon_original.png" alt="SpeedKey Logo" width="128" />
</p>

<h2 align="center">SpeedKey（键速） · Chrome/Edge 视频倍速控制扩展</h2>

<p align="center">
  <strong>中文</strong> · <a href="README_EN.md">English</a>
  <br/>
  Manifest V3 · HTML5 Video · Keyboard Acceleration · WSL2 Friendly
</p>

## 简介

SpeedKey 是一款专业且轻量的浏览器扩展，专为 HTML5 `<video>` 提供“按住即倍速、松开即恢复”的效率体验。支持自定义触发按键、滚轮±0.1×微调、倍速浮层显示与中英文界面，适配 Chrome/Edge（基于 Chromium）。

## 核心特性

- 按住加速：按住触发键立即切换到设定倍速，松开恢复原速
- 滚轮微调：按住时滚轮每次 ±0.1× 微调，范围 0.5×~5.0×
- 自定义按键：支持 Shift/Ctrl/Alt/Space/字母/F 键或完全自定义
- 倍速浮层：右上角显示当前倍速，可在设置中开关
- 设置同步：使用 `chrome.storage.sync` 在标签页之间即时生效
- 多语言：简体中文/英文，设置会被记住
- 兼容性：支持所有标准 HTML5 `<video>`，自动处理动态新增的视频元素

## 安装

### 方式一：加载已解压的扩展（推荐）

1) 克隆或下载本仓库

```bash
git clone https://github.com/MaxLinked/SpeedKey.git
```

2) 打开浏览器扩展管理

- Chrome: 在地址栏输入 `chrome://extensions/`
- Edge: 在地址栏输入 `edge://extensions/`

3) 开启右上角“开发者模式”

4) 点击“加载已解压的扩展程序”，选择目录 `SpeedKey/SpeedKey`

安装完成后，工具栏会出现 SpeedKey 图标。

### 在 Windows + WSL2 环境

你可以直接在 Windows 浏览器中加载 WSL2 的源码目录：

1) 打开 `chrome://extensions/` 并开启“开发者模式”
2) 点击“加载已解压的扩展程序”
3) 在路径选择框中输入：

```
\\wsl$\Ubuntu\home\maxlinked\max_projects\SpeedKey\SpeedKey
```

这样无需复制代码即可在 Windows 端调试 UI；改动后点击扩展卡片上的“刷新”即可热重载。

### 在 WSL2 内启动 Chrome 并远程调试（可选）

适合需要在 Linux 环境复现/自动化时使用（Windows 扩展页不会显示 WSL 内的扩展）：

```bash
google-chrome-stable \
  --user-data-dir=/tmp/speedkey-prof \
  --remote-debugging-address=0.0.0.0 \
  --remote-debugging-port=9222 \
  --load-extension=/home/<user>/max_projects/SpeedKey/SpeedKey
```

然后在 Windows 浏览器打开 `chrome://inspect/#devices`，点击“Configure...”添加 `localhost:9222`，即可在 Remote Target 中 Inspect 到远程页签/Service Worker。

## 使用方法

- 触发键（默认：Left Shift）：
  - 按住：所有 `<video>` 以设定倍速播放
  - 松开：恢复到原始倍速
- 滚轮微调：按住触发键时滚动鼠标，每次 ±0.1×
- 倍速浮层：右上角显示当前倍速，可在设置中开关
- 弹窗与选项页：点击工具栏图标打开，支持语言切换/触发键自定义/倍速预设

## 快捷键命令（浏览器层）

扩展已在 `manifest.json` 注册命令：

- `toggle-speed`（默认：Alt+Shift+S）：切换一次倍速模式（无需按住）。

你可在扩展的“键盘快捷方式”中自定义浏览器层快捷键。

## 权限说明

- `storage`：保存扩展设置（速度、按键、语言、浮层开关等）
- `activeTab`：与当前活动标签页通信（切换倍速、更新 UI）

本扩展不采集任何隐私数据，不访问网络，不注入除功能所需以外的脚本。

## 架构与目录

- `manifest.json`：MV3 清单
- `background.js`：安装默认设置、保存/广播设置、命令处理（Service Worker）
- `content.js`：页面脚本，键盘/滚轮监听、控制 `<video>`、MutationObserver、失焦保护、浮层
- `popup.html/.js/.css`：弹窗 UI，快速调节与入口
- `options.html/.js/.css`：详细设置页（自定义按键、语言、导入导出、重置）
- `i18n.js`：简易国际化实现（`en-US`/`zh-CN`）
- `icons/`：扩展图标

## 开发与调试

- 修改代码后，在扩展管理页点击“刷新”即可重载
- 内容脚本日志在目标页面控制台；后台日志在“Service Worker”检查窗口
- MV3 后台是按需唤醒的 Service Worker，如需调试请先触发一次（打开弹窗/保存设置/发送消息）

## 常见问题（FAQ）

- 看不到中文界面？
  - 在弹窗/选项页选择“中文（简体）”；或在控制台执行 `chrome.storage.sync.set({ currentLanguage: 'zh-CN' })`，然后刷新
- 扩展在 Windows 的扩展页看不到？
  - 你可能在 WSL 的 Chrome 里加载了扩展。Windows 与 WSL 的 Chrome 是两套实例；请在 Windows 端用 `\\wsl$` 路径加载
- 倍速不生效？
  - 确保页面是标准 HTML5 `<video>`；部分站点脚本会强制覆盖 `playbackRate`
- 新增视频不受控？
  - 已内置 `MutationObserver`；若仍失败，刷新页面或反馈站点链接

## 版本与许可

- 版本：v1.0.0（MV3）
- 许可：MIT License

## 贡献

欢迎提交 Issue/PR 以及改进文档。建议规范：小步提交、说明动机与影响、保持最小变更集。

---

让视频观看更高效 ⚡


