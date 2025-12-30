/**
 * Purpose: Normalize content language identifiers to supported values. / 目的: コンテンツ言語コードを正規化。
 * Responsibilities: expose ContentLang union and a normalizer for locale strings. / 役割: ContentLang型と正規化関数を提供。
 * Inputs: locale strings (e.g., "ja-JP", "en-US"). / 入力: ロケール文字列（例: "ja-JP", "en-US"）。
 * Outputs: "ja" or "en". / 出力: "ja" または "en"。
 * Dependencies: none. / 依存: なし。
 * Side effects: none. / 副作用: なし。
 * Edge cases: undefined or unsupported locales default to "en". / 例外: 未定義/未対応は"en"にフォールバック。
 */
export type ContentLang = 'ja' | 'en';

export function normalizeContentLang(lng?: string): ContentLang {
  const base = (lng ?? 'en').split('-')[0].toLowerCase();
  return base === 'ja' ? 'ja' : 'en';
}
