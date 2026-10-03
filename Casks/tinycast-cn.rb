cask "tinycast-cn" do
  arch arm: "arm64", intel: "universal"

  version "0.11.12"
  sha256 arm:   "b378132a36556004393daf70b6ee2c92c44a26664ad191bbcd7e1bd9519651c7",
         intel: "9148553e984c799a8a359f7f88ab698025fe3ccdeea0d98b78d0e25aa5557986"

  url "https://github.com/xhy200606/tinycast-cn/releases/download/cn-v#{version}/Tinycast-#{arch}-#{version}.dmg"
  name "Tinycast 简体中文版"
  desc "Native macOS launcher with a Simplified Chinese interface"
  homepage "https://github.com/xhy200606/tinycast-cn"

  livecheck do
    url :url
    regex(/^cn-v(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :tahoe
  conflicts_with cask: ["xhy200606/tinycast-cn/tinycast-cn-arm64", "xhy200606/tinycast-cn/tinycast-cn-universal"]

  app "Tinycast.app"
end
