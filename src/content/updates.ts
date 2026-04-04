/**
 * Purpose: Roadmap and changelog content for the Updates screen. / 目的: アップデート画面のロードマップ・更新情報データ。
 * Responsibilities: provide language-specific roadmap items and changelog entries. / 役割: 言語別のロードマップと更新情報を提供。
 * Inputs: content language. / 入力: コンテンツ言語。
 * Outputs: roadmap/changelog arrays for rendering. / 出力: 表示用の配列データ。
 * Dependencies: ContentLang types. / 依存: ContentLang型。
 * Side effects: none. / 副作用: なし。
 * Edge cases: unknown language falls back to ja. / 例外: 不明言語はjaにフォールバック。
 */
import type { ContentLang } from './lang';

export type RoadmapStatus = 'wip' | 'beta' | 'idea' | 'done';

export type RoadmapItem = {
  id: string;
  title: string;
  status?: RoadmapStatus;
  detail: string;
};

export type ChangelogItem = {
  id: string;
  dateLabel: string;
  title: string;
  body: string;
  tag?: string;
  badges?: string[];
};

export type UpdatesContent = {
  roadmap: RoadmapItem[];
  changelog: ChangelogItem[];
};

const UPDATES_CONTENT: Record<ContentLang, UpdatesContent> = {
  ja: {
    roadmap: [
      {
        id: 'release-stability',
        title: '初回リリース安定化',
        status: 'wip',
        detail:
          '3/9 リリースに向けて、通知・同期・データ保存の最終確認を優先しています。重大な不具合の修正と、手順のわかりやすさを最優先で調整します。',
      },
      {
        id: 'content-review',
        title: '学びコンテンツ監修（第一弾）',
        status: 'beta',
        detail:
          'カードと用語集の出典確認、言い回しの整合、英日での意味差の見直しを継続します。公開後は月次で見直しサイクルを回す予定です。',
      },
      {
        id: 'sync-hardening',
        title: 'アカウント同期の堅牢化',
        status: 'beta',
        detail:
          'サインイン後の同期エラー時に、再試行しやすい導線と失敗理由の表示を強化します。同期OFF運用でも不便が出ないようにUXを調整します。',
      },
      {
        id: 'accessibility-pass',
        title: '読みやすさ・操作性の改善',
        status: 'wip',
        detail:
          'フォントサイズ拡大時の崩れ抑制、タップ領域の見直し、コントラスト調整を進めています。まずは朝/夜/学び画面を優先対象にします。',
      },
      {
        id: 'donation',
        title: 'お布施（チップ）機能',
        status: 'idea',
        detail:
          '広告や過度な課金導線を避けた形で、任意の支援導線を検討しています。初回リリースでは実装せず、要望を見て設計を決めます。',
      },
    ],
    changelog: [
      {
        id: '2026-02-28-rc',
        dateLabel: '2026-02-28',
        title: 'リリース候補（RC）準備',
        body: 'EASビルド設定の見直し、CIに typecheck / doctor / web export を追加。コンテンツ整合性チェックを導入しました。',
        tag: '準備中',
        badges: ['Release', 'QA'],
      },
      {
        id: '2026-02-20-content',
        dateLabel: '2026-02-20',
        title: '学びカードと用語集の改善',
        body: '出典の表示改善と誤記修正を実施。詳細画面から参考URLを直接開けるように変更しました。',
        tag: '改善',
        badges: ['Content', 'UX'],
      },
      {
        id: '2026-02-10-sync',
        dateLabel: '2026-02-10',
        title: '同期・通知まわりの調整',
        body: '通知設定の挙動と同期周辺のエラーハンドリングを見直し、失敗時の復帰性を改善しました。',
        tag: '調整',
        badges: ['Sync', 'Notification'],
      },
      {
        id: '2026-01-25-foundation',
        dateLabel: '2026-01-25',
        title: '初期版の基盤整備',
        body: '朝・昼・夜の基本フロー、履歴表示、設定画面の主要機能を整備しました。',
        tag: '基盤',
        badges: ['Core'],
      },
    ],
  },
  en: {
    roadmap: [
      {
        id: 'release-stability',
        title: 'First Release Stabilization',
        status: 'wip',
        detail:
          'Before the March 9 release, we are prioritizing final validation of notifications, sync, and local data behavior. Critical bug fixes and clarity of core flows come first.',
      },
      {
        id: 'content-review',
        title: 'Content Review (Phase 1)',
        status: 'beta',
        detail:
          'We are continuing source verification, wording consistency checks, and ja/en meaning alignment across cards and glossary entries. Post-release, this will run on a monthly cycle.',
      },
      {
        id: 'sync-hardening',
        title: 'Account Sync Hardening',
        status: 'beta',
        detail:
          'We are improving retry flows and failure messaging around sign-in and sync. The app should remain comfortable even when users keep sync disabled.',
      },
      {
        id: 'accessibility-pass',
        title: 'Readability and Accessibility Pass',
        status: 'wip',
        detail:
          'We are tuning large-text layout behavior, touch target consistency, and contrast. Morning, Night, and Learn flows are the first priority.',
      },
      {
        id: 'donation',
        title: 'Optional Support (Tip) Feature',
        status: 'idea',
        detail:
          'We are exploring a low-pressure support path without ads or aggressive paywalls. It is out of scope for v1 and will be prioritized based on feedback.',
      },
    ],
    changelog: [
      {
        id: '2026-02-28-rc',
        dateLabel: '2026-02-28',
        title: 'Release Candidate Preparation',
        body: 'Updated EAS build settings, expanded CI checks (typecheck / doctor / web export), and added content integrity checks.',
        tag: 'In Progress',
        badges: ['Release', 'QA'],
      },
      {
        id: '2026-02-20-content',
        dateLabel: '2026-02-20',
        title: 'Learning Content Improvements',
        body: 'Improved source display and fixed wording issues. Source URLs can now be opened directly from detail screens.',
        tag: 'Improved',
        badges: ['Content', 'UX'],
      },
      {
        id: '2026-02-10-sync',
        dateLabel: '2026-02-10',
        title: 'Sync and Notification Adjustments',
        body: 'Refined notification behavior and strengthened error recovery around sync-related actions.',
        tag: 'Adjusted',
        badges: ['Sync', 'Notification'],
      },
      {
        id: '2026-01-25-foundation',
        dateLabel: '2026-01-25',
        title: 'Core Foundation Update',
        body: 'Established the core morning / midday / night flow, history view, and key settings features.',
        tag: 'Foundation',
        badges: ['Core'],
      },
    ],
  },
};

export function getUpdatesContent(lang: ContentLang): UpdatesContent {
  return UPDATES_CONTENT[lang] ?? UPDATES_CONTENT.ja;
}
