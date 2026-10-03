cask "tinycast-cn-universal" do
  version "0.11.12"
  sha256 "9148553e984c799a8a359f7f88ab698025fe3ccdeea0d98b78d0e25aa5557986"

  url "https://github.com/xhy200606/tinycast-cn/releases/download/cn-v#{version}/Tinycast-universal-#{version}.dmg"
  name "Tinycast 简体中文版 (Universal)"
  desc "Native macOS launcher with a Simplified Chinese interface"
  homepage "https://github.com/xhy200606/tinycast-cn"

  livecheck do
    url :url
    regex(/^cn-v(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :tahoe
  conflicts_with cask: ["xhy200606/tinycast-cn/tinycast-cn", "xhy200606/tinycast-cn/tinycast-cn-arm64"]

  app "Tinycast.app"
end
