# Tinycast · 简体中文版

[English](README.md) · **简体中文**

**一个小巧、完全原生的 macOS 启动器。只需一个快捷键，就能调用日常所需功能，内存占用低于 100 MB。**

<p align="center">
  <a href="https://github.com/xhy200606/tinycast-cn/releases/latest">
    <img alt="最新发行版"
         src="https://img.shields.io/github/v/release/xhy200606/tinycast-cn?style=flat&label=release&color=1F6FEB"></a>
  <img alt="Swift 6.0"
       src="https://img.shields.io/badge/Swift-6.0-F05138?style=flat&logo=swift&logoColor=white">
  <img alt="macOS 26 或更高版本"
       src="https://img.shields.io/badge/macOS-26%2B-000000?style=flat&logo=apple&logoColor=white">
  <a href="LICENSE">
    <img alt="许可证：AGPL-3.0"
         src="https://img.shields.io/badge/License-AGPL--3.0-3DA639?style=flat"></a>
  <a href="https://discord.gg/v2Eeb4QQy3">
    <img alt="加入上游 Tinycast 的 Discord 社区"
         src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat&logo=discord&logoColor=white"></a>
  <a href="https://tinycast.dev/support">
    <img alt="支持上游 Tinycast 开发者"
         src="https://img.shields.io/badge/Support-Tip%20the%20dev-EA4AAA?style=flat&logo=polar&logoColor=white"></a>
</p>

使用 SwiftUI 和 AppKit，**没有第三方依赖**，不使用 Electron，也不收集遥测数据。
它还能**运行真正的 Raycast 扩展**，并以原生 SwiftUI 呈现。项目免费、开源，并将继续保持如此。

中文翻译或安装包问题请提交到[本仓库的 Issues](https://github.com/xhy200606/tinycast-cn/issues)。
上游作者的私人联系邮箱为 [iabueammar@gmail.com](mailto:iabueammar@gmail.com)。

<p align="center">
  <img src="docs/screenshot.png" alt="Tinycast 命令面板" width="720">
</p>

## 支持项目

Tinycast **免费且开源**。以下捐助链接用于支持原项目的上游开发者。
如果 Tinycast 已成为你的日常工具，可以通过一次性捐助支持其开发工作：

<p align="center">
  <a href="https://tinycast.dev/support">
    <img alt="支持 Tinycast" width="188" height="44" src="docs/support-button.svg"></a><br>
  <sub>支付由 <a href="https://polar.sh">Polar.sh</a> 安全处理。</sub>
</p>

## 功能

- **应用启动器**：模糊搜索并启动应用、固定常用应用、查看运行状态，以及退出单个或全部应用。
- **全局快捷键**：随时按下一个快捷键，唤出命令面板。
- **应用专属快捷键**：为应用绑定快捷键，按下即可在聚焦和隐藏之间切换。
- **文件搜索**：通过 Spotlight 搜索并打开所选目录中的文件和文件夹，不额外建立自己的索引。
- **词典**：通过“定义单词”命令，或启动器中的后备操作查询输入内容，使用 Mac 自带词典。
- **剪贴板历史**：保存文字和图片，支持搜索，并粘贴回之前使用的应用。
- **计算器**：直接在命令面板内计算，完成单位、实时货币和加密货币换算。
- **快捷链接**：将网址、搜索、文件或深度链接变成命令，支持输入内容、剪贴板和日期占位符。
- **Apple 快捷指令**：搜索并运行你在“快捷指令”应用中创建的指令，支持别名和全局快捷键。
- **文本片段**：复用 Markdown 模板，支持动态占位符、参数、嵌套引用，以及可选的关键词展开。
- **自定义命令**：通过模糊搜索或专属全局快捷键运行已命名的 Shell 命令。
- **窗口管理**：提供 34 项类似 Rectangle 的操作，包括二分、四分、三分布局、尺寸调整、微移、
  跨显示器移动、全屏和桌面空间操作。
- **工作空间**：保存并切换适用于不同任务的窗口布局。
- **系统操作**：锁屏、睡眠、重启、清空废纸篓，以及切换外观、蓝牙、静音、隐藏文件等。
- **日历与会议**：在空白命令面板和菜单栏显示下一场会议，按键加入，也可启用自动加入。
- **笔记**：在一个悬浮编辑器中管理不限数量的纯 Markdown 文件，从命令面板搜索，边写边渲染。
- **表情选择器**：可搜索的表情网格，按下快捷键即可打开。
- **AI 对话**：使用自己的 API 密钥或已安装的 AI 账号，在命令面板中快速提问，或在 AI 对话窗口中
  进行长对话，历史记录支持搜索和固定。与其他 AI 功能一样，默认关闭。
- **快速操作**：在任意应用中，对选中文字进行语法修正、改写、翻译或摘要。
- **Raycast 扩展**：原生运行已有扩展，并使用 SwiftUI 渲染界面。
- **备份与导入**：将设置导出为文件，或从 Raycast 导入配置。

## 安装

要求 **macOS 26 或更高版本**。Intel Mac 必须支持 macOS 26。
使用本仓库作为 Homebrew tap。Homebrew 7 要求显式信任第三方 tap：

```sh
brew tap xhy200606/tinycast-cn https://github.com/xhy200606/tinycast-cn.git
brew trust --tap xhy200606/tinycast-cn
```

按处理器选择明确的安装命令：

| 你的 Mac | Homebrew 安装命令 |
| --- | --- |
| Apple 芯片（M 系列），arm64 | `brew install --cask xhy200606/tinycast-cn/tinycast-cn-arm64` |
| Intel，使用 Universal 包 | `brew install --cask xhy200606/tinycast-cn/tinycast-cn-universal` |

Universal 包包含 x86_64 和 arm64，也能在 Apple 芯片上运行。
如果希望自动选择架构，可使用 `brew install --cask xhy200606/tinycast-cn/tinycast-cn`。
这些配方安装同一个 `Tinycast.app`，选择其中一种即可。切换版本时，先卸载当前配方，
不使用 `--zap`，再安装所需配方。

也可以从[本仓库发行页](https://github.com/xhy200606/tinycast-cn/releases)
下载 DMG 手动安装：

| 你的 Mac | 安装包 |
| --- | --- |
| Apple 芯片（M 系列） | [arm64 DMG](https://github.com/xhy200606/tinycast-cn/releases/download/cn-v0.11.12/Tinycast-arm64-0.11.12.dmg) |
| Intel，或需要包含两种架构的安装包 | [Universal DMG](https://github.com/xhy200606/tinycast-cn/releases/download/cn-v0.11.12/Tinycast-universal-0.11.12.dmg) |

打开 DMG，将 **Tinycast.app** 拖到“**应用程序**”。两种安装包的应用名均为 `Tinycast.app`，
bundle ID 均为 `com.tinycast.app`，与上游稳定版共用设置。
发行页还提供 ZIP 安装包和 `SHA256SUMS.txt` 校验文件。

要启用中文，请将系统首选语言设为简体中文，或在“**系统设置 → 通用 → 语言与地区 → 应用程序**”
中为 Tinycast 指定简体中文。

安装包采用 **ad-hoc 签名，未经 Apple 公证**。配方不会自动移除隔离标记。
若 macOS 阻止首次启动，请核对下载来源和校验值，再到“**系统设置 → 隐私与安全性**”中允许打开。
需要时可手动移除隔离标记：

```sh
xattr -dr com.apple.quarantine "/Applications/Tinycast.app"
```

### 更新

本中文版已关闭应用内自动升级。通过 Homebrew 更新：

```sh
brew update
```

| 已安装的版本 | 更新命令 |
| --- | --- |
| ARM64 | `brew upgrade --cask tinycast-cn-arm64` |
| Universal / Intel | `brew upgrade --cask tinycast-cn-universal` |
| 自动选择架构 | `brew upgrade --cask tinycast-cn` |

也可以从本仓库发行页下载新的 DMG 安装。每个发行版保留两种架构的安装包及校验值；
Homebrew 使用本仓库默认分支中的配方。

## 权限

**辅助功能**：Tinycast 向其他应用粘贴或展开文字时需要此权限，也是文本片段关键词展开所需的唯一权限。
首次使用相关功能时会提示授权，请到“**系统设置 → 隐私与安全性 → 辅助功能**”中允许。
文本片段默认关闭；按键仅在本地匹配，不保存，也不会发送到任何地方。

## 使用方法

1. 打开“**设置 → 通用**”，录制一个用于唤出 Tinycast 的全局快捷键。
2. 在任何地方按下该快捷键，命令面板便会浮现。输入内容筛选，按 **↵** 启动。
3. **Tab** 在应用和剪贴板之间切换；**↑/↓** 移动选择，**Esc** 关闭面板。
4. 在“**设置 → 快捷键**”中搜索应用或自定义命令，为其录制全局快捷键。
5. 在“**设置 → 文本片段**”中启用该功能，再创建带有展开关键词的模板。

## 从源码构建

克隆中文维护分支，以构建汉化应用：

```sh
git clone --branch cn-localization-v0.11.12 https://github.com/xhy200606/tinycast-cn.git
cd tinycast-cn
```

工具链要求为 **Xcode 26+、Swift 6 和 XcodeGen**。
本地构建见 **[docs/development.md](docs/development.md)**；
中文版打包和上游合并见 **[docs/localization-cn.md](docs/localization-cn.md)**。
**[docs/](docs/README.md)** 提供其他文档索引，涵盖架构、工程规范、设计系统和各项功能。

### 云编译与上游更新

云编译必须手动触发：在 GitHub Actions 中选择中文分支、版本号，以及 `arm64` 或 `universal` 架构，
再显式勾选确认选项。推送和 PR 不会触发编译。
工作流依次执行 lint、汉化检查、全部 86 项回归测试、Debug 编译、Xcode 本地化文案导出和 Release 编译，
再核对中文资源、主程序及 OCR 辅助程序的架构，最后打包。

上游发布新版本后，从当前中文版创建新的维护分支，合并上游标签。
保留中文资源和搜索别名，补译新增文案，审阅合并结果，再手动确认编译。
根据实际 DMG 的校验值生成新配方，并发布到 `main`。
[维护指南](docs/localization-cn.md) 和 `Scripts/prepare-upstream-cn.sh` 说明了具体流程。

## 参与贡献

> [!IMPORTANT]
> 翻译和打包改动，请先在本仓库提交 Issue。
> 如果改动准备贡献给上游，**请先在上游提交 Issue，再编写代码**，并遵循其审批流程。
> 上游代码 PR 需要关联标记为 `approved` 的 Issue；仅修改文档是例外。
>
> Tinycast 的功能范围有意保持克制，“其他启动器也有”本身并不是增加功能的理由。
> 提出功能请求前，请先确认项目是否需要该功能。

请先阅读 **[CONTRIBUTING.md](CONTRIBUTING.md)**，其中说明了每个 PR 的内存预算、
视觉改动需要提供的前后对比视频，以及功能请求被拒绝的原因。
每个 PR 都需填写 **[PR 模板](.github/PULL_REQUEST_TEMPLATE.md)**。
安全问题请遵循 [SECURITY.md](SECURITY.md)，不要提交到公开 Issue。

中文版相关问题请提交到[本仓库的 Issues](https://github.com/xhy200606/tinycast-cn/issues)。
上游社区交流请[加入 Discord](https://discord.gg/v2Eeb4QQy3)。

## 上游 Star 历史

<a href="https://www.star-history.com/?repos=abue-ammar%2Ftinycast&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=abue-ammar/tinycast&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=abue-ammar/tinycast&type=date&legend=top-left" />
   <img alt="上游 Star 历史图表" src="https://api.star-history.com/chart?repos=abue-ammar/tinycast&type=date&legend=top-left" />
 </picture>
</a>

## 许可证

[AGPL-3.0](LICENSE)
