/**
 * Purpose: Hook to map i18n language to content language. / 目的: i18n言語をコンテンツ言語へ変換するフック。
 * Responsibilities: read current i18n language and normalize to supported ContentLang. / 役割: i18n言語を読み取り正規化。
 * Inputs: i18n language from react-i18next. / 入力: react-i18nextの言語。
 * Outputs: "ja" or "en". / 出力: "ja" または "en"。
 * Dependencies: react-i18next, normalizeContentLang. / 依存: react-i18next、normalizeContentLang。
 * Side effects: none. / 副作用: なし。
 * Edge cases: unexpected locale formats are normalized to "en". / 例外: 想定外形式は"en"に正規化。
 */
import { useTranslation } from 'react-i18next';
import { normalizeContentLang, type ContentLang } from './lang';

export function useContentLang(): ContentLang {
  const { i18n } = useTranslation('common');
  return normalizeContentLang(i18n.language);
}
