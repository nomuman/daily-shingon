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
        detail: `【目的】
・広告や強い課金導線を増やさず、静けさを保ったまま運営を支えられる選択肢を置く。

【体験の原則】
・“今すぐ支払うべき”の圧を作らない（初期表示は控えめ / バナー固定しない）。
・支援しないユーザーに不利益がないことを明記する（機能制限で煽らない）。
・言葉は短く、効果やご利益を断定しない。感謝も控えめ。

【画面・導線】
・設定 or 情報(About) の奥に「お布施」を配置（Home等の主要導線に常設しない）。
・1画面完結：金額選択（候補3〜5）→確認→完了。
・詳細（使途/FAQ）は折りたたみ式で任意閲覧。

【仕様】
・金額：小さな定額（例 120/300/600/1200）+ 任意入力は将来。
・頻度：単発のみ（“毎月”は後日。まずは静かな単発）。
・完了後：短い一文 + 戻るボタンのみ（シェア/連続促しなし）。
・復元：ストア標準のレストア導線を用意（“支援履歴”は表示しない/誇示しない）。

【例外/エラー】
・決済失敗：原因を断定せず「うまく完了しませんでした。時間をおいて再度お試しください」程度に短く。
・ネット不安定：再試行はユーザー操作に委ねる。自動連打はしない。

【プライバシー】
・アプリ側で個人の“支援額合計”の強調表示をしない。
・ストア側情報以外は保持しない（MVPは端末内で完結）。`,
      },
      {
        id: 'friends',
        title: '友達とつながる（小さなコミュニティ）',
        status: 'idea',
        detail: `【目的】
・公開SNSではなく“静かな相互見守り”を数人規模で提供し、続ける圧ではなく戻る余白を作る。

【前提（やらないこと）】
・タイムライン/ランキング/連続日数/回数表示はしない（比較を生むため）。
・公開検索・フォロー文化は作らない（招待制のみ）。

【コア体験】
・1日の“在席”を示すだけ（例：朝/夜のどちらかに「今日も戻れた」スタンプ）。
・反応は軽い（スタンプ1つ or 15文字程度の一言）。返信義務を作らない。
・通知は初期オフ（オンにしても「今日、誰かが戻れた」程度の控えめな文）。

【画面・導線】
・設定内に「小さな輪」：作成 / 招待 / 参加。
・招待はリンク or QR（期限付き）。参加前に“できること/見えること”を短く提示。
・退出/一時停止を同じ画面に常設（迷わせない）。

【データ方針（MVP案）】
・共有するのは最小：日付 + “戻れた”フラグ + 任意の短文のみ。
・個別の懺悔/発願/メモなどセンシティブ情報は共有対象外がデフォルト。
・ログ削除/退会時のデータ扱いを明示（自分の投稿は消せる）。

【例外/安全】
・相手が不在/ブロック：静かな表示（存在を強調しない）。
・通報/ミュート：最低限の安全機構を設け、説明は短く。`,
      },
      {
        id: 'guided-onboarding',
        title: 'はじめてガイド（短い導入）',
        status: 'idea',
        detail: `【目的】
・初回の迷いを減らし、「短い・戻れる・断定しない」価値観を先に伝える。

【構成（3枚）】
1) このアプリは何か：三密を日常で回す入口
2) 朝/夜の流れ：朝3分・夜45秒（最小の型）
3) 途切れてOK：連続ではなく復帰を大切にする

【UI/UX】
・最初からスキップ可能（押しつけない）。あとから設定で読み返せる。
・各カードは80〜120字程度、読み上げ対応、左右スワイプ + “次へ”。
・最後は「朝を1分だけ試す」など“次の一歩を1つ”だけ提示。

【状態/実装】
・既読フラグを端末内保存（例：@sanmitsu/progress）。
・更新で文言が変わった場合のみ再提示（contentVersionで制御）。

【例外】
・途中離脱：次回起動で再開するか、スキップしたままにするか選べる。`,
      },
      {
        id: 'streak-free-nudge',
        title: 'やさしい復帰導線（空白を責めない）',
        status: 'idea',
        detail: `【目的】
・空白があっても“戻ること”が自然にできる導線を作り、罪悪感や達成圧を避ける。

【体験】
・連続日数/バッジ/叱責は使わない。
・復帰時は「今日、1つだけ」提案（身/口/意のどれかを短く）。

【表示ルール】
・未実施が続く場合でも赤色や警告表現を避ける。
・復帰提案は1日1回まで、かつ表示は控えめ（カード1枚程度）。

【導線】
・Homeの上部に“静かな提案カード”を一時表示（閉じる×あり、再表示しない）。
・通知に頼らない（アプリ内で完結する導線を主に）。

【ロジック（端末内）】
・直近のEntry（朝/夜）の日付差分から「久しぶり」を判定。
・提案は「前回最後にやったスロット」と逆側を優先（例：夜だけ続いていたら朝を軽く）。

【例外】
・通知オフでも機能する。
・データが空（初回）ならオンボーディングへ誘導。`,
      },
      {
        id: 'focus-mode',
        title: '集中モード（通知/ナビの最小化）',
        status: 'idea',
        detail: `【目的】
・実践中だけ情報量を削り、視線と操作を最小にして“型”に入りやすくする。

【対象】
・朝/夜/阿字観など、数分の画面で有効化できる。

【UI】
・タブ/設定/履歴などのナビを非表示（戻ると復元）。
・文字は大きく、操作は「次へ/終了」程度。
・アニメは遅め・停止しても破綻しない（刺激を増やさない）。

【通知/外乱】
・アプリ内の余計なトーストや達成演出を抑える。
・OS通知の制御は行わない（可能なら“おやすみモード案内”を短く）。

【開始/終了】
・開始前：姿勢/呼吸の一言。
・終了後：余韻カード（短文）→「閉じる」だけ。

【例外】
・バックグラウンド復帰：状態は保持し、再開/終了を選べる。`,
      },
      {
        id: 'ritual-sounds',
        title: '静かな効果音・環境音',
        status: 'idea',
        detail: `【目的】
・無音を基本にしつつ、必要な人にだけ“静かな音の層”を提供する。

【原則】
・初期設定はOFF。
・音は補助。ご利益/効果を断定しない。
・端末の音量・ミュート設定に従う（アプリで無理に上げない）。

【機能】
・プリセット：鈴（短い）、環境音（控えめ）、無音。
・場面別：朝/夜/阿字観で個別設定（ただし選択疲れを避け、初期は共通でもOK）。
・再生：開始/終了の合図だけ、またはループ（将来）。まずは“合図だけ”が安全。

【UI】
・設定画面に「音」セクション。試聴は短く、停止ボタンを明確に。
・イヤホン時の注意を一文で（音量に配慮）。

【例外】
・権限不要（ローカル音源）。
・再生失敗：無音で継続し「音を再生できませんでした」程度。`,
      },
      {
        id: 'offline-pack',
        title: 'オフライン用パック（通信なしで使える）',
        status: 'idea',
        detail: `【目的】
・旅先/電波不安定でも、朝夜の実践と基本の学びが途切れないようにする。

【対象コンテンツ】
・学びカード（テキスト）/用語の短い説明/実践フロー文言。
・音声や大容量画像は別パック（将来）。

【挙動】
・事前DL：Wi-Fi時におすすめ（強制しない）。
・ログは端末内に保存し、オンライン復帰時も自動送信はしない（同期は別機能）。

【UI】
・設定に「オフライン」：容量表示、DL/削除、最終更新日。
・足りない場合は“簡易テキスト”にフォールバックし、エラー文は短く落ち着いて。

【容量/管理】
・パックは小さく（目標：数MB）。
・古いパックは自動整理（ただし削除前に説明を一文表示）。

【例外】
・DL途中中断：再開可能。
・ストレージ不足：容量不足を明示し、削除導線へ。`,
      },
      {
        id: 'smart-reminder',
        title: '学習状況に合わせた通知最適化',
        status: 'idea',
        detail: `【目的】
・生活リズムを壊さず、通知設定の“提案”だけを行う（自動変更しない）。

【前提】
・初期は現行の固定通知でOK。これは“提案レイヤー”。

【提案ロジック（端末内）】
・直近1〜2週間の実践時刻をざっくり集計し、中央値付近を候補にする。
・朝/夜のズレが大きい場合は“提案しない”（当てにいかない）。
・週末だけ調整などは第2段階。

【UI】
・提案はモーダルではなくカード表示（閉じる×あり）。
・候補は最大2つ + 現状維持（選択疲れを避ける）。
・変更は必ずユーザー操作で確定（プレビュー付き）。

【プライバシー】
・集計は端末内のみ。外部送信しない。

【例外】
・データ不足：提案しない。
・通知オフ：まずオンの説明ではなく「今は通知なしで大丈夫」も許容。`,
      },
      {
        id: 'gentle-analytics',
        title: 'やさしい振り返り（可視化）',
        status: 'idea',
        detail: `【目的】
・達成や競争ではなく、“戻れた日”を静かに見返すための可視化。

【表示方針】
・数字（回数/連続）を主役にしない。淡い色・短い言葉。
・空白を欠落扱いしない（ラベルで責めない）。
・洞察は1行だけ（レポート化しない）。

【画面案】
・月/週のカレンダー or 既存ヒートマップの補助ビュー。
・「今週、戻れた日：◯日」程度（強調しすぎない）。
・タップでその日の“朝/夜/選んだ行い”だけを表示（メモは任意）。

【設定】
・完全に非表示にできる（見たくない人を尊重）。

【データ】
・Entry（bodyDone/speechDone/mindDone, actionPick等）を利用（端末内）。`,
      },
      {
        id: 'accessibility-plus',
        title: 'アクセシビリティ強化（文字/音声/操作）',
        status: 'idea',
        detail: `【目的】
・年齢/環境に左右されず、静かに“続けられる”読みやすさと操作性を整える。

【具体項目】
・文字サイズ：数段階 + 行間/字間の調整（読み疲れを減らす）。
・タップ領域：主要ボタンは最小44pt以上、誤タップを減らす。
・読み上げ：見出し・本文の順序を整える（スクリーンリーダー対応）。
・触覚：完了時の小さなフィードバックは任意（OFF可能）。
・配色：コントラストを確保しつつ、刺さりを弱める（“静けさ”優先）。

【UI】
・設定にまとめすぎない：よく使うものだけを上に、詳細は折りたたみ。

【例外】
・OSの“文字を大きく”に追従し、レイアウト崩れ時は自動改行で吸収。`,
      },
      {
        id: 'personalized-path',
        title: 'やさしいパーソナライズ（おすすめの流れ）',
        status: 'idea',
        detail: `【目的】
・“次の一歩”を控えめに提案し、迷いを減らす（強制しない）。

【提案の種類】
・今日まだ朝だけ → 夜を“短く”提案
・口が多く乱れている傾向 → 「言う前に一呼吸」を提案
・途切れ後 → 最小の復帰（夜の45秒だけ）を提案

【透明性】
・なぜ提案したかを一文で示す（ブラックボックスにしない）。
・提案は常にOFFにできる。

【UI】
・Homeのカード1枚で十分。候補は最大2つ。
・押しても“戻る/閉じる”が常に見える。

【データ】
・Entryの集計（週次）を端末内で利用。外部送信なし。`,
      },
      {
        id: 'practice-notes',
        title: '実践メモのテンプレ/プロンプト',
        status: 'idea',
        detail: `【目的】
・夜の一言やメモを“書ける人だけ”のものにせず、負担なく残せる選択肢を作る。

【体験】
・プロンプトは1つだけ（例：「今日、1つ整ったのは何？」）。
・テンプレは選択式（2〜4択）+ 任意自由入力。
・“書かなくても完了”できる（必須にしない）。

【UI】
・夜クローズの最後に「一言（任意）」を折りたたみで配置。
・保存後に見返しはできるが、褒めすぎない/連続を煽らない。

【データ/プライバシー】
・端末内保存が基本。共有導線を置かない（将来も明示的操作のみ）。
・削除/全消去を用意（メモはセンシティブになり得る）。

【例外】
・未入力で保存しない（空文字は保存しない）。`,
      },
      {
        id: 'calendar-view',
        title: 'カレンダー表示（朝/夜の記録）',
        status: 'idea',
        detail: `【目的】
・足跡を“眺める”ための月表示。回数の多さを評価にしない。

【表示】
・1日セルに朝/夜の小さな印（色は淡い）。
・空白はニュートラル（警告色にしない）。
・タップでその日の要素（朝/夜/今日の行い/任意メモ）を静かに表示。

【導線】
・ログ画面のサブタブとして追加（Homeの主役にしない）。
・カレンダー自体を非表示にできる設定を用意。

【データ】
・Entryを日付キーで参照（YYYY-MM-DD）。端末内のみ。

【例外】
・過去日の編集：許可するが“遡り修正”を煽らない文体に。`,
      },
      {
        id: 'sync-cloud',
        title: 'クラウド同期（任意）',
        status: 'idea',
        detail: `【目的】
・端末紛失/機種変更への備えとして、任意のバックアップを提供する（デフォルトOFF）。

【原則】
・同期は“選んだ人だけ”。オンにしなくても困らない設計を維持。
・何が送られ、何が戻るかを短く具体的に説明する。
・暗号化前提（少なくとも転送時/保存時。可能ならE2Eも検討）。

【同期対象（案）】
・設定（通知時間/テーマ/言語）
・Entry（朝/夜ログ）と任意メモ
・学びの既読/ブックマーク

【UI】
・設定に「バックアップ」：ON/OFF、最終バックアップ日時、手動バックアップ。
・復元時：プレビュー（件数/期間）を出し、上書き/統合の選択を明確に。

【例外】
・ネット不安定：自動連打せず、次回に回す。
・ユーザーがオフにしたら停止し、サーバー側削除方針を明記。`,
      },
      {
        id: 'device-handoff',
        title: '端末間引き継ぎ',
        status: 'idea',
        detail: `【目的】
・クラウド同期を使わず（または併用で）、機種変更時に短手順で移行できるようにする。

【方式（案）】
・同一空間でQR/ワンタイムコードを使った転送。
・転送データは暗号化し、コードは短時間で失効。
・“どれを移すか”を選べる（ログ/メモ/設定）。

【UX】
・ステップは最大3つ：旧端末で開始 → 新端末で読み取り → 完了。
・失敗しても元に戻れる（旧端末は何も消さない）。
・完了後に「旧端末のデータはそのままです」一文を表示。

【例外】
・カメラ権限拒否：コード入力にフォールバック。
・転送途中中断：再開可能。`,
      },
      {
        id: 'shareable-cards',
        title: '学びカードの共有（静かな共有）',
        status: 'idea',
        detail: `【目的】
・拡散ではなく“身近な人への1枚共有”を、必要な人にだけ提供する。

【共有の形】
・カードを画像化（タイトル/本文/今日の行いは任意、出典は小さく）。
・共有前に確認画面（プレビュー + 送信先選択）。
・SNS連携の促進はしない（OS共有シートのみ）。

【プライバシー】
・個人ログ（懺悔/発願/回向/メモ）は共有に含めないのがデフォルト。
・共有履歴は残さない（必要ならOS側に任せる）。

【UI】
・カード詳細に「共有」ボタン（控えめ）。
・共有時の注釈文は短く任意（例：「今日、これを覚えておきたい」）。

【例外】
・画像生成失敗：テキスト共有にフォールバック（任意）。`,
      },
      {
        id: 'coach-mode',
        title: '伴走モード（週次チェックイン）',
        status: 'idea',
        detail: `【目的】
・週に一度だけ、評価ではなく“戻るための問い”を置いて伴走感を作る。

【体験】
・質問は1〜2個（30秒で終わる）。
・回答は短文 or 選択式。スキップ可能。
・結果は“助言”ではなく“提案1つ”（例：今週は口を10%だけゆっくり）。

【通知】
・初期OFF。オンでも週1回、時間帯はユーザー指定。
・文言は急かさない（“今週も戻れたら十分”）。

【表示】
・週の入口カード → 質問 → 終了の余韻（短い一文）。

【データ】
・回答は端末内に保存（任意で削除可能）。`,
      },
      {
        id: 'ritual-sets',
        title: '儀礼セット（朝/夜のカスタム）',
        status: 'idea',
        detail: `【目的】
・型を壊さず、体調や状況に合わせて“少しだけ”調整できるようにする。

【カスタム範囲（控えめ）】
・並び替え：身/口/意の順序変更（朝のみ等）。
・一時省略：今日だけ1ステップ省略（“省略してもよい”を明示）。
・おすすめ：初期は1〜2パターン（迷いを増やさない）。

【UI】
・設定に「儀礼セット」：現在の流れを1画面で可視化。
・変更は“プレビュー”を見て確定。戻すボタンを常設。

【例外】
・複雑化を防ぐため、選択肢が増えたら“最近使った2つだけ”を出す。`,
      },
      {
        id: 'ajikan-timer',
        title: '阿字観タイマー（3/5/10分）',
        status: 'idea',
        detail: `【目的】
・初心者が迷わず始められる“短い入口”として、阿字観のための時間枠を提供する。

【プリセット】
・3/5/10分（固定）。カスタム時間は後回し。
・開始前の一言：姿勢→呼吸（10秒程度で読める）。

【実践中UI】
・暗めの背景、最小限（残り時間/停止/終了）。
・呼吸同期アニメは任意（別機能として切り替え可能）。
・通知/バナーなどは出さない（集中モード併用可）。

【終了】
・合図：無音/振動/小さな鈴（設定で選択、初期は無音）。
・終了後：余韻カード → 戻る。

【例外】
・途中停止：停止=失敗にならない文言で終了。
・バックグラウンド：タイマーはOS制約に合わせ、復帰時に状態説明を短く出す。`,
      },
      {
        id: 'learning-courses',
        title: '学びコース（30日/90日）',
        status: 'idea',
        detail: `【目的】
・点在する学びを“章立て”で提示し、今日の一つの行いに落とす流れを作る。

【設計】
・1日1枚（30秒）+ 今日の行い1つ + 夜の問い1つ。
・進行は強制しない（スキップ/後で戻るOK）。
・章の終わりに“まとめ1枚”だけ（長文にしない）。

【UI】
・コース一覧は少数（30日/90日）から。
・今日のカードへワンタップ。迷う導線を増やさない。

【状態】
・既読/現在地は端末内保存。
・再開時は「前回の続き」か「今日」かを選べる（ただし選択肢は2つまで）。`,
      },
      {
        id: 'weekly-review',
        title: '週間レビュー（1分）',
        status: 'idea',
        detail: `【目的】
・週1分の小さな振り返りで、“整えの方向”を見つける。

【質問（例）】
・今週いちばん戻れた瞬間は？
・来週、1つだけ丁寧にするなら 身/口/意 どれ？

【結果の返し方】
・評価しない。提案は1つだけ。
・数字の強調は避ける（“回数”ではなく“傾向”）。

【UI/通知】
・週1回、任意で通知。
・レビューはいつでもスキップ可能。`,
      },
      {
        id: 'bookmarks-search',
        title: 'ブックマーク / 検索',
        status: 'idea',
        detail: `【目的】
・必要な学びに“静かに”戻れるようにする（記憶の補助）。

【ブックマーク】
・星ではなく小さな印（主張しない）。
・一覧は“最近保存した順”が基本。タグは最小限。

【検索】
・入力中に候補が静かに出る（サジェスト）。
・検索履歴はデフォルトで残さない（残すなら明示設定）。

【プライバシー】
・検索語は端末内のみ。外部送信しない。

【例外】
・結果ゼロ：責めない文言で「別の言葉でも探せます」。`,
      },
      {
        id: 'paid-audio',
        title: '音声ガイド / 深掘り教材（有料）',
        status: 'idea',
        detail: `【目的】
・無料の静けさを壊さず、必要な人だけが深掘りできる“選べる教材”を提供する。

【提供形態】
・短い音声ガイド（阿字観/朝/夜）と、深掘り解説（章単位）。
・プレビュー（30〜60秒）を用意し、納得してから購入できる。

【UX】
・購入導線は控えめ（一覧の中に“鍵”程度）。ポップアップ連打しない。
・購入後はオフライン再生/バックグラウンド再生に対応（可能な範囲で）。
・価格/解約/復元は短く明確（迷いを減らす）。

【例外】
・DL失敗：ストリーミング or 再試行。無音でも実践が進むように。`,
      },
      {
        id: 'monk-content',
        title: '僧侶監修コンテンツ',
        status: 'idea',
        detail: `【目的】
・独学の不安を減らし、用語や作法の説明に安心感を足す（権威で煽らない）。

【方針】
・監修は“正しさの保証”ではなく、誤解を減らすための確認として提示。
・監修者紹介は控えめ（肩書きを主役にしない）。
・専門領域（灌頂・口伝等）はアプリ外であることを明示。

【表示】
・カード/用語の末尾に「監修：◯◯（短い注記）」程度。
・根拠/出典方針をセットで示す（透明性）。

【運用】
・誤り報告の窓口（1タップで送れる）を用意。
・更新履歴に“何が変わったか”を短く記載。`,
      },
      {
        id: 'experience-path',
        title: '体験導線（阿字観体験/法話/参拝プラン）',
        status: 'idea',
        detail: `【目的】
・アプリ内実践を中心にしつつ、必要な人にだけ“現実の体験”への扉を静かに用意する。

【体験の作り方】
・ランキング/おすすめ煽りはしない。
・情報は事実中心：場所/時間/予約要否/注意事項/公式リンク。
・アプリ内では道案内までやらず、外部地図へ委ねる。

【フィルタ】
・地域（都道府県）/興味（阿字観/法話/参拝）/所要時間で絞る。
・表示頻度は設定で調整（出しすぎない）。

【注意】
・宗派/寺院差があるため、断定表現を避ける。
・情報の更新日を明示し、誤り報告導線を置く。`,
      },
      {
        id: 'temple-map',
        title: '全国の真言宗のお寺マップ',
        status: 'idea',
        detail: `【目的】
・観光ではなく“参拝・体験の入口”として、真言宗系寺院を静かに探せる。

【表示する情報（最小）】
・寺院名 / 所在地 / 公式サイト / 連絡先 / 拝観可否 / 参拝時間の目安 / 注意事項（撮影・服装など）
・レビュー/★評価は置かない（評価文化を入れない）。

【地図UX】
・現在地から近い順は出しても、ランキング文言は使わない。
・混雑/注意は短く（近隣配慮の一文など）。
・経路案内は外部地図へ。

【位置情報】
・許可は“使う瞬間だけ”求める（常時は基本不要）。
・端末内で処理し、履歴として保持しないのがデフォルト。

【データ更新】
・寺院側が更新申請できる窓口（フォーム）を想定。
・情報更新日を表示し、誤り報告を用意。`,
      },
      {
        id: 'widget',
        title: 'ホームウィジェット',
        status: 'idea',
        detail: `【目的】
・ロック解除後すぐ、静かに“今日の一歩”へ入れる入口を作る。

【表示】
・文言は短い（例：朝3分 / 夜45秒）。
・未/済を強調しすぎない（赤バッジを使わない）。
・色は淡く、端末テーマと調和。

【アクション】
・タップで朝 or 夜へ直行（中間画面を挟まない）。
・長押しで設定（OS標準）に対応できる範囲で。

【更新頻度】
・頻繁な更新でバッテリーを消耗しない（1日数回以内）。
・表示内容は端末内のEntryから計算。

【例外】
・データ未作成：オンボーディング or 朝の入口へ。`,
      },
      {
        id: 'reminder-flex',
        title: '通知の柔軟な時間設定',
        status: 'idea',
        detail: `【目的】
・生活リズムに合わせて“曜日別/週末別”に通知時刻を調整できるようにする。

【UI】
・1画面で完結：曜日列 + 時刻 + ON/OFF。
・プレビュー（例：次に鳴るのは◯曜◯時）で誤設定を防ぐ。
・複雑化防止：パターンは最大2つ（平日/休日）から開始。

【仕様】
・深夜帯は提案しない（設定は可能でも注意を一文）。
・変更は即反映、戻す導線を常設。

【例外】
・通知権限なし：設定画面で案内し、OS設定へリンク（可能なら）。`,
      },
      {
        id: 'silent-retreat',
        title: '沈黙リトリート（一定時間だけ静かなUI）',
        status: 'idea',
        detail: `【目的】
・一定時間、余計な情報を減らし“沈黙の時間枠”を支える（選べる体験）。

【開始】
・時間選択（例：5/10/20/30分）。カスタムは後日。
・開始前に短い注意（途中終了OK、通知はOS依存）。

【実行中UI】
・暗い背景 + 余白 + 残り時間だけ。
・ナビ/設定は隠す。退出は常に可能（罪悪感を作らない文言）。

【終了】
・合図は無音/振動/小さな鈴から選択（初期は無音）。
・終了後：短い一文 + 戻る。

【例外】
・中断/電話：復帰時に再開/終了を選べる。`,
      },
      {
        id: 'mantra-counter',
        title: '真言カウンター（数唱/振動）',
        status: 'idea',
        detail: `【目的】
・数唱のための“道具”として、注意を散らさずに回数を数えられるようにする。

【UI】
・大きな数字 + 最小限の操作（+1 / -1 / リセット）。
・画面ロック防止は任意（バッテリー配慮）。

【操作】
・タップで+1、長押しで連打はしない（誤作動防止）。
・触覚（振動）はON/OFF。音は基本なし。

【保存】
・途中状態は自動保存（その日/そのセッション単位）。
・達成バッジ等は作らない（競争を生まない）。

【例外】
・誤タップ：取り消しボタンを常設。`,
      },
      {
        id: 'breath-sync',
        title: '呼吸同期アニメ（3分の整え）',
        status: 'idea',
        detail: `【目的】
・短時間で呼吸に戻るための視覚ガイド（刺激を増やさない）。

【仕様】
・3分固定（まずは1つだけ）。
・動きはゆっくり、明暗差を小さく、点滅なし。
・音は基本なし（必要なら別機能の環境音を併用）。

【UI】
・開始/停止/終了のみ。途中終了OK。
・終了後は朝/夜へ直行できる導線を1つだけ。

【アクセシビリティ】
・アニメOFFでも機能する（“文字ガイド”にフォールバック）。

【例外】
・低電力モード等でアニメが滑らかでない場合、静止表示に切替。`,
      },
      {
        id: 'mandala-view',
        title: '曼荼羅ビュー（静かな鑑賞/拡大）',
        status: 'idea',
        detail: `【目的】
・“学ぶ”より先に、静かに“眺める”ためのビューを用意する（鑑賞/観想の入口）。

【体験】
・説明は控えめ（最初は導入1行）。
・ズーム/パンは慣性を弱め、急な動きにしない。
・追加解説は折りたたみ（必要な人だけ）。

【データ】
・画像は軽量・オフライン対応を意識（別パックにしてもよい）。

【注意】
・宗教的解釈を断定しない（“こう言われることがある”程度）。
・画像の出典/権利を明示（アプリ内リンクまたは情報画面）。`,
      },
      {
        id: 'voice-note',
        title: '音声で夜のひと言（自動文字起こし）',
        status: 'idea',
        detail: `【目的】
・書くのが難しい日でも、夜の一言を“短く”残せるようにする。

【仕様】
・録音は最大30〜60秒（短く終わる）。
・開始/停止はワンタップ。再生も任意。
・文字起こしは端末内処理が基本（外部送信しない方針）。

【編集】
・誤変換の修正は最小手数（テキスト編集 + 保存）。
・音声データは「保存しない（文字だけ残す）」をデフォルトにできる。

【プライバシー】
・音声/テキストの削除、全消去を用意。
・外部送信が必要な方式を採る場合は同意を明示（将来）。

【例外】
・文字起こし不可：音声のみ保存 or 破棄を選べる。`,
      },
      {
        id: 'seasonal-rituals',
        title: '年中行事カレンダー（静かな案内）',
        status: 'idea',
        detail: `【目的】
・季節の節目を“静かな合図”として提示し、日常実践のきっかけにする。

【表示】
・行事名 + 一言説明 + 今日の一つの行い（任意）。
・地域差/宗派差があるため、断定表現を避ける。
・通知は初期OFF。オンでも頻度は控えめ。

【フィルタ】
・地域（都道府県）/興味/表示量（少/標準）を設定できる。

【出典/更新】
・各行事に出典ID/参照元を持たせる。
・更新日を表示し、誤り報告導線を用意。`,
      },
      {
        id: 'altar-mode',
        title: '小さなお仏壇モード（一枚絵と合掌）',
        status: 'idea',
        detail: `【目的】
・必要な人にだけ、“手を合わせる入口”を最小UIで提供する。

【UI】
・一枚絵 + 余白 + 「はじめる/おわる」だけ。
・説明は短い（合掌の姿勢/一礼などを一文）。
・音/振動は任意（初期は無音）。

【体験の扱い】
・行った/行わないを評価しない。
・頻度を煽らない。Homeに固定導線を置かない（設定から開始でも良い）。

【例外】
・画像ロード失敗：無地背景 + テキストのみで継続。`,
      },
      {
        id: 'quiet-share',
        title: '一日一句の静かな共有（外部へ出さない）',
        status: 'idea',
        detail: `【目的】
・外に出すためではなく、“自分のために残す一句”として短い言葉を記録できるようにする。

【仕様】
・保存は端末内のみが基本。
・1日1件まで（増やして溺れない）。
・一覧は日付順。比較/ランキングはなし。

【入力】
・自作でも、学びカードから“引用”でもよい（ただし著作権/出典表示は別途方針）。
・編集/削除を常に可能にする。

【共有（もしするなら将来）】
・外部共有はデフォルトOFFで、明示操作のみ。`,
      },
      {
        id: 'history',
        title: '365日ヒートマップ',
        status: 'done',
        detail: `【現行機能の仕様（再整理）】
・365日の足跡を淡い色で表示し、競争や達成圧を避ける。
・色の濃淡は“戻れた日”の感覚を支えるため。回数の数字は主役にしない。
・空白は欠落ではなく余白として扱い、責める文言を使わない。
・タップ/長押しでその日の詳細（朝/夜/今日の行い/任意メモ）を静かに表示。
・表示は軽量にし、スクロールの滑らかさを優先する。`,
      },
      {
        id: 'theme',
        title: 'テーマ切替（ライト/ダーク）',
        status: 'done',
        detail: `【現行機能の仕様（再整理）】
・ライト/ダーク/システム追従を選択できる。
・変更は即時反映され、戻す導線も明確（迷わせない）。
・コントラストは強すぎず、読みやすさと静けさの両立を優先。
・朝夜どちらでも目が疲れにくい配色を目指す。`,
      },
      {
        id: 'language',
        title: '言語切替',
        status: 'done',
        detail: `【現行機能の仕様（再整理）】
・日本語/英語を切り替え可能。
・画面構成は言語で変えず、迷いを生まない。
・翻訳は“意味の正確さ”だけでなく“静かな文体”を保つ（断定しない/責めない）。
・一部画面は再表示で反映される場合があるため、説明は短く丁寧に行う。`,
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
        detail: `Purpose
- Offer a quiet way to support the app without adding ads or noisy prompts.

Principles
- Never imply “you should pay now.” Keep it subtle and optional.
- No disadvantages for people who do not support. Say it clearly.
- Keep language modest. Do not promise outcomes or benefits.

Flow
- Place it deep in Settings / About (not as a primary home banner).
- One-screen flow: choose amount (3–5 presets) → confirm → done.
- “How funds are used” is a gentle disclosure (optional read).

Specs
- One-time only for MVP. Subscriptions can come later.
- After completion: a short quiet line and a clear back button. No sharing, no streaks.

Errors
- Payment failed: calm, non-blaming message, offer retry.
- Network issues: do not auto-retry aggressively.

Privacy
- Do not show “total donated” as a status symbol inside the app.`,
      },
      {
        id: 'friends',
        title: 'Connect with friends (small community)',
        status: 'idea',
        detail: `Purpose
- A small, invitation-only circle for gentle presence, not a public social feed.

Not included (by design)
- No timeline, no likes economy, no rankings, no streak/score comparisons.
- No public discovery or follower culture.

Core experience
- A tiny daily “I returned” stamp (morning/night) and an optional short note.
- Reactions are lightweight (one stamp or very short text). No reply pressure.
- Notifications are off by default.

Flow
- Settings → Small Circle: create / invite / join.
- Invite via link or QR with expiration. Explain visibility before joining.
- Pause/leave options are always visible and easy.

Data
- Share the minimum: date + returned flag + optional short note.
- Never share sensitive personal logs by default (confession/vow/dedication/notes).

Safety
- Mute/report tools as a baseline. Keep messaging short and calm.`,
      },
      {
        id: 'guided-onboarding',
        title: 'Guided onboarding (short intro)',
        status: 'idea',
        detail: `Purpose
- Reduce first-run confusion and set the tone: short, calm, return-friendly.

Structure (3 cards)
1) What this app is: a daily entry point for Body/Speech/Mind
2) Morning and night flow: small rituals, minimal time
3) Gaps are OK: returning matters more than streaks

UX
- Skippable from the start, re-openable later in Settings.
- Each card is short and readable with screen readers.
- End with one clear next step (e.g., “Try the 1-minute morning entry”).

State
- Store “seen” locally and re-show only when content meaningfully changes.`,
      },
      {
        id: 'streak-free-nudge',
        title: 'Gentle return flows (no guilt)',
        status: 'idea',
        detail: `Purpose
- Help users return after gaps without guilt or achievement pressure.

Experience
- No streaks, no badges, no scolding language.
- Offer one tiny suggestion: “today, one small step.”

Rules
- Keep prompts subtle (one card), dismissible, and not repeated aggressively.
- Do not rely only on notifications; provide an in-app return entry.

Local logic
- Detect gaps using local dates and recent entries.
- Suggest the smallest action, often the opposite slot (if only nights were done, suggest a tiny morning step).`,
      },
      {
        id: 'focus-mode',
        title: 'Focus mode (minimal distractions)',
        status: 'idea',
        detail: `Purpose
- Reduce information density during practice so attention can settle.

UI
- Temporarily hide navigation and extra controls.
- Large text, calm background, minimal motion.

Behavior
- Suppress in-app celebratory effects/toasts during the session.
- Start: one short line (posture/breath). End: a gentle afterglow + back.

Edge cases
- If interrupted, allow resume or end without guilt.`,
      },
      {
        id: 'ritual-sounds',
        title: 'Subtle ritual sounds/ambience',
        status: 'idea',
        detail: `Purpose
- Offer optional subtle sounds while keeping silence as the default.

Rules
- Default OFF. Follow device volume and mute settings.
- No claims about outcomes. Sounds are only supportive.

Specs
- Presets: short bell cue / gentle ambience / silence.
- Optional per-context settings (morning/night/ajikan) with minimal complexity.

Errors
- If playback fails, continue silently and show a short calm note.`,
      },
      {
        id: 'offline-pack',
        title: 'Offline packs (no connection needed)',
        status: 'idea',
        detail: `Purpose
- Keep core practice and basic learning available without internet.

Content scope
- Text-based learning cards, key terms, practice prompts.
- Large assets (audio/images) can be separate later.

Behavior
- Pre-download is optional (recommend on Wi-Fi).
- Logs remain local; no auto-upload.

UI
- Settings → Offline: size, download/remove, last updated.

Edge cases
- Download interruption: resumable.
- Low storage: clear guidance and removal options.`,
      },
      {
        id: 'smart-reminder',
        title: 'Adaptive reminders by practice',
        status: 'idea',
        detail: `Purpose
- Suggest better reminder times without auto-changing user settings.

Logic (on-device)
- Use recent practice timestamps to propose 1–2 candidate times.
- If data is sparse or inconsistent, do not propose.

UX
- Show as a dismissible card, not a blocking modal.
- Offer: candidate A / candidate B / keep current.

Privacy
- All calculations stay on device.`,
      },
      {
        id: 'gentle-analytics',
        title: 'Gentle reflection insights',
        status: 'idea',
        detail: `Purpose
- A calm reflection view that highlights “returned days,” not performance.

Design
- Muted colors, no harsh empty-state language.
- One-line insight only. Avoid reports and over-analysis.
- Fully hideable if it doesn’t help.

Data
- Use local entries only; no external sending.`,
      },
      {
        id: 'accessibility-plus',
        title: 'Accessibility upgrades (text/voice/controls)',
        status: 'idea',
        detail: `Purpose
- Make the app comfortable across ages, lighting, and abilities.

Features
- Text size steps and generous spacing.
- Large tap targets, fewer accidental taps.
- Screen reader-friendly reading order.
- Optional haptics and careful contrast.

UX
- Keep settings simple; advanced options are folded away.`,
      },
      {
        id: 'personalized-path',
        title: 'Soft personalization (suggested flow)',
        status: 'idea',
        detail: `Purpose
- Reduce “what should I do next?” friction with gentle suggestions.

Suggestions
- If only morning is done, softly propose a tiny night close.
- If one area tends to be uneven, suggest one small corrective action.

Transparency
- Explain why in one short sentence.
- Always allow turning suggestions off.

Privacy
- On-device only. No external profiling.`,
      },
      {
        id: 'practice-notes',
        title: 'Practice notes templates/prompts',
        status: 'idea',
        detail: `Purpose
- Make night notes possible without turning them into a burden.

Experience
- One prompt, optional templates (2–4 choices), plus free text.
- Completion must not require writing.

Privacy
- Local storage by default. Easy delete and full wipe.

Rules
- Do not celebrate or gamify note-taking.`,
      },
      {
        id: 'calendar-view',
        title: 'Calendar view (morning/night logs)',
        status: 'idea',
        detail: `Purpose
- Let users quietly “see the rhythm” without turning it into a score.

UI
- Muted marks for morning/night, neutral empty days.
- Tap for small details (slot + chosen action + optional note).
- Hideable if distracting.

Data
- Local date-keyed entries only.`,
      },
      {
        id: 'sync-cloud',
        title: 'Optional cloud sync',
        status: 'idea',
        detail: `Purpose
- Optional backup for device loss. Default OFF.

Principles
- Clear consent and plain explanation: what is uploaded/restored.
- Encryption required (in transit and at rest; consider E2E).

Scope (proposal)
- Settings, entries, reading progress/bookmarks.

UX
- Settings → Backup: on/off, last backup time, manual backup.
- Restore preview with clear merge/overwrite choices.`,
      },
      {
        id: 'device-handoff',
        title: 'Device handoff',
        status: 'idea',
        detail: `Purpose
- Simple transfer during device change, without relying on cloud.

Method
- QR or one-time code, short expiration, encrypted payload.
- User chooses what to transfer (logs/notes/settings).

Flow
- Old device start → new device scan → done.
- Old device is unchanged unless the user decides.`,
      },
      {
        id: 'shareable-cards',
        title: 'Shareable learning cards (quiet sharing)',
        status: 'idea',
        detail: `Purpose
- Share one learning card quietly with close people, not as broadcast content.

Sharing
- Render as an image with short text. Use OS share sheet only.
- Confirm screen with preview and destination choice.

Privacy
- Never include personal logs by default.
- Do not keep share history inside the app.`,
      },
      {
        id: 'coach-mode',
        title: 'Companion mode (weekly check-in)',
        status: 'idea',
        detail: `Purpose
- A weekly check-in that helps returning, not judging.

Experience
- 1–2 short questions, optional answers, skippable.
- Output is one gentle suggestion for next week.

Notifications
- Off by default, weekly at a user-chosen time.`,
      },
      {
        id: 'ritual-sets',
        title: 'Ritual sets (custom morning/night)',
        status: 'idea',
        detail: `Purpose
- Allow light customization without breaking the ritual structure.

Allowed changes
- Reorder steps, temporary skip of one step for “today only.”
- Offer 1–2 suggested sets to avoid choice overload.

UX
- One-screen preview and a clear “reset to default” button.`,
      },
      {
        id: 'ajikan-timer',
        title: 'Ajikan timer (3/5/10 min)',
        status: 'idea',
        detail: `Purpose
- A beginner-friendly timebox for Ajikan as a small entry point.

Presets
- 3/5/10 minutes only for MVP.

Session UI
- Dark calm screen, minimal controls.
- Optional end cue: silent / vibration / small bell (default silent).

Edge cases
- Stop anytime without guilt.
- Handle background limits with a clear, short status note on return.`,
      },
      {
        id: 'learning-courses',
        title: 'Learning courses (30/90 day)',
        status: 'idea',
        detail: `Purpose
- Provide a gentle sequence so learning doesn’t feel scattered.

Structure
- One small card per day + one action + one question.
- Skippable, resumable; no forced pace.

UX
- Keep course choices few (30/90). Direct entry to today’s card.
- Summaries are short, not achievement-focused.`,
      },
      {
        id: 'weekly-review',
        title: 'Weekly review (1 min)',
        status: 'idea',
        detail: `Purpose
- A one-minute weekly reflection to find a calm direction.

Flow
- Two short questions, optional answers.
- One simple suggestion back, no scoring.

UX
- Quiet, skippable, offered once per week at most.`,
      },
      {
        id: 'bookmarks-search',
        title: 'Bookmarks / search',
        status: 'idea',
        detail: `Purpose
- Help users return to needed learning quickly and quietly.

Bookmarks
- A small mark, not a loud star. Simple list ordering.

Search
- Gentle suggestions as you type. Minimal or no search history by default.

Privacy
- Queries stay on device.`,
      },
      {
        id: 'paid-audio',
        title: 'Audio guide / deep-dive content (paid)',
        status: 'idea',
        detail: `Purpose
- Optional deeper materials without disturbing the free quiet flow.

UX
- Subtle paywall. Provide short previews to decide without pressure.
- Clear pricing, cancellation, restore.

Playback
- Support offline downloads and background playback where feasible.

Failures
- If download fails, allow retry or fallback to streaming when possible.`,
      },
      {
        id: 'monk-content',
        title: 'Monk-supervised content',
        status: 'idea',
        detail: `Purpose
- Reduce misunderstanding anxiety with careful supervision, without authority-based pressure.

Principles
- Present supervision modestly, focusing on practice clarity.
- Avoid claiming “absolute correctness.” Keep boundaries clear (advanced rites are out of scope).

Ops
- Show update notes briefly, add a simple “report an issue” path.`,
      },
      {
        id: 'experience-path',
        title: 'Experience paths (Ajikan trial, dharma talk, temple visit)',
        status: 'idea',
        detail: `Purpose
- Offer an optional door to real-world experiences while keeping in-app practice central.

Presentation
- No rankings or hype. Keep it factual: time, booking, etiquette, official links.

Controls
- Region and interest filters, plus frequency control so it doesn’t appear too often.

Quality
- Show last-updated date and provide a correction/report option.`,
      },
      {
        id: 'temple-map',
        title: 'Nationwide Shingon temples map',
        status: 'idea',
        detail: `Purpose
- A quiet directory map for Shingon-related temples as a respectful entry point.

Information (minimal)
- Name, address, official site, contact, hours/visit rules, etiquette notes.
- No reviews or star ratings.

Location
- Ask permission only when needed. Process locally. Don’t store location history by default.

Accuracy
- Show last-updated date and allow corrections; consider a temple-side update channel.`,
      },
      {
        id: 'widget',
        title: 'Home widget',
        status: 'idea',
        detail: `Purpose
- A calm one-tap entry to practice from the home screen.

UI
- Short wording, muted appearance, no urgent badges.
- Tap opens morning or night directly.

Performance
- Low update frequency to save battery.
- Uses local entry state to compute display.`,
      },
      {
        id: 'reminder-flex',
        title: 'Flexible reminder times',
        status: 'idea',
        detail: `Purpose
- Let users set reminder times by weekday/weekend without complexity.

UI
- One-screen setup with a clear preview of next triggers.
- On/off stays one tap. Keep patterns small (weekday/weekend first).

Behavior
- Avoid suggesting late-night times. Changes are reversible instantly.`,
      },
      {
        id: 'silent-retreat',
        title: 'Silent retreat (quiet UI timebox)',
        status: 'idea',
        detail: `Purpose
- A timeboxed quiet mode that reduces UI noise for stillness.

Flow
- Choose duration (5/10/20/30). Start with a short “you can exit anytime” note.
- During: minimal screen + remaining time. Exit always available.

End
- Optional gentle cue (default silent) and a short return line.`,
      },
      {
        id: 'mantra-counter',
        title: 'Mantra counter (count + haptics)',
        status: 'idea',
        detail: `Purpose
- A simple tool to count recitation without distraction.

UI
- Large number, minimal buttons (+1 / undo / reset).
- Optional haptics, silent by default.

Rules
- Save session state quietly. No badges or competitiveness.`,
      },
      {
        id: 'breath-sync',
        title: 'Breath sync animation (3-minute align)',
        status: 'idea',
        detail: `Purpose
- A subtle visual guide to return to breath in a short session.

Specs
- 3 minutes fixed for MVP. No flashing, low stimulation.
- Works even when animation is off (text-only fallback).

Flow
- Start/stop/end only. After end, offer a single next step (morning/night).`,
      },
      {
        id: 'mandala-view',
        title: 'Mandala view (quiet focus / zoom)',
        status: 'idea',
        detail: `Purpose
- A calm viewer for contemplation, emphasizing seeing over explaining.

UX
- Minimal intro line, gentle zoom/pan, extra notes behind a fold.

Care
- Avoid definitive interpretations. Provide source/rights information.`,
      },
      {
        id: 'voice-note',
        title: 'Voice night note (auto transcription)',
        status: 'idea',
        detail: `Purpose
- Enable a short night note when typing is hard.

Specs
- 30–60s recording, one-tap start/stop.
- On-device transcription by default. Easy text edits.
- Default can be “keep text, discard audio.”

Privacy
- Clear delete and full wipe options. Explicit consent if any cloud processing is ever used.`,
      },
      {
        id: 'seasonal-rituals',
        title: 'Seasonal rituals calendar (quiet prompts)',
        status: 'idea',
        detail: `Purpose
- Offer gentle seasonal prompts without loud celebration.

Content
- Event name + short note + optional “one small action.”
- Respect regional/sect differences; avoid absolute claims.

Controls
- Region filters and display density. Notifications off by default.

Quality
- Track sources and last-updated date; provide a report path.`,
      },
      {
        id: 'altar-mode',
        title: 'Tiny altar mode (single image + bow)',
        status: 'idea',
        detail: `Purpose
- A minimal “bow” entry for those who want it, without pushing it to everyone.

UI
- Single image + blank space + start/end only.
- Optional sound/haptics, default silent.

Resilience
- If image fails, fall back to a plain background and text.`,
      },
      {
        id: 'quiet-share',
        title: 'One-line quiet sharing (private-first)',
        status: 'idea',
        detail: `Purpose
- Keep a daily one-line phrase primarily for the user, as a private record.

Specs
- Local-only by default. One per day to avoid overload.
- Simple list by date; no comparison features.

Sharing (future)
- Off by default and only via explicit user action.`,
      },
      {
        id: 'history',
        title: '365-day heatmap',
        status: 'done',
        detail: `Current behavior
- Shows 365-day footprints in soft colors without turning it into a score.
- Treats gaps as space, not failure.
- Tap/long-press reveals small details without forcing deep dives.
- Performance and smooth scrolling are prioritized.`,
      },
      {
        id: 'theme',
        title: 'Theme toggle (light/dark)',
        status: 'done',
        detail: `Current behavior
- Light/dark/system themes apply immediately and are easy to revert.
- Tuned for readability without harsh contrast, supporting calm practice.`,
      },
      {
        id: 'language',
        title: 'Language switcher',
        status: 'done',
        detail: `Current behavior
- Switches Japanese/English while keeping layout consistent.
- Translation aims for meaning + a gentle, non-judgmental tone.
- When a refresh is needed, the explanation is short and calm.`,
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
