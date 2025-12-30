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
        id: 'offering',
        title: 'お布施（チップ）機能',
        status: 'idea',
        detail: '広告を増やさず続けるための小さな支援窓口。金額や頻度は自由で、気が向いた時だけ。',
      },
      {
        id: 'friends',
        title: '友達とつながる（小さなコミュニティ）',
        status: 'idea',
        detail: '励まし合うだけの小さなつながり。比較や競争を生まないよう、公開範囲と表示量を最小にする。',
      },
      {
        id: 'guided-onboarding',
        title: 'はじめてガイド（短い導入）',
        status: 'idea',
        detail: '3枚ほどの短い導入で使い方と価値観を伝える。スキップ可能で、押しつけない。',
      },
      {
        id: 'streak-free-nudge',
        title: 'やさしい復帰導線（空白を責めない）',
        status: 'idea',
        detail: '空白があっても戻れる導線を静かに用意。連続記録やランキングは使わない。',
      },
      {
        id: 'focus-mode',
        title: '集中モード（通知/ナビの最小化）',
        status: 'idea',
        detail: '実践に集中できる最小UI。通知やナビは一時的に隠して、画面は静かに。',
      },
      {
        id: 'ritual-sounds',
        title: '静かな効果音・環境音',
        status: 'idea',
        detail: '小さな鈴や環境音を選べる。音量ゼロ/端末設定に従う。',
      },
      {
        id: 'offline-pack',
        title: 'オフライン用パック（通信なしで使える）',
        status: 'idea',
        detail: '朝/夜/学びを通信なしで使えるパック。端末内だけで完結する。',
      },
      {
        id: 'smart-reminder',
        title: '学習状況に合わせた通知最適化',
        status: 'idea',
        detail: '実践の傾向に合わせて通知時間を提案。強制ではなく提案として示す。',
      },
      {
        id: 'gentle-analytics',
        title: 'やさしい振り返り（可視化）',
        status: 'idea',
        detail: '達成率ではなく「戻れた日」を静かに見える化。責めない言葉で振り返る。',
      },
      {
        id: 'accessibility-plus',
        title: 'アクセシビリティ強化（文字/音声/操作）',
        status: 'idea',
        detail: '文字サイズ/読み上げ/タップ領域を強化。年齢や端末に合わせて選べる。',
      },
      {
        id: 'personalized-path',
        title: 'やさしいパーソナライズ（おすすめの流れ）',
        status: 'idea',
        detail: '今の状態に合う次の一歩を提案。おすすめは控えめで、最後は自分で選ぶ。',
      },
      {
        id: 'practice-notes',
        title: '実践メモのテンプレ/プロンプト',
        status: 'idea',
        detail: '短い問いかけでメモを書きやすく。テンプレは選択式で自由度を残す。',
      },
      {
        id: 'calendar-view',
        title: 'カレンダー表示（朝/夜の記録）',
        status: 'idea',
        detail: 'カレンダーで朝/夜の記録を静かに見返す。色は淡く、比較を煽らない。',
      },
      {
        id: 'sync-cloud',
        title: 'クラウド同期（任意）',
        status: 'idea',
        detail: '端末紛失時のバックアップ用。任意で、ログは本人だけが見られる。',
      },
      {
        id: 'device-handoff',
        title: '端末間引き継ぎ',
        status: 'idea',
        detail: '機種変更時の引き継ぎを簡単に。データは暗号化して移行。',
      },
      {
        id: 'shareable-cards',
        title: '学びカードの共有（静かな共有）',
        status: 'idea',
        detail: '学びカードを一枚だけ静かに共有。拡散よりも小さな共有を想定。',
      },
      {
        id: 'coach-mode',
        title: '伴走モード（週次チェックイン）',
        status: 'idea',
        detail: '週に一度だけのチェックイン。評価ではなく呼吸を整える問いにする。',
      },
      {
        id: 'ritual-sets',
        title: '儀礼セット（朝/夜のカスタム）',
        status: 'idea',
        detail: '朝/夜の流れを少しだけカスタム。順序変更と省略が中心。',
      },
      {
        id: 'ajikan-timer',
        title: '阿字観タイマー（3/5/10分）',
        status: 'idea',
        detail: '3/5/10分のタイマーと簡単な導入。画面は最小限で静かに。',
      },
      {
        id: 'learning-courses',
        title: '学びコース（30日/90日）',
        status: 'idea',
        detail: '30日/90日の小さな章立て。途中で止まっても戻れる。',
      },
      {
        id: 'weekly-review',
        title: '週間レビュー（1分）',
        status: 'idea',
        detail: '1分だけの振り返り。記録は短く、続けやすく。',
      },
      {
        id: 'bookmarks-search',
        title: 'ブックマーク / 検索',
        status: 'idea',
        detail: '必要な学びをすぐ探せる。検索は軽く、タグは最小限。',
      },
      {
        id: 'paid-audio',
        title: '音声ガイド / 深掘り教材（有料）',
        status: 'idea',
        detail: '音声ガイドや深掘り教材を有料で提供。無料体験の静けさを壊さない。',
      },
      {
        id: 'monk-content',
        title: '僧侶監修コンテンツ',
        status: 'idea',
        detail: '僧侶監修の内容で安心感を補強。専門用語は噛み砕いて説明する。',
      },
      {
        id: 'experience-path',
        title: '体験導線（阿字観体験/法話/参拝プラン）',
        status: 'idea',
        detail: '体験へつなぐ案内を用意。外部体験は無理に勧めない。',
      },
      {
        id: 'widget',
        title: 'ホームウィジェット',
        status: 'idea',
        detail: 'ホーム画面から静かに起動。1タップで朝/夜へ入れる。',
      },
      {
        id: 'reminder-flex',
        title: '通知の柔軟な時間設定',
        status: 'idea',
        detail: '曜日や休日で通知時間を分ける。オン/オフはすぐ切替。',
      },
      {
        id: 'silent-retreat',
        title: '沈黙リトリート（一定時間だけ静かなUI）',
        status: 'idea',
        detail: '一定時間、通知とUIを極限まで静かに。開始と終了だけ丁寧に案内。',
      },
      {
        id: 'mantra-counter',
        title: '真言カウンター（数唱/振動）',
        status: 'idea',
        detail: '真言の回数を数えるだけの画面。振動だけでカウントできる。',
      },
      {
        id: 'breath-sync',
        title: '呼吸同期アニメ（3分の整え）',
        status: 'idea',
        detail: '呼吸のテンポに合わせてゆっくり動くアニメ。視線を落ち着かせる。',
      },
      {
        id: 'mandala-view',
        title: '曼荼羅ビュー（静かな鑑賞/拡大）',
        status: 'idea',
        detail: '曼荼羅を静かに眺めるビュー。ズームと説明は控えめ。',
      },
      {
        id: 'voice-note',
        title: '音声で夜のひと言（自動文字起こし）',
        status: 'idea',
        detail: '夜のひと言を音声で残せる。端末内で文字起こしして保存。',
      },
      {
        id: 'seasonal-rituals',
        title: '年中行事カレンダー（静かな案内）',
        status: 'idea',
        detail: '年中行事を静かに知らせる。地域差に配慮してオン/オフ可能。',
      },
      {
        id: 'altar-mode',
        title: '小さなお仏壇モード（一枚絵と合掌）',
        status: 'idea',
        detail: '一枚絵と短い合掌の導線。ボタンと通知は最小限。',
      },
      {
        id: 'quiet-share',
        title: '一日一句の静かな共有（外部へ出さない）',
        status: 'idea',
        detail: '一日一句を自分の記録として残す。共有は控えめで、選択式。',
      },
      {
        id: 'history',
        title: '365日ヒートマップ',
        status: 'done',
        detail: '実践の足跡を淡い色で可視化。空白は責めない設計。',
      },
      {
        id: 'theme',
        title: 'テーマ切替（ライト/ダーク）',
        status: 'done',
        detail: 'ライト/ダーク/システムの3種。目への負担を減らす。',
      },
      {
        id: 'language',
        title: '言語切替',
        status: 'done',
        detail: '日本語/英語を切り替え。文体の静けさは保つ。',
      },
    ],
    changelog: [
      {
        id: 'update-05',
        dateLabel: '2025年12月26日',
        tag: 'update #05',
        title: '通知の安定性を改善',
        body: '朝/夜リマインダーが重複するケースを解消しました。',
        badges: ['iOS 1.2.0', 'Android 1.2.0'],
      },
      {
        id: 'update-04',
        dateLabel: '2025年12月12日',
        tag: 'update #04',
        title: '履歴の表示が軽くなりました',
        body: '365日履歴の読み込みを軽量化し、スクロールが滑らかになりました。',
        badges: ['iOS 1.1.5', 'Android 1.1.5'],
      },
      {
        id: 'update-03',
        dateLabel: '2025年11月28日',
        tag: 'update #03',
        title: 'テーマ切替を追加',
        body: 'ライト/ダーク/システムに対応しました。',
        badges: ['iOS 1.1.0', 'Android 1.1.0'],
      },
    ],
  },
  en: {
    roadmap: [
      {
        id: 'offering',
        title: 'Offerings (tip jar)',
        status: 'idea',
        detail: 'A small support window to keep the app quiet without more ads. Amount and timing are optional.',
      },
      {
        id: 'friends',
        title: 'Connect with friends (small community)',
        status: 'idea',
        detail: 'A tiny circle for gentle encouragement. Visibility and feeds stay minimal to avoid comparison.',
      },
      {
        id: 'guided-onboarding',
        title: 'Guided onboarding (short intro)',
        status: 'idea',
        detail: 'A short 3-card intro to explain the flow and values. Skippable and non-pushy.',
      },
      {
        id: 'streak-free-nudge',
        title: 'Gentle return flows (no guilt)',
        status: 'idea',
        detail: 'Make it easy to come back after gaps. No streak pressure or ranking.',
      },
      {
        id: 'focus-mode',
        title: 'Focus mode (minimal distractions)',
        status: 'idea',
        detail: 'A minimal UI to practice without distractions. Hide navigation and notifications temporarily.',
      },
      {
        id: 'ritual-sounds',
        title: 'Subtle ritual sounds/ambience',
        status: 'idea',
        detail: 'Subtle bell or ambience choices. Volume off or follow system settings.',
      },
      {
        id: 'offline-pack',
        title: 'Offline packs (no connection needed)',
        status: 'idea',
        detail: 'Morning, night, and learning available offline. Everything stays on device.',
      },
      {
        id: 'smart-reminder',
        title: 'Adaptive reminders by practice',
        status: 'idea',
        detail: 'Suggest times based on practice patterns. Only suggestions, never forced.',
      },
      {
        id: 'gentle-analytics',
        title: 'Gentle reflection insights',
        status: 'idea',
        detail: 'Highlight returned days rather than scores. Wording stays kind.',
      },
      {
        id: 'accessibility-plus',
        title: 'Accessibility upgrades (text/voice/controls)',
        status: 'idea',
        detail: 'Larger text, voice support, generous tap targets. Choose what fits each device.',
      },
      {
        id: 'personalized-path',
        title: 'Soft personalization (suggested flow)',
        status: 'idea',
        detail: 'Suggest a next step based on current state. Suggestions are soft, final choice is yours.',
      },
      {
        id: 'practice-notes',
        title: 'Practice notes templates/prompts',
        status: 'idea',
        detail: 'Short prompts make notes easy. Templates are optional and lightweight.',
      },
      {
        id: 'calendar-view',
        title: 'Calendar view (morning/night logs)',
        status: 'idea',
        detail: 'Quiet calendar for morning and night logs. Colors remain soft and non-competitive.',
      },
      {
        id: 'sync-cloud',
        title: 'Optional cloud sync',
        status: 'idea',
        detail: 'Optional backup in case of device loss. Logs remain private to the user.',
      },
      {
        id: 'device-handoff',
        title: 'Device handoff',
        status: 'idea',
        detail: 'Simple migration when switching phones. Data moves with encryption.',
      },
      {
        id: 'shareable-cards',
        title: 'Shareable learning cards (quiet sharing)',
        status: 'idea',
        detail: 'Share a single learning card gently. Designed for small sharing, not virality.',
      },
      {
        id: 'coach-mode',
        title: 'Companion mode (weekly check-in)',
        status: 'idea',
        detail: 'Weekly check-in that helps you breathe and reflect. No grading.',
      },
      {
        id: 'ritual-sets',
        title: 'Ritual sets (custom morning/night)',
        status: 'idea',
        detail: 'Light customization of morning and night flow. Mostly reorder or hide steps.',
      },
      {
        id: 'ajikan-timer',
        title: 'Ajikan timer (3/5/10 min)',
        status: 'idea',
        detail: '3/5/10 minute timer with a brief guide. Screen stays quiet.',
      },
      {
        id: 'learning-courses',
        title: 'Learning courses (30/90 day)',
        status: 'idea',
        detail: '30/90-day chapters for guidance. You can pause and return anytime.',
      },
      {
        id: 'weekly-review',
        title: 'Weekly review (1 min)',
        status: 'idea',
        detail: 'One-minute reflection prompts. Notes stay short and easy.',
      },
      {
        id: 'bookmarks-search',
        title: 'Bookmarks / search',
        status: 'idea',
        detail: 'Find what you need quickly. Search is light, tags stay minimal.',
      },
      {
        id: 'paid-audio',
        title: 'Audio guide / deep-dive content (paid)',
        status: 'idea',
        detail: 'Optional paid audio guides and deeper content. Free flow remains calm.',
      },
      {
        id: 'monk-content',
        title: 'Monk-supervised content',
        status: 'idea',
        detail: 'Monk supervised content for trust. Terms are explained in plain language.',
      },
      {
        id: 'experience-path',
        title: 'Experience paths (Ajikan trial, dharma talk, temple visit)',
        status: 'idea',
        detail: 'A gentle path to real-world experiences. External options are never pushed.',
      },
      {
        id: 'widget',
        title: 'Home widget',
        status: 'idea',
        detail: 'Quiet home screen entry point. One tap to morning or night.',
      },
      {
        id: 'reminder-flex',
        title: 'Flexible reminder times',
        status: 'idea',
        detail: 'Different reminder times by day. Fast on and off control.',
      },
      {
        id: 'silent-retreat',
        title: 'Silent retreat (quiet UI timebox)',
        status: 'idea',
        detail: 'Timeboxed quiet mode that silences UI and notifications. Start and end are gently announced.',
      },
      {
        id: 'mantra-counter',
        title: 'Mantra counter (count + haptics)',
        status: 'idea',
        detail: 'A simple counter for recitation. Haptics can mark each count.',
      },
      {
        id: 'breath-sync',
        title: 'Breath sync animation (3-minute align)',
        status: 'idea',
        detail: 'Slow animation to pace breathing. Helps settle the gaze.',
      },
      {
        id: 'mandala-view',
        title: 'Mandala view (quiet focus / zoom)',
        status: 'idea',
        detail: 'A calm mandala viewer. Zoom is available, explanations are minimal.',
      },
      {
        id: 'voice-note',
        title: 'Voice night note (auto transcription)',
        status: 'idea',
        detail: 'Record the night note by voice. Transcribe on device and save.',
      },
      {
        id: 'seasonal-rituals',
        title: 'Seasonal rituals calendar (quiet prompts)',
        status: 'idea',
        detail: 'Quiet notices for seasonal rituals. Toggle by region or preference.',
      },
      {
        id: 'altar-mode',
        title: 'Tiny altar mode (single image + bow)',
        status: 'idea',
        detail: 'A single image with a short bow prompt. Buttons and alerts are minimal.',
      },
      {
        id: 'quiet-share',
        title: 'One-line quiet sharing (private-first)',
        status: 'idea',
        detail: 'Keep a one-line phrase as a personal record. Sharing is optional and modest.',
      },
      {
        id: 'history',
        title: '365-day heatmap',
        status: 'done',
        detail: 'Soft heatmap of practice footprints. Gaps are treated gently.',
      },
      {
        id: 'theme',
        title: 'Theme toggle (light/dark)',
        status: 'done',
        detail: 'Light, dark, and system themes to reduce eye strain.',
      },
      {
        id: 'language',
        title: 'Language switcher',
        status: 'done',
        detail: 'Switch between Japanese and English while keeping the calm tone.',
      },
    ],
    changelog: [
      {
        id: 'update-05',
        dateLabel: 'Dec 26, 2025',
        tag: 'update #05',
        title: 'Reminder stability improved',
        body: 'Fixed a case where morning/night reminders could duplicate.',
        badges: ['iOS 1.2.0', 'Android 1.2.0'],
      },
      {
        id: 'update-04',
        dateLabel: 'Dec 12, 2025',
        tag: 'update #04',
        title: 'History view feels lighter',
        body: 'Reduced load work for the 365-day history and improved scrolling.',
        badges: ['iOS 1.1.5', 'Android 1.1.5'],
      },
      {
        id: 'update-03',
        dateLabel: 'Nov 28, 2025',
        tag: 'update #03',
        title: 'Theme toggle added',
        body: 'Light, dark, and system themes are now supported.',
        badges: ['iOS 1.1.0', 'Android 1.1.0'],
      },
    ],
  },
};

export function getUpdatesContent(lang: ContentLang = 'ja'): UpdatesContent {
  return UPDATES_CONTENT[lang] ?? UPDATES_CONTENT.ja;
}
