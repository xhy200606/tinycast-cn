# 中文版维护与云编译

中文维护分支 `cn-localization-v0.11.12` 基于上游 `abue-ammar/tinycast` 的 v0.11.12 源码及已有汉化提交。
本次开始维护时的分支提交为 `0d4645d6fdfbd85b3610033996988a87455afe1a`。
对应上游基线详见 `localization-cn.json`。汉化使用简体中文资源，系统首选语言为简体中文时启用；
英文原文继续保留，应用、文件名、第三方扩展自己的内容和用户输入不做强制翻译。
以下源码检查及上游合并命令在中文维护分支执行；默认分支提供 Homebrew 安装入口。

原分支中部分文件使用了旧接口。本次按固定上游提交恢复搜索、设置、窗口房间、MCP OAuth 等
模块的 v0.11.12 结构，再补回显示层本地化；拼音全拼和首字母作为搜索别名保留。
本地已通过完整回归测试、Debug/Universal Release 编译和 Xcode 本地化导出检查；
原生界面已核对中文显示及中英文命令搜索。每次更新仍需重新执行这些检查。

## 汉化在哪里

- `Tinycast/zh-Hans.lproj/Localizable.strings`：界面文案。
- `Tinycast/zh-Hans.lproj/InfoPlist.strings`：macOS 权限说明。
- `String(localized:)`：包含参数的动态文案及 Foundation 模型的显示文字。
- `.localizedUI`：运行时英文标题的资源查找。不要用它直接查找已经插入参数的英文句子。
- 设置搜索目录的英文标题及 `SettingsRowTitle` 参数是定位标识，保持原文；显示时再本地化。
- `project.yml` 是工程配置来源；生成的工程必须包含两个中文资源和 `Platform/Localization.swift`。

资源键可以暂时保留已经不用的旧条目，方便追踪上游改名。不要翻译 rawValue、JSON 键、命令行、
协议数据、URL、计算器语法或模型提示词。不要手改 `*.generated.swift` 和生成的运行时资源。

## 不编译的检查

```sh
./Scripts/check-localization.sh
node Scripts/check-settings-search.js
git diff --check
```

检查包括重复键、空译文、格式参数、动态标题目录、直接显示的字符串、SwiftUI 字面量、原始字符串、
多行字符串及相关回归用例。源码检查通过签名匹配识别参数文本，不推断 Swift 参数的具体类型。
这不是完整的 Swift 语义分析，不能证明每条动态渲染路径都正确，也不能替代编译和界面检查。

得到编译许可后，使用 `./Scripts/check-localization.sh --extract` 对照 Xcode 导出的真实资源键，
核对 `%@`、`%lld` 等具体类型。之后运行完整回归测试、Debug/Release 编译和原生界面检查。
中文可能需要更宽的控件，重点检查设置页、AI 服务商、工作空间、操作菜单和 VoiceOver 标签。

## 手动 GitHub 云编译

`.github/workflows/release.yml` 沿用上游已有的工作流文件名，方便在默认分支已注册的工作流中选择
汉化分支。该分支的工作流仅有 `workflow_dispatch` 触发器，没有 push、PR 或定时构建。
**只有维护者手动确认后才编译；`confirmed` 默认 false，未勾选时整个构建任务会跳过。**

1. 先完成翻译和静态检查，检查并提交具体改动。
2. 得到用户的明确编译确认。
3. 在 Actions 选择本工作流，选择 `cn-localization-v0.11.12` 分支，核对版本号和架构，勾选确认。
4. 或使用 CLI（同样只在明确确认之后）：

```sh
gh workflow run release.yml --repo xhy200606/tinycast-cn \
  --ref cn-localization-v0.11.12 \
  -f version=0.11.12 -f architecture=universal -f confirmed=true
```

构建使用 macOS 26 / Xcode 26，先做翻译检查、lint、回归测试、Debug 编译及 Xcode 文案导出，
再生成 Release。默认 universal 同时支持 Apple 芯片和 Intel，并检查主程序与 OCR 辅助程序架构。
Artifacts 包含 DMG、ZIP、源码提交记录与 SHA-256；失败时可下载构建日志。
此流程不会发布正式 Release、修改上游 Homebrew 仓库或发送 Discord 公告。

应用名为 `Tinycast.app`，Debug 和 Release 的 bundle ID 均为 `com.tinycast.app`，与上游版共用设置。
配置镜像位于 `~/.config/tinycast/settings.json`。目前没有签名证书，构建使用 ad-hoc 签名，
没有 Apple 公证；Info.plist 的 `TinycastManualUpdatesOnly` 标记关闭应用内升级，后续版本需手动下载。
更新源指向本 fork，避免
把汉化版替换成上游英文包。不要删除上游的签名验证，也不要把临时签名当作可信自动更新证书。
每次重新安装后，macOS 可能要求重新授予辅助功能等权限。
如要长期自动升级，应另行配置稳定签名身份，并验证同一身份的升级链，再启用独立中文发布通道。

## 上游更新后继续汉化

保持上游历史和汉化提交分离。保留当前可用分支，每个新上游版本从当前汉化分支创建新的维护分支，
把新标签合并进来；不要用上游直接覆盖汉化分支。先确认上游标签存在、工作区干净，再运行：

维护时请使用包含真实 Git 历史的完整克隆，不要从 ZIP 或 tarball 初始化的新仓库执行合并。

```sh
./Scripts/prepare-upstream-cn.sh v0.11.13
```

此脚本只准备分支和待提交的合并，保留本 fork 的手动构建工作流，执行不编译的翻译检查，
不会自动提交、推送、编译或发布。有源码或翻译冲突会保留冲突状态并停止，按以下顺序处理：

1. 修复源码冲突，保留上游行为改进，并恢复所需的本地化调用。设置定位标识保持英文原文。
2. 在中文资源中补齐报告的新增或改名文案，核对参数数量、顺序和类型。
3. 更新 `localization-cn.json` 的上游标签及 SHA，并更新工作流默认版本和下载说明。
4. 执行 `xcodegen generate`，检查资源和本地化辅助代码仍在工程里。
5. 再执行静态检查，检查差异并提交合并。得到用户确认后才进行构建及完整测试。
6. 验证编译日志、安装包、中文界面和主程序/OCR 架构，保留旧版本作为回退下载。

上游增加新工作流时，也要检查其触发条件，避免把上游发布、外部通知或自动构建带到中文分支。
旧文案应在确认没有源码使用后再移除，避免把键名改变误当成可以覆盖翻译的依据。

## Homebrew 发布维护

本仓库同时作为自定义 tap，默认分支提供三个安装入口：`tinycast-cn-arm64` 安装 M 芯片包，
`tinycast-cn-universal` 安装供 Intel 和 Apple 芯片使用的 Universal 包，`tinycast-cn` 自动选择架构。
应用均保持正式名称 `Tinycast.app`，配方相互声明冲突，不自动移除 Gatekeeper 隔离标记。

两个架构均构建成功后，下载相同源码提交对应的包，发布到本 fork 的 `cn-v版本号` GitHub Release。
每次使用实际 DMG 重新生成 cask 的校验值，不使用占位值，也不沿用上个版本的哈希：

```sh
node Scripts/generate-homebrew-cask.js --version 0.11.12 \
  --arm64 /path/to/Tinycast-arm64-0.11.12.dmg \
  --universal /path/to/Tinycast-universal-0.11.12.dmg \
  --output Casks/tinycast-cn.rb
for cask in Casks/tinycast-cn*.rb; do ruby -c "$cask"; done
```

生成脚本一次更新三个配方。核对 Release 中两份 DMG 的 SHA-256 与各配方一致，
再将配方提交到默认分支和汉化维护分支。
tap 的默认分支只需同步工作流入口、维护工具和 cask，无需改变其上游源码基线。
