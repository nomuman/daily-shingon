export type ContentLang = 'ja' | 'en';

export function normalizeContentLang(lng?: string): ContentLang {
  const base = (lng ?? 'en').split('-')[0].toLowerCase();
  return base === 'ja' ? 'ja' : 'en';
}
