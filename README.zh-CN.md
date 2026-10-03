# Tinycast 简体中文版

Tinycast 是原生 macOS 菜单栏启动器，提供应用搜索、快捷键、剪贴板、计算器、窗口管理、工作空间、
笔记、文本片段、日历、AI 对话和 Raycast 扩展。本分支在上游 v0.11.12 基础上补齐简体中文界面，
保留英文原文及后续合并上游的能力。

要求 **macOS 26 或更高版本**。默认云构建为 Universal，同时包含 Apple 芯片和 Intel 架构；
Intel 设备须支持 macOS 26。将系统首选语言设为简体中文，或在 macOS 的应用语言设置中指定简体中文。

云编译完成后，在对应 GitHub Actions 运行的 **Artifacts** 下载 `Tinycast-CN-...`，解压并打开 DMG，
将 `Tinycast CN.app` 拖到“应用程序”。构建前必须手动确认；当前准备完成并不表示已有可下载的安装包。
该应用使用独立 bundle ID，已有上游 Tinycast 的设置不会自动导入。

安装包采用 ad-hoc 签名，未经过 Apple 公证。下载后如系统阻止打开，核对来源及 `SHA256SUMS.txt` 后执行：

```sh
xattr -dr com.apple.quarantine "/Applications/Tinycast CN.app"
```

需要时在“系统设置 → 隐私与安全性”中授予辅助功能、日历、摄像头等权限。升级暂时通过手动下载新版完成。

[汉化检查、手动云编译及后续上游同步说明](docs/localization-cn.md) · [上游说明](README.md) · [AGPL-3.0 许可证](LICENSE)
