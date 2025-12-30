/**
 * Purpose: Language-aware accessors for the 30-day curriculum. / 目的: 30日カリキュラムの言語別アクセサ。
 * Responsibilities: route curriculum and day-card retrieval by content language. / 役割: 言語に応じてカリキュラム/日別カードを返す。
 * Inputs: language code + day number. / 入力: 言語コードと日番号。
 * Outputs: curriculum data and specific day card. / 出力: カリキュラムデータと日別カード。
 * Dependencies: language-specific curriculum modules. / 依存: 言語別カリキュラムモジュール。
 * Side effects: none. / 副作用: なし。
 * Edge cases: invalid day handled by underlying module. / 例外: 不正日付は下位モジュールで補正。
 */
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
