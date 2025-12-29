import { useTranslation } from 'react-i18next';
import { normalizeContentLang, type ContentLang } from './lang';

export function useContentLang(): ContentLang {
  const { i18n } = useTranslation('common');
  return normalizeContentLang(i18n.language);
}
