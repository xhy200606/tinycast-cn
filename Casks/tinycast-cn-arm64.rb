cask "tinycast-cn-arm64" do
  version "0.11.12"
  sha256 "b378132a36556004393daf70b6ee2c92c44a26664ad191bbcd7e1bd9519651c7"

  url "https://github.com/xhy200606/tinycast-cn/releases/download/cn-v#{version}/Tinycast-arm64-#{version}.dmg"
  name "Tinycast 简体中文版 (ARM64)"
  desc "Native macOS launcher with a Simplified Chinese interface"
  homepage "https://github.com/xhy200606/tinycast-cn"

  livecheck do
    url :url
    regex(/^cn-v(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :tahoe
  depends_on arch: :arm64
  conflicts_with cask: ["xhy200606/tinycast-cn/tinycast-cn", "xhy200606/tinycast-cn/tinycast-cn-universal"]

  app "Tinycast.app"
end
