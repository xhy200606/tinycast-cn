import Foundation

@main
struct PinyinTests {
    static func main() {
        let cases: [(String, [String])] = [
            ("微信", ["weixin", "wx"]),
            ("音乐", ["yinyue", "yy"]),
            ("QQ音乐", ["qqyinyue", "qqyy"]),
            ("\u{FEFF}微信", ["weixin", "wx"]),
            ("Safari", []),
        ]
        var failures = 0
        for (name, expected) in cases {
            let actual = Pinyin.aliases(for: name)
            if actual != expected {
                print("FAIL: \(name) expected \(expected), got \(actual)")
                failures += 1
            }
        }
        print("Pinyin: \(cases.count) checks, \(failures) failures")
        exit(failures == 0 ? 0 : 1)
    }
}
