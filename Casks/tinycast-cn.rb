cask "tinycast-cn" do
  on_arm do
    version "0.11.19"
    sha256 "eb772c3622432a82bb10fd636c5728c85dcdee60dbfb49ba4ca27b3f3929d35c"
    url "https://github.com/xhy200606/tinycast-cn/releases/download/v#{version}/Tinycast-arm64-#{version}.dmg"
  end

  on_intel do
    version "0.11.12"
    sha256 "9148553e984c799a8a359f7f88ab698025fe3ccdeea0d98b78d0e25aa5557986"
    url "https://github.com/xhy200606/tinycast-cn/releases/download/cn-v#{version}/Tinycast-universal-#{version}.dmg"
    livecheck do
      skip "A newer Universal package has not been published"
    end
  end


  name "Tinycast 简体中文版"
  desc "Native macOS launcher with a Simplified Chinese interface"
  homepage "https://github.com/xhy200606/tinycast-cn"

  on_arm do
    livecheck do
      url :url
      regex(/^v(\d+(?:\.\d+)+)$/i)
    end
  end

  depends_on macos: :tahoe
  conflicts_with cask: ["xhy200606/tinycast-cn/tinycast-cn-arm64", "xhy200606/tinycast-cn/tinycast-cn-universal"]

  app "Tinycast.app"
end
