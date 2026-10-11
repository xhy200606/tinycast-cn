cask "tinycast-cn-arm64" do
  version "0.11.19"
  sha256 "eb772c3622432a82bb10fd636c5728c85dcdee60dbfb49ba4ca27b3f3929d35c"

  url "https://github.com/xhy200606/tinycast-cn/releases/download/v#{version}/Tinycast-arm64-#{version}.dmg"

  name "Tinycast 简体中文版 (ARM64)"
  desc "Native macOS launcher with a Simplified Chinese interface"
  homepage "https://github.com/xhy200606/tinycast-cn"

  livecheck do
    url :url
    regex(/^v(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :tahoe
  depends_on arch: :arm64
  conflicts_with cask: ["xhy200606/tinycast-cn/tinycast-cn", "xhy200606/tinycast-cn/tinycast-cn-universal"]

  app "Tinycast.app"
end
