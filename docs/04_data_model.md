# データモデル / 保存設計（MVP）

## 1. 方針

- MVPは端末内保存（同期なし）
- 日付はローカルの YYYY-MM-DD を正とする
- “朝/夜”は同日2レコードまで

## 2. エンティティ

### Entry（実践ログ）

- id: string（例：`2025-12-26_morning`）
- date: string（YYYY-MM-DD）
- slot: 'morning' | 'night'
- bodyDone: boolean
- speechDone: boolean
- mindDone: boolean
- actionPick?: 'body' | 'speech' | 'mind' // 今日の行い
- sange?: 'body' | 'speech' | 'mind' // 懺悔
- hatsugan?: 'body' | 'speech' | 'mind' // 発願
- eko?: 'self' | 'family' | 'team' | 'all' // 回向
- note?: string
- createdAt: number（epoch ms）
- updatedAt: number（epoch ms）

### LearnCard（学び）

- id: string（例：`day001`）
- day: number（1..30）
- title: string
- body: string（短文）
- example?: string（生活のたとえ）
- actionOptions: Array<{ key: 'body'|'speech'|'mind', text: string }>
- nightQuestion: string
- tags: string[]

### UserSettings

- reminderMorningTime: string（HH:mm）
- reminderNightTime: string（HH:mm）
- reminderEnabled: boolean
- tone: 'neutral' | 'gentle'
- premium: boolean（将来：課金状態は別管理に）

## 3. 保存（AsyncStorage想定）

キー設計

- `@dailyshingon/settings` → UserSettings
- `@dailyshingon/entries/{YYYY-MM-DD}` → Entry[]（朝/夜）
- `@dailyshingon/progress` → 既読カードIDなど（任意）
- `@dailyshingon/contentVersion` → コンテンツバージョン（任意）

## 4. 集計（UI用に作る計算）

- 今日の状態：entries[date] から朝/夜の完了判定
- 週次バランス：指定期間で bodyDone/speechDone/mindDone の合計
- 乱れ傾向：sange の集計
- 発願傾向：hatsugan の集計

## 5. 互換性（将来）

- コンテンツは `content/curriculum/30days.ja.json` を基本とし、EAS Update で更新できる前提
- スキーマ変更は `contentVersion` とマイグレーション関数で吸収

## 6. マイグレーション方針（AsyncStorage → SQLite）

- まずは `src/lib/storage.ts` に read/write を集約し、呼び出し側を薄く保つ
- 移行時は新ストア（SQLite）を優先し、旧キーは読み込み後に段階削除
- 破壊的変更は `contentVersion` / `settingsVersion` を追加して段階的に変換する
