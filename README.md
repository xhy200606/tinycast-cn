# Tinycast-cn

**English** · [简体中文](README.zh-CN.md)

**A tiny, fully native macOS launcher. One hotkey, everything you reach for all day, under 100 MB of
RAM.**

<p align="center">
  <a href="https://github.com/xhy200606/tinycast-cn/releases/latest">
    <img alt="Latest release"
         src="https://img.shields.io/github/v/release/xhy200606/tinycast-cn?style=flat&label=release&color=1F6FEB"></a>
  <img alt="Swift 6.0"
       src="https://img.shields.io/badge/Swift-6.0-F05138?style=flat&logo=swift&logoColor=white">
  <img alt="macOS 26 or later"
       src="https://img.shields.io/badge/macOS-26%2B-000000?style=flat&logo=apple&logoColor=white">
  <a href="LICENSE">
    <img alt="License: AGPL-3.0"
         src="https://img.shields.io/badge/License-AGPL--3.0-3DA639?style=flat"></a>
  <a href="https://discord.gg/v2Eeb4QQy3">
    <img alt="Join the upstream Tinycast Discord"
         src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat&logo=discord&logoColor=white"></a>
  <a href="https://tinycast.dev/support">
    <img alt="Support the upstream Tinycast developer"
         src="https://img.shields.io/badge/Support-Tip%20the%20dev-EA4AAA?style=flat&logo=polar&logoColor=white"></a>
</p>

SwiftUI and AppKit, **zero third-party dependencies**, no Electron and no telemetry. It also **runs
real Raycast extensions**, rendered as native SwiftUI. Free, open source, and staying that way.

Report Chinese translation or packaging issues in [this repository](https://github.com/xhy200606/tinycast-cn/issues).
The upstream author's private contact is [iabueammar@gmail.com](mailto:iabueammar@gmail.com).

<p align="center">
  <img src="docs/screenshot.png" alt="Tinycast command palette" width="720">
</p>

## Support

Tinycast is **free and open source**. The following donation link supports the original upstream
developer. If Tinycast earns a place in your daily flow, a one-off tip helps support their work:

<p align="center">
  <a href="https://tinycast.dev/support">
    <img alt="Support Tinycast" width="188" height="44" src="docs/support-button.svg"></a><br>
  <sub>Payments are handled securely by <a href="https://polar.sh">Polar.sh</a>.</sub>
</p>

## Features

- **App launcher** — fuzzy-search and launch anything, pin favorites, see what's running, quit an app
  or every app at once.
- **Global hotkey** — one shortcut summons the palette from anywhere.
- **Per-app hotkeys** — bind a key to an app; press it to toggle (focus/hide).
- **Search Files** — open files and folders from the folders you choose, through Spotlight, with no
  index of our own.
- **Dictionary** — look a word up with the Define Word command, or define whatever you typed from the
  launcher's fallbacks, read from the Mac's own dictionaries.
- **Clipboard history** — text and images, searchable, pasted back into the app you were using.
- **Calculator** — do math, unit, live currency and crypto conversions inline, right in the palette.
- **Quicklinks** — turn a URL, search, file or deeplink into a command, with placeholders for typed
  input, the clipboard or the date.
- **Apple Shortcuts** — search and run the shortcuts you built in the Shortcuts app, with aliases and
  global hotkeys.
- **Snippets** — reusable Markdown templates with dynamic placeholders, arguments, nested references
  and optional keyword expansion.
- **Custom commands** — run named shell commands through fuzzy search or their own global hotkeys.
- **Window management** — 34 Rectangle-style actions: halves, quarters, thirds, sizing, nudging,
  display moves, fullscreen and Spaces.
- **Workspaces** — save and switch window arrangements for different tasks.
- **System actions** — lock, sleep, restart, empty trash, toggle appearance, Bluetooth, mute, hidden
  files, and more.
- **Calendar and meetings** — your next meeting on the empty palette and in the menu bar, one key to
  join it, or let it join itself.
- **Notes** — an unlimited collection of plain Markdown files in one floating editor, searchable from
  the palette and rendered as you write.
- **Emoji picker** — a searchable emoji grid, one keystroke away.
- **AI chat** — use your own key or an installed AI account: ask Quick AI from the palette, or keep
  longer conversations in the AI Chat window, with a searchable, pinnable history. Off out of the box,
  like every AI feature.
- **Quick Actions** — fix grammar, rewrite, translate or summarize the selected text in any app.
- **Raycast extensions** — run the ones you already have natively, rendered as SwiftUI.
- **Backup and import** — export your settings to a file, or import your setup from Raycast.

## Install

Requires **macOS 26 or later**. Intel Macs must support macOS 26.
Use this repository as the Homebrew tap. Homebrew 7 requires explicit trust for third-party taps:

```sh
brew tap xhy200606/tinycast-cn https://github.com/xhy200606/tinycast-cn.git
brew trust --tap xhy200606/tinycast-cn
```

Choose the explicit package for your processor:

| Your Mac | Homebrew installation |
| --- | --- |
| Apple silicon (M series), arm64 | `brew install --cask xhy200606/tinycast-cn/tinycast-cn-arm64` |
| Intel, using the Universal package | `brew install --cask xhy200606/tinycast-cn/tinycast-cn-universal` |

Universal contains both x86_64 and arm64, so it also runs on Apple silicon. For automatic selection,
use `brew install --cask xhy200606/tinycast-cn/tinycast-cn`.
These casks install the same `Tinycast.app`; install one of them. To switch, uninstall the current
cask without `--zap`, then install the desired one.

For manual installation, download a DMG
from [this repository's releases](https://github.com/xhy200606/tinycast-cn/releases):

| Your Mac | Package |
| --- | --- |
| Apple silicon (M series) | [arm64 DMG](https://github.com/xhy200606/tinycast-cn/releases/download/cn-v0.11.12/Tinycast-arm64-0.11.12.dmg) |
| Intel, or a package containing both architectures | [Universal DMG](https://github.com/xhy200606/tinycast-cn/releases/download/cn-v0.11.12/Tinycast-universal-0.11.12.dmg) |

Open the DMG and drag **Tinycast.app** into **Applications**. Both packages use the app name
`Tinycast.app` and bundle ID `com.tinycast.app`, sharing settings with the upstream stable app.
ZIP packages and `SHA256SUMS.txt` are also available on the release page.

To enable Chinese, set Simplified Chinese as your preferred system language, or choose it for
Tinycast in **System Settings → General → Language & Region → Applications**.

These packages use **ad-hoc signing and are not notarized by Apple**. The cask does not automatically
remove the quarantine flag. If macOS blocks the first launch, verify the download and checksum,
then allow it in **System Settings → Privacy & Security**. If needed, remove the flag manually:

```sh
xattr -dr com.apple.quarantine "/Applications/Tinycast.app"
```

### Updates

In-app automatic updates are disabled for this Chinese build. Update through Homebrew:

```sh
brew update
```

| Installed package | Upgrade |
| --- | --- |
| ARM64 | `brew upgrade --cask tinycast-cn-arm64` |
| Universal / Intel | `brew upgrade --cask tinycast-cn-universal` |
| Automatic selection | `brew upgrade --cask tinycast-cn` |

You can also install a newer DMG from this repository's releases. Each release keeps both
architectures and their checksums; Homebrew uses the cask on this repository's default branch.

## Permissions

**Accessibility** — needed when Tinycast pastes or expands text into another app, and the only
permission snippet keyword expansion needs. You're prompted when you first use a feature that needs
it; grant access in **System Settings → Privacy & Security → Accessibility**. Snippets ship
disabled, and keystrokes are matched locally, never stored and never sent anywhere.

## Using it

1. Open **Settings → General** and record a global shortcut to summon Tinycast.
2. Press it anywhere → the palette floats in. Type to filter, **↵** to launch.
3. **Tab** switches between Apps and Clipboard; **↑/↓** move, **Esc** dismisses.
4. **Settings → Shortcuts** — search an app or custom command and record a global shortcut.
5. **Settings → Snippets** — enable the feature, then create templates with expansion keywords.

## Building from source

Clone the Chinese maintenance branch to build the localized app:

```sh
git clone --branch cn-localization-v0.11.12 https://github.com/xhy200606/tinycast-cn.git
cd tinycast-cn
```

The toolchain is **Xcode 26+, Swift 6 and XcodeGen**. See
**[docs/development.md](docs/development.md)** for local builds and
**[docs/localization-cn.md](docs/localization-cn.md)** for Chinese release packaging and upstream merges.
**[docs/](docs/README.md)** indexes everything else — architecture, engineering
standards, the design system and one document per feature.

### Cloud builds and upstream updates

Cloud builds are manual: select the Chinese branch, version and `arm64` or `universal` architecture
in GitHub Actions, then explicitly check the confirmation input. Pushes and PRs do not start builds.
The workflow runs lint, localization checks, all 86 regression harnesses, Debug compilation,
Xcode localization extraction and Release compilation, then verifies Chinese resources,
the main executable and the OCR helper before packaging.

For a new upstream version, create a new Chinese maintenance branch and merge the upstream tag.
Keep the Chinese resources and search aliases, translate new strings, review the merge, then confirm
the build manually. Generate the updated cask from the actual DMG checksums and publish it on `main`.
The [maintenance guide](docs/localization-cn.md) and `Scripts/prepare-upstream-cn.sh` describe this process.

## Contributing

> [!IMPORTANT]
> For translation and packaging changes, open an issue in this fork first.
> For contributions intended for upstream, **open an upstream issue before writing code** and follow
> its approval process. Upstream requires an `approved` issue for code PRs; documentation-only fixes
> are the exception.
>
> Tinycast's feature set is deliberately closed, and "another launcher has it" is not a reason on its
> own. Ask whether a feature is wanted before you ask for it.

Read **[CONTRIBUTING.md](CONTRIBUTING.md)** first — it covers the memory budget every PR is held to,
the before/after video requirement for visual changes, and why features get declined. Every PR fills
in the **[pull request template](.github/PULL_REQUEST_TEMPLATE.md)**. Security issues go through
[SECURITY.md](SECURITY.md), not the issue tracker.

Questions about the Chinese build belong in [this repository's issues](https://github.com/xhy200606/tinycast-cn/issues).
For the upstream community, **[join the Discord](https://discord.gg/v2Eeb4QQy3)**.

## Upstream Star History

<a href="https://www.star-history.com/?repos=abue-ammar%2Ftinycast&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=abue-ammar/tinycast&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=abue-ammar/tinycast&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=abue-ammar/tinycast&type=date&legend=top-left" />
 </picture>
</a>

## License

[AGPL-3.0](LICENSE)
