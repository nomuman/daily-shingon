# デザイン原則（Design Principles）

## 0. 目指す体験

- 静かで、短くて、迷わない
- “儀礼感”は出すが、重くしない
- 途切れても戻れる（連続より復帰を称える）
- 敬意（宗教的対象・伝統への配慮）

三密は「身・口・意」の実践を合わせて行うという説明があるため、UIも “身/口/意” の3軸が常に見える設計にする。  
参考（高野山パンフ）：https://www.koyasan.or.jp/wp-content/themes/koyasan-child/pdf/kokusaikyoku_english_panfu.pdf

---

## 1. 原則（UX）

### P1. 1日5分未満

朝3分・夜45秒を守る。長文や多ステップは “学びの深掘り（Premium）” に退避。

### P2. 1画面 = 1意図

- 朝：整える
- 昼：学ぶ
- 夜：閉じる

### P3. 復帰が偉い

連続記録を前面に出さない。途切れた翌日は「戻れた」を最優先メッセージにする。

### P4. 断定しない

効果保証・脅し・他宗批判をしない（プロダクトトーンの基礎）。

---

## 2. 原則（UIレイアウト）

### P5. グリッドは “8” を基準

- iOS/Androidともにリズムが取りやすい  
  参考：Apple HIG Layout https://developer.apple.com/design/human-interface-guidelines/layout  
  参考：Android “8 dp grid” https://developer.android.com/design/ui/mobile/guides/layout-and-content/grids-and-units

### P6. タップ領域は最小 44x44pt

主要CTA・アイコンボタンを含む。  
参考：Apple HIG Buttons https://developer.apple.com/design/human-interface-guidelines/buttons

### P7. タイポグラフィは階層で読む

見出し/本文/補助/注釈を固定化。  
参考：Apple HIG Typography https://developer.apple.com/design/human-interface-guidelines/typography  
参考：Material 3 Typography https://m3.material.io/styles/typography/overview

### P8. リストは“整列と余白”で迷わせない

チェックインやログはリスト中心。  
参考：Apple HIG Lists and tables https://developer.apple.com/design/human-interface-guidelines/lists-and-tables

---

## 3. 原則（ビジュアル）

### P9. 色は“静けさ”が基本、強調は1つ

- 背景：ニュートラル
- 文字：高コントラスト
- アクセント：1色（Primary CTA と進捗のみ）

### P10. 角丸・影は控えめ

カードは“落ち着き”。派手な影やグラデは避ける。

### P11. モーションは“儀礼感”の補助に限定

- 完了時：小さなフェード/スケール
- 乱用しない（ユーザーを煽らない）

---

## 4. 原則（アイコン）

- iOSはSF Symbolsで統一（必要なら）  
  参考：SF Symbols (HIG) https://developer.apple.com/design/human-interface-guidelines/sf-symbols
- AndroidはMaterial Symbols相当で統一（必要なら）
- アイコンは意味が明確なもののみ（装飾目的は禁止）
