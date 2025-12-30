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
        detail:
          '広告や通知を増やさずに静けさを守るための、小さな支援窓口として想定しています。画面の奥にそっと置き、普段は意識しなくてよい場所にする。支援は金額も頻度も自由で、続けてほしい気持ちが芽生えた時にだけ使える。収益の使い道は短い文章で透明にし、更新の背景を理解できるようにする。促しは最小限で、支援しないユーザーに不利益がないことを明記する。ありがとうの言葉も控えめに、静かな余韻で終わる体験にする。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'friends',
        title: '友達とつながる（小さなコミュニティ）',
        status: 'idea',
        detail:
          '数人までの小さな輪を想定し、公開の場ではなく静かな相互見守りに寄せます。タイムラインのような流れは持たず、短いスタンプや一言だけを置ける程度にする。比較や競争を避けるため、回数や連続日数は見せない。代わりに、今日も戻れたことをねぎらうような小さな通知だけを許す。つながりは招待制で、いつでも一時停止や退出ができる。相手の負担にならない設計として、応答を求める機能は極力入れない。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'guided-onboarding',
        title: 'はじめてガイド（短い導入）',
        status: 'idea',
        detail:
          '初回起動時の3枚程度の短い導入で、アプリの価値観と使い方を伝える想定です。一枚目は三密の要点、二枚目は朝と夜の流れ、三枚目は途切れても戻れること。文章は短く、手を動かす前に心が整うような言葉を選ぶ。スキップは最初から用意し、押しつけない姿勢を保つ。読み終えたあとに小さな実践へ自然に移動し、難しい選択を要求しない。後からも設定内で読み返せるようにして、迷子を減らす。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'streak-free-nudge',
        title: 'やさしい復帰導線（空白を責めない）',
        status: 'idea',
        detail:
          '空白があっても戻れることを最優先にした復帰導線です。連続記録やバッジは使わず、戻ってきた瞬間を優しく迎える文体にする。例えば、前回の実践から日数が空いていても、短い一言だけで再開できる。戻る導線は通知だけに頼らず、ホームや学びの入口にさりげなく置く。反省を強いるのではなく、今日の一歩を軽く示す提案型にする。積み上げよりも回帰を尊重する、アプリの哲学を体験として伝える。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'focus-mode',
        title: '集中モード（通知/ナビの最小化）',
        status: 'idea',
        detail:
          '実践の数分間だけ、画面の情報量を最小限にするモードです。タブや設定などのナビを一時的に隠し、視線を散らさない。表示は大きな文字と静かな背景だけにし、手の動きも最小で済むようにする。終了時には軽い余韻を残し、次の画面へ慌てず戻れるようにする。通知は一時停止し、外の音に邪魔されないよう配慮する。使うかどうかは任意で、通常の流れもそのまま残す。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'ritual-sounds',
        title: '静かな効果音・環境音',
        status: 'idea',
        detail:
          '鈴や環境音など、静かな音の層を選べる機能を想定しています。音はあくまで補助で、無音が基本。初期設定ではオフにする。一度選んだ音は朝夜で記憶し、毎回選ばなくて済むようにする。ボリュームは端末設定に従い、アプリ側で無理に制御しない。イヤホン利用時だけ強く感じないよう、繊細なミックスを前提にする。音の説明は短く、情緒を言葉で補うより体験で伝える。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'offline-pack',
        title: 'オフライン用パック（通信なしで使える）',
        status: 'idea',
        detail:
          '通信が不安定でも朝夜の実践と学びが途切れないようにするための機能です。事前に小さなパックをダウンロードし、端末内だけで完結する。学びカードや簡単な用語はオフラインで参照でき、ログはローカルに保存する。同期は後からでもよく、オンライン復帰時に控えめに確認する。データの容量は軽く保ち、古いパックは自動整理できるようにする。旅先や夜の静かな時間でも、安心して使えることを目指す。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'smart-reminder',
        title: '学習状況に合わせた通知最適化',
        status: 'idea',
        detail:
          '生活リズムに合わせた通知の提案を行う構想です。直近の実践時間を軽く観測し、朝は少し早め、夜は少し遅めなど柔らかな提案にする。変更は必ずユーザーが選び、押しつけや自動変更はしない。提案が不要な人には完全にオフにできるようにする。週末だけ時間をずらす、といった小さな柔軟性も視野に入れる。目的は行動の強制ではなく、静かな習慣の後押しに限定する。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'gentle-analytics',
        title: 'やさしい振り返り（可視化）',
        status: 'idea',
        detail:
          '数字の達成や競争ではなく、戻ってこれた日をそっと可視化する設計です。グラフは淡い色で、空白の扱いも責めない言葉にする。例えば、今月は何回できたかより、どの日に戻れたかを短い文で示す。長文の分析は置かず、たった一行の気づきで十分という思想を守る。振り返りは任意で、見たくない人には完全に隠せるようにする。アプリの静けさを壊さない、控えめな指標に留める。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'accessibility-plus',
        title: 'アクセシビリティ強化（文字/音声/操作）',
        status: 'idea',
        detail:
          '文字や操作の負担を減らし、誰でも使いやすい状態を整える計画です。文字サイズは数段階で選べ、行間も広めにできるようにする。読み上げや触覚フィードバックを強化し、視覚に頼らない操作を支える。ボタンのタップ領域は大きめに設計し、誤タップを減らす。高齢の方や暗い場所でも読みやすい配色の調整も入れる。これらの設定は一つの画面にまとめず、必要な時だけ触れる導線にする。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'personalized-path',
        title: 'やさしいパーソナライズ（おすすめの流れ）',
        status: 'idea',
        detail:
          'ユーザーの状態に合わせて、次の一歩を控えめに提案する機能です。今日は朝だけだったなら、夜の短い導線をやさしく示す程度にする。推薦は一択ではなく、候補を少しだけ見せ、最終選択は本人に委ねる。提案を出す理由は短い言葉で説明し、不透明な最適化にしない。設定で提案を完全にオフにできるようにし、強制感を排除する。過度な最適化より、静かな伴走感を優先する。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'practice-notes',
        title: '実践メモのテンプレ/プロンプト',
        status: 'idea',
        detail:
          '夜のひと言や実践メモを、書きやすくするための小さな仕掛けです。例えば、今日は何が一つだけ整ったかを問う短いプロンプトを提示する。選択式のテンプレも用意し、文字が苦手な人は数タップで終われる。自由入力は常に残し、テンプレに縛られないようにする。保存したメモは端末内だけに置き、外部共有を前提としない。書けた日を誇るのではなく、書かなくても良い空気を守る。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'calendar-view',
        title: 'カレンダー表示（朝/夜の記録）',
        status: 'idea',
        detail:
          '朝夜の実践を月単位で眺められるカレンダー表示を想定しています。色は淡く、回数の多さを強調しない配色にする。その日のメモや一言があれば、タップで静かに見返せる。空白の日には戻る導線を置くが、責める文体は避ける。週や月のまとめは簡潔にし、数字よりも足跡の感覚を優先する。カレンダーは任意表示で、見たくない人には隠せるようにする。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'sync-cloud',
        title: 'クラウド同期（任意）',
        status: 'idea',
        detail:
          '端末を失くした時のための、任意バックアップとして設計します。同期はオンにした人だけで、デフォルトはオフにする。内容は暗号化し、本人以外が読めないようにするのが前提です。同期頻度は控えめにし、バッテリーや通信に負担をかけない。復元時には、どのデータが戻るかを短く丁寧に説明する。ログの外部送信に敏感な人への配慮として、透明性を最重視する。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'device-handoff',
        title: '端末間引き継ぎ',
        status: 'idea',
        detail:
          '機種変更時に、朝夜のログや設定を簡単に移せる仕組みを想定しています。手順は数ステップだけにし、必要な情報だけを選んで移せるようにする。端末間移行は暗号化された一時コードやQRで行い、外部サーバーを通さずに済む形も検討する。移行後は旧端末のデータ削除を自動では行わず、ユーザーが判断できるようにする。失敗時の復帰導線も用意し、不安を最小にする。静かなアプリ体験を壊さない、落ち着いた手続きにする。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'shareable-cards',
        title: '学びカードの共有（静かな共有）',
        status: 'idea',
        detail:
          '学びカードを一枚だけ、静かに共有できる機能を想定しています。共有は拡散ではなく、身近な人との小さな共感を目的にする。画像化したカードを送れる程度で、SNS連携を前提としない。共有時には短い注釈として、この言葉が今日の自分を整えたことだけを添える。公開範囲や保存先はユーザーが選び、デフォルトは非公開にする。共有しない人でも、学びの保存として使えるようにする。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'coach-mode',
        title: '伴走モード（週次チェックイン）',
        status: 'idea',
        detail:
          '週に一度だけのチェックインで、伴走感をつくるモードです。評価や採点は行わず、短い問いと呼吸の提案だけを置く。例えば、今週一番静かだった瞬間を思い出す、といった内省中心の設計。回答は数十秒で終えられるようにして、負担を増やさない。チェックインの日は通知でやさしく示すが、逃げ道も残す。続けるというより戻るための伴走に位置づける。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'ritual-sets',
        title: '儀礼セット（朝/夜のカスタム）',
        status: 'idea',
        detail:
          '朝夜の流れを、少しだけ自分に合わせられる機能を想定しています。手順の順番を入れ替えたり、今日だけ省略を選べる程度に留める。変えすぎると儀礼感が薄れるため、変更範囲は控えめにする。おすすめのセットも用意するが、選択は押しつけない。設定画面はシンプルにし、迷わず戻れる導線を用意する。その日の状態に合わせて柔らかく整えることが目的。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'ajikan-timer',
        title: '阿字観タイマー（3/5/10分）',
        status: 'idea',
        detail:
          '阿字観のための短いタイマーを用意し、導入の言葉だけを添える設計です。3分、5分、10分の三種類を基本にし、余計な設定を減らす。画面は暗く、呼吸に合わせたゆっくりした動きを使うことも検討する。開始前には姿勢と呼吸の一言だけを表示し、実践中は静かにする。終了時は音や振動を選べ、無音でも分かる表示を用意する。初心者でも迷わず始められる入口として位置づける。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'learning-courses',
        title: '学びコース（30日/90日）',
        status: 'idea',
        detail:
          '30日や90日の小さな章立てで、学びの流れを提示する構想です。進行は強制せず、今日できる一つだけを提示する設計にする。途中で止まっても、再開時に責める言葉は使わない。章ごとに短いまとめを入れ、達成より理解の静けさを重視する。コースは複数あっても、一覧は簡潔にし、迷いを減らす。自分のペースで続けられる学びの土台を目指す。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'weekly-review',
        title: '週間レビュー（1分）',
        status: 'idea',
        detail:
          '1分だけの週間レビューで、心を落ち着けて振り返る時間を作る計画です。質問は二つ程度に絞り、長く考えなくても答えられるようにする。回答は短文か選択式にし、書けない日はスキップできる。レビューの結果は評価ではなく、次の一歩の提案として返す。続けるための圧ではなく、戻るための余白を提供する。静かな儀式として週に一度だけの体験にする。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'bookmarks-search',
        title: 'ブックマーク / 検索',
        status: 'idea',
        detail:
          '学びカードや用語を、必要な時にすぐ探せるための機能です。検索は軽く、入力途中から候補が静かに並ぶ程度に留める。ブックマークは星ではなく、小さな印のような扱いにして派手さを避ける。タグは最小限にし、複雑な分類を作らない。検索履歴も控えめに扱い、プライバシーへの配慮を重視する。探しやすさと静けさのバランスを保つことが目的。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'paid-audio',
        title: '音声ガイド / 深掘り教材（有料）',
        status: 'idea',
        detail:
          '音声ガイドや深掘り教材を有料で提供する構想です。無料体験の静けさを壊さないよう、有料導線は目立たせすぎない。サンプルは短く用意し、価値観や内容を理解してから選べるようにする。購入後はオフライン再生やバックグラウンド再生に対応する。料金や解約は分かりやすく、迷いを生まない説明にする。支援と学びの循環として、穏やかな形を目指す。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'monk-content',
        title: '僧侶監修コンテンツ',
        status: 'idea',
        detail:
          '僧侶監修のコンテンツで、安心感と信頼を補強する計画です。専門用語は噛み砕き、現代の生活に近い言葉で説明する。監修者の紹介は控えめにし、権威よりも実践の価値を伝える。監修内容は定期的に見直し、偏りが出ないようにする。利用者の質問や違和感に耳を傾ける導線も検討する。静かな学びの土台として、信頼を丁寧に積み重ねる。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'experience-path',
        title: '体験導線（阿字観体験/法話/参拝プラン）',
        status: 'idea',
        detail:
          '実際の体験につながる導線を、穏やかに用意する構想です。阿字観体験や法話、参拝プランなどを紹介するが、強い誘導はしない。体験先の情報は短く簡潔にし、気になる人が自分のペースで調べられるようにする。地域差に配慮し、表示対象や頻度は設定で調整可能にする。アプリ内の実践が中心であることを明確にし、補助的な位置づけにする。外の体験へ開く扉として、そっと用意するイメージ。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'temple-map',
        title: '全国の真言宗のお寺マップ',
        status: 'idea',
        detail:
          '全国の真言宗のお寺を地図で静かに探せる構想です。観光アプリではなく、実際の参拝や体験の入口として位置づける。地図は現在地から近い寺を示すが、強い誘導やランキングはしない。寺ごとの情報は短く、連絡先・拝観可否・公式サイトへの導線に絞る。混雑や注意事項は簡潔に表示し、敬意を損なわない言葉遣いにする。個人の位置情報は端末内で処理し、許可は必要なときだけ求める。お気に入り登録は静かな印で、通知は基本オフ。地域差や宗派の幅に配慮し、誤りは報告できるようにする。巡礼や行事の案内は控えめにし、必要な人だけが開ける折りたたみ式にする。道案内は外部地図へ委ね、アプリ内は静かな一覧に留める。写真撮影の可否や参拝時間など、現地のマナーに関わる情報を最優先で載せる。レビュー機能は置かず、評価ではなく事実だけを静かに並べる。夜間や早朝の表示は控えめにし、近隣への配慮を促す。登録情報は寺院側が更新できる窓口を用意し、誤情報が長く残らない仕組みにする。徒歩や公共交通での訪問を想定し、アクセスは簡潔に示す。行く前に静かに心を整えるための短い一文も添える。地図そのものが目的ではなく、実践と現実の場が自然に結びつくための静かな橋渡しにする。',
      },
      {
        id: 'widget',
        title: 'ホームウィジェット',
        status: 'idea',
        detail:
          'ホーム画面から静かに起動できるウィジェットを想定しています。表示は最小限で、今日の一歩だけをそっと示す。タップすると朝か夜に直接入り、余計な画面を挟まない。文言は短く、焦りを煽らない表現にする。色は淡く、背景と調和するように設計する。ウィジェット自体が習慣の入口になるよう、静かな存在感を目指す。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'reminder-flex',
        title: '通知の柔軟な時間設定',
        status: 'idea',
        detail:
          '通知時間を曜日ごとに分けたり、休日だけ変える柔軟性を追加する構想です。設定は一画面に収め、複雑な操作を避ける。変更の結果はプレビューで確認でき、誤設定を防ぐ。通知のオンオフは常に最短手数で行えるようにする。深夜の通知など、生活に合わない時間は提案しない。生活リズムに寄り添う、控えめな調整機能として設計する。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'silent-retreat',
        title: '沈黙リトリート（一定時間だけ静かなUI）',
        status: 'idea',
        detail:
          '一定時間だけ沈黙の体験を支えるモードです。開始時に時間を選び、終わるまでは通知やメニューを最小化する。画面は暗く、必要な情報だけを表示して余白を広く保つ。終了時には短い言葉で戻りを促し、日常へ優しく戻す。途中で中断したい時の出口も用意し、無理を強いない。体験そのものを押しつけず、静かな選択肢として置く。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'mantra-counter',
        title: '真言カウンター（数唱/振動）',
        status: 'idea',
        detail:
          '真言の回数を数えるためのシンプルなカウンターです。画面は大きな数と静かな背景だけで、視線の揺れを減らす。タップと振動だけで進められ、音は任意にする。途中経過の保存は自動で行い、戻っても続けられるようにする。連続回数の競争を生まないよう、達成バッジは作らない。ただ数えるという行為に集中できる道具として設計する。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'breath-sync',
        title: '呼吸同期アニメ（3分の整え）',
        status: 'idea',
        detail:
          '呼吸のテンポに合わせてゆっくり動くアニメーションを用意する構想です。画面の中心に柔らかい動きがあり、吸う吐くを静かに導く。時間は短めで、朝の3分など日常に溶ける長さにする。音は基本的に使わず、必要な場合のみ低い環境音を選べる。目が疲れない配色と、刺激の少ない動きを徹底する。体験後はそのまま朝夜の実践へ移れるようにする。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'mandala-view',
        title: '曼荼羅ビュー（静かな鑑賞/拡大）',
        status: 'idea',
        detail:
          '曼荼羅を静かに眺めるためのビューを構想しています。説明文は控えめにし、視覚的な体験を中心に置く。ズームや移動はゆっくりとした操作感にし、急な動きを避ける。詳細解説が必要な人には、折りたたみで追加情報を出せる。画面全体の余白を広く取り、静かな鑑賞の時間を作る。観想の入口として、短い導入文だけを添える。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'voice-note',
        title: '音声で夜のひと言（自動文字起こし）',
        status: 'idea',
        detail:
          '夜のひと言を音声で残し、端末内で文字起こしする機能です。録音は短く、ワンタップで始まり、すぐ終われるようにする。文字起こしは端末内処理を基本にし、外部送信を避ける。誤変換は簡単に直せるようにし、編集も短い手順で済む。音声データは自動削除の選択肢を用意し、保存負担を減らす。書くより話す方が楽な人への静かな救済として位置づける。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'seasonal-rituals',
        title: '年中行事カレンダー（静かな案内）',
        status: 'idea',
        detail:
          '年中行事や季節の節目を、静かに知らせるカレンダー機能を想定しています。地域差や宗派差を踏まえ、表示は柔軟に選べるようにする。通知は控えめで、オンにしない限り出さない。行事の説明は短く、実践のヒントを一行だけ添える。日常のリズムに溶けるよう、派手な演出は避ける。季節の移ろいを感じる小さなきっかけとして設計する。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'altar-mode',
        title: '小さなお仏壇モード（一枚絵と合掌）',
        status: 'idea',
        detail:
          '小さなお仏壇のように、一枚絵と合掌の導線だけを置くモードです。画面は余白を広く取り、触れる要素を最小限にする。合掌の開始と終了には短い言葉だけを添え、長い説明はしない。音や振動は選択式で、無音でも使えるようにする。このモードは行う人のためだけに用意し、強く勧めない。日常の中で静かに手を合わせる入口として位置づける。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'quiet-share',
        title: '一日一句の静かな共有（外部へ出さない）',
        status: 'idea',
        detail:
          '一日一句のような短い言葉を、自分のために残す機能です。共有は前提にせず、端末内の記録として扱う。もし共有するなら、公開範囲は最小にし、選択式で慎重にする。言葉は短くても意味があると感じられるよう、静かな余白を用意する。過去の一句は一覧で眺められるが、比較や評価はしない。その日の呼吸の質をそっと残すための器として設計する。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'history',
        title: '365日ヒートマップ',
        status: 'done',
        detail:
          '365日の足跡を淡い色で可視化する現行機能です。数字の競争にしないため、カウントは目立たせず、色の濃淡だけで示す。空白の日は欠落ではなく余白として扱い、戻れた日の価値を大切にする。タップで日付の詳細を見られるが、深掘りを強制しない。長押しのツールチップなど、静かな操作で情報を得られる設計。ここで感じたいのは達成よりも継続の静けさである。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'theme',
        title: 'テーマ切替（ライト/ダーク）',
        status: 'done',
        detail:
          'ライトとダーク、そしてシステム追従を選べる現行機能です。目への負担を減らし、朝夜どちらでも使いやすい配色を整える。テーマ変更はすぐ反映され、戻しやすい体験にする。コントラストは強すぎず、静かな文字の読みやすさを優先する。端末の設定に従う選択肢を置くことで、無理な選択を迫らない。視覚の静けさが、心の静けさにつながるという考え方。また、導線は一筆書きのように短くし、迷いや選択疲れを起こさないことを前提にする。初回は簡潔な説明だけで進み、詳細は必要な人だけが開ける折りたたみ式にする。途中でやめても失敗にならず、戻るボタンはいつでも目に入る位置に置く。体験の終わりには小さな余韻を残し、次の画面へ急がせない。言葉は短く、主語を大きくしない。アニメーションは遅めで、途中停止でも違和感がない。迷った時は一つだけの次の一歩を示し、選択肢を増やしすぎない。小さな成功を強調せず、戻れたことだけをそっと伝える。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
      },
      {
        id: 'language',
        title: '言語切替',
        status: 'done',
        detail:
          '日本語と英語を切り替えられる現行機能です。翻訳は意味の正確さだけでなく、文体の静けさを保つことを重視する。言語を変えても画面の構成は変えず、迷いを生まない。一部の画面は開き直すと反映されるが、その説明は短く丁寧に行う。多言語化は拡張可能な構造にして、将来の追加を難しくしない。言葉の選び方が体験の質を決めるという前提で設計する。設定はオンとオフが明確で、データの保存や削除は自分で選べるようにする。通知や共有の扱いは最小限に留め、プライバシーの境界を曖昧にしない。機能が使えない状況では代替を用意し、エラーは短い言葉で落ち着いて伝える。自分のペースを乱さないことが最優先で、使わない人の体験は今の静けさのまま保つ。設定の変更はすぐ戻せるようにし、履歴やログの扱いも透明にする。外部連携が必要な場合は必ず説明を添え、同意のない自動送信は行わない。安心して閉じられる出口を用意し、悩み続けなくてよい体験にする。最後に、使い終えた時に心が少し整っていることを指標にする。機能の存在感より、実践が自然に続くことを優先する。日々の手触りを壊さないことが最重要。季節や体調の揺れにも合わせられるよう、余白を大きく残し、急がない設計にする。静かなまま続けられることを最終の合格点にする。',
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
        detail: 'A small support window to keep the app quiet without adding more ads or noise. It sits in the background and never insists. Support is optional in amount and timing, available only when the user feels ready. Use of funds is explained in short, plain words so the reason for updates is visible. Gratitude is expressed quietly, with a soft closing tone instead of a loud celebration. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'friends',
        title: 'Connect with friends (small community)',
        status: 'idea',
        detail: 'A small circle for gentle encouragement, not a public feed. No scores, no streaks, no comparison. A tiny check in or a short note is enough. Joining is by invitation, with easy pause and exit options. The intent is simple support, not obligation or constant replies. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'guided-onboarding',
        title: 'Guided onboarding (short intro)',
        status: 'idea',
        detail: 'A three card introduction that explains the meaning and flow of the app. Card one sets the spirit, card two shows morning and night, card three emphasizes returning after gaps. It is skippable from the start and can be re opened later. The words stay short and calm. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'streak-free-nudge',
        title: 'Gentle return flows (no guilt)',
        status: 'idea',
        detail: 'A return path that welcomes gaps and removes streak pressure. It avoids rankings and rewards, and instead offers a quiet invitation to take one small step. The entry point appears gently in home and learning views, not only through notifications. The tone is soft and non judgmental. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'focus-mode',
        title: 'Focus mode (minimal distractions)',
        status: 'idea',
        detail: 'A minimal mode for a few minutes of practice. Navigation and extra controls fade away so attention can settle. The screen shows only a few large words and a calm background. Ending is slow and unhurried, with a small afterglow rather than a hard stop. It is optional and never forced. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'ritual-sounds',
        title: 'Subtle ritual sounds/ambience',
        status: 'idea',
        detail: 'Subtle bell or ambience layers that can be chosen or turned off. Silence is the default. Chosen sounds stay consistent between morning and night so the user does not repeat setup. Volume follows device settings and never overrides them. The goal is to add atmosphere without distraction. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'offline-pack',
        title: 'Offline packs (no connection needed)',
        status: 'idea',
        detail: 'A small offline pack so morning, night, and learning remain available without a connection. Content is stored on device, and logs stay local. Sync can wait until the user is back online and is never urgent. Storage stays light with automatic cleanup to avoid burden. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'smart-reminder',
        title: 'Adaptive reminders by practice',
        status: 'idea',
        detail: 'Soft suggestions for reminder timing based on recent habits. It never auto changes settings and always asks first. If the user declines, it stays quiet. It may suggest small adjustments for weekends or busy periods, but only as a light option, not a rule. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'gentle-analytics',
        title: 'Gentle reflection insights',
        status: 'idea',
        detail: 'A calm reflection view that highlights returned days instead of scores. Colors stay soft, and empty days are treated as space, not failure. The insight is a single line, not a report. The user can hide the view completely if it does not help. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'accessibility-plus',
        title: 'Accessibility upgrades (text/voice/controls)',
        status: 'idea',
        detail: 'A set of accessibility upgrades for text size, spacing, voice support, and generous tap targets. The app adapts to different ages and lighting conditions. Settings remain simple, with no long menus. The aim is comfort and ease, not customization overload. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'personalized-path',
        title: 'Soft personalization (suggested flow)',
        status: 'idea',
        detail: 'A gentle suggestion of the next step based on the current state. It offers a few options, never a single forced path. The reason for the suggestion is clear and short. It can be turned off fully, keeping the app quiet for those who prefer no guidance. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'practice-notes',
        title: 'Practice notes templates/prompts',
        status: 'idea',
        detail: 'Small prompts that make notes easy, such as a single reflective question. Templates are optional and never block free writing. Notes stay on device by default and are not shared. The tone emphasizes that writing is optional, and silence is acceptable. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'calendar-view',
        title: 'Calendar view (morning/night logs)',
        status: 'idea',
        detail: 'A calm calendar view for morning and night logs. Colors are muted and avoid highlighting quantity. Tapping a day reveals a short recap without pressure. The calendar can be hidden if it distracts. The goal is a quiet sense of rhythm, not a score. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'sync-cloud',
        title: 'Optional cloud sync',
        status: 'idea',
        detail: 'Optional cloud backup for device loss, with strong privacy emphasis. It is off by default and requires clear consent. Data is encrypted, and sync frequency stays low to protect battery and bandwidth. Restore explains exactly what returns in plain language. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'device-handoff',
        title: 'Device handoff',
        status: 'idea',
        detail: 'A calm transfer flow for moving data to a new device. It takes only a few steps and allows the user to choose what to move. The method uses a temporary code or QR and avoids public sharing. After transfer, the old device is left unchanged unless the user decides. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'shareable-cards',
        title: 'Shareable learning cards (quiet sharing)',
        status: 'idea',
        detail: 'A quiet way to share a single learning card with close people. It avoids public feeds and focuses on small, private sharing. The default is private, with clear control over destination. The card carries a short note about why it mattered today, not a loud caption. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'coach-mode',
        title: 'Companion mode (weekly check-in)',
        status: 'idea',
        detail: 'A weekly check in that feels like a companion, not a judge. It asks one or two gentle questions and offers a short breath prompt. Answers are brief, and skipping is allowed. The purpose is to return, not to rate performance. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'ritual-sets',
        title: 'Ritual sets (custom morning/night)',
        status: 'idea',
        detail: 'Light customization of the morning and night flow. Users can reorder steps or hide a step for a day, but the overall ritual stays intact. Suggested sets are offered quietly, and there is always a quick way back to the default. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'ajikan-timer',
        title: 'Ajikan timer (3/5/10 min)',
        status: 'idea',
        detail: 'A simple Ajikan timer in 3, 5, and 10 minute options. The preface is one short line about posture and breath. During practice the screen stays dark and calm. Ending can be silent or gentle, with optional vibration only. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'learning-courses',
        title: 'Learning courses (30/90 day)',
        status: 'idea',
        detail: 'Light 30 and 90 day courses that suggest a steady sequence without pressure. Each day offers one small step, and gaps are welcomed. Summaries are short, favoring clarity over achievement. The course list is simple to avoid choice fatigue. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'weekly-review',
        title: 'Weekly review (1 min)',
        status: 'idea',
        detail: 'A one minute weekly review with two short questions. Answers can be a few words or a simple choice. The result is a gentle suggestion for the next week, not a score. It is offered quietly and can be skipped without penalty. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'bookmarks-search',
        title: 'Bookmarks / search',
        status: 'idea',
        detail: 'A light search and bookmark layer for learning cards and terms. Suggestions appear softly as the user types. Bookmarks are a small mark rather than a loud star. Search history is minimal and can be cleared easily to protect privacy. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'paid-audio',
        title: 'Audio guide / deep-dive content (paid)',
        status: 'idea',
        detail: 'Optional paid audio guides and deeper content. The paid path stays subtle so the free flow remains calm. Short previews help the user decide without pressure. Downloads support offline use, and pricing is explained clearly with easy cancellation. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'monk-content',
        title: 'Monk-supervised content',
        status: 'idea',
        detail: 'Monk supervised content to add trust and grounding. Technical terms are explained in plain language. The role of the supervisor is presented modestly, focusing on practice rather than authority. Feedback channels allow users to report confusion or concern. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'experience-path',
        title: 'Experience paths (Ajikan trial, dharma talk, temple visit)',
        status: 'idea',
        detail: 'A gentle path to real world experiences such as Ajikan sessions, talks, or temple visits. The app does not push or rank options. Information stays short and factual, with links to official sources. The in app practice remains central, and the path is an optional door. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'temple-map',
        title: 'Nationwide Shingon temples map',
        status: 'idea',
        detail: 'A quiet map to find Shingon temples across Japan. It is not a tourism feed. The map lists nearby temples without rankings or pressure. Each entry shows only essential facts such as contact, visit hours, and an official site link. The tone stays respectful, with guidance about etiquette and photography. Location permission is requested only when needed and processed on device. There are no reviews, only facts. Errors can be reported, and updates can be provided by temples to keep accuracy. The map points to external navigation for directions and keeps the in app view minimal.',
      },
      {
        id: 'widget',
        title: 'Home widget',
        status: 'idea',
        detail: 'A home screen widget that opens practice with one tap. It shows only a small prompt, never a loud badge. The wording is gentle and never urgent. Colors are soft so it blends with the device. The widget is optional and stays quiet if the user prefers. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'reminder-flex',
        title: 'Flexible reminder times',
        status: 'idea',
        detail: 'Flexible reminder times by day of week or weekend. The setup stays on one screen with a clear preview. On and off remains a single tap. The system avoids suggesting late night hours and keeps changes reversible. The goal is support, not enforcement. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'silent-retreat',
        title: 'Silent retreat (quiet UI timebox)',
        status: 'idea',
        detail: 'A timeboxed silent mode that reduces UI and notifications to the minimum. The user selects a duration and the app becomes still. Ending is gentle with a short line to return to daily life. Exit is always available without guilt, so the experience remains a choice. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'mantra-counter',
        title: 'Mantra counter (count + haptics)',
        status: 'idea',
        detail: 'A simple counter for mantra recitation. The screen shows only a large count and calm background. Tap or haptic increments are optional. Progress is saved quietly, with no badges or competitive signals. The tool exists only to support steady repetition. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'breath-sync',
        title: 'Breath sync animation (3-minute align)',
        status: 'idea',
        detail: 'A slow animation that guides breathing for a short practice, such as three minutes. The motion is subtle and easy on the eyes. Sound is optional and minimal. After the session, the user can move directly into morning or night practice without extra steps. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'mandala-view',
        title: 'Mandala view (quiet focus / zoom)',
        status: 'idea',
        detail: 'A calm mandala viewer for quiet focus. Descriptions are short and secondary to the visual. Zoom and pan are gentle and slow. Extra explanations are hidden behind a fold for those who want them. The view is designed for stillness, not study sessions. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'voice-note',
        title: 'Voice night note (auto transcription)',
        status: 'idea',
        detail: 'A voice note option for the night reflection. Recording starts and stops in one tap. Transcription happens on device to avoid external sending. Edits are simple and fast. Audio can be deleted automatically if the user prefers. It supports people who find typing hard. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'seasonal-rituals',
        title: 'Seasonal rituals calendar (quiet prompts)',
        status: 'idea',
        detail: 'A quiet seasonal rituals calendar with optional prompts. Region and preference filters keep it accurate and relevant. Notifications are off by default. Each entry is a short note with a single practical hint. The design respects local differences and avoids loud celebration. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'altar-mode',
        title: 'Tiny altar mode (single image + bow)',
        status: 'idea',
        detail: 'A tiny altar mode with a single image and a simple bow prompt. The interface is mostly blank space, with minimal controls. Sound and vibration are optional. The mode is offered gently and never pushed. It is for those who want a small moment of reverence. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'quiet-share',
        title: 'One-line quiet sharing (private-first)',
        status: 'idea',
        detail: 'A one line daily phrase kept mainly for the user. Sharing is optional and modest, with clear controls. There is no public feed, only small private destinations if desired. The list of phrases is for quiet reflection, not comparison. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'history',
        title: '365-day heatmap',
        status: 'done',
        detail: 'The existing 365 day heatmap that shows practice footprints in soft colors. It avoids scoring and treats gaps as space, not failure. Details appear only when tapped or long pressed. The view is designed to feel calm and forgiving. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
      },
      {
        id: 'theme',
        title: 'Theme toggle (light/dark)',
        status: 'done',
        detail: 'Light, dark, and system themes that reduce eye strain and keep the atmosphere calm. Changes apply immediately and can be reverted easily. Contrast is tuned to stay readable without harshness. The visual tone supports quiet focus. Settings must be explicit on or off, and data control stays with the user. Notifications and sharing are opt in and minimal, with privacy boundaries kept clear. When a feature is unavailable, offer a quiet fallback and a brief, calm message. The default experience stays quiet for people who do not use the feature. Any external connection requires clear explanation and consent, with no silent background sending. There is always an easy way out so the user can leave without second thoughts.',
      },
      {
        id: 'language',
        title: 'Language switcher',
        status: 'done',
        detail: 'A language switcher for Japanese and English with consistent tone. The layout stays the same to avoid confusion. Explanations remain short and gentle. The structure allows more languages later without changing the core experience. Keep the flow short and calm, with one clear next step and no choice fatigue. The first view should be simple, and deeper information can be hidden behind a gentle disclosure. If the user pauses or exits, it should never feel like a failure. Transitions stay slow and steady, with minimal motion and no abrupt changes. Language remains soft and modest, avoiding grand claims or pressure. The screen should end with a small afterglow so the mind can settle before moving on.',
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
