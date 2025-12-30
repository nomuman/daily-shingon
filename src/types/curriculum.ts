/**
 * Purpose: Curriculum data types shared across content and UI. / 目的: コンテンツ/画面で共有するカリキュラム型。
 * Responsibilities: define Sanmitsu keys, day structure, and curriculum metadata. / 役割: 三密キー、日構造、メタデータを定義。
 * Inputs: used by content loaders and screens. / 入力: ローダー/画面で利用。
 * Outputs: TypeScript types. / 出力: TypeScript型。
 * Dependencies: none. / 依存: なし。
 * Side effects: none. / 副作用: なし。
 * Edge cases: optional example/tags/sources. / 例外: 例/タグ/出典が任意。
 */
export type SanmitsuKey = 'body' | 'speech' | 'mind';

export type CurriculumActionOption = {
  key: SanmitsuKey;
  text: string;
};

export type CurriculumDay = {
  id: string;
  day: number; // 1..30
  title: string;
  learn: string;
  example?: string;
  recommendedActionKey: SanmitsuKey;
  actionOptions: CurriculumActionOption[];
  nightQuestion: string;
  tags?: string[];
  sources?: string[];
};

export type Curriculum30 = {
  schemaVersion: string;
  locale: string;
  program: string; // "30days"
  generatedAt: string;
  sourceIndex: Record<string, string>;
  days: CurriculumDay[];
};
