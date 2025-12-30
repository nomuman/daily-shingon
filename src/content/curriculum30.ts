import type { ContentLang } from './lang';
import type { Curriculum30, CurriculumDay } from '../types/curriculum';

import { curriculum30En, getDayCard as getDayCardEn } from './curriculum30.en';
import { curriculum30Ja, getDayCard as getDayCardJa } from './curriculum30.ja';

export function getCurriculum30(lang: ContentLang): Curriculum30 {
  return lang === 'en' ? curriculum30En : curriculum30Ja;
}

export function getDayCard(lang: ContentLang, day: number): CurriculumDay {
  return lang === 'en' ? getDayCardEn(day) : getDayCardJa(day);
}
