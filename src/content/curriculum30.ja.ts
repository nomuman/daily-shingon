import type { Curriculum30, CurriculumDay } from '../types/curriculum';

// JSONはプロジェクトルートの content/ に置いている想定
import raw from '../../content/curriculum/30days.ja.json';

export const curriculum30Ja = raw as Curriculum30;

export function getDayCard(day: number): CurriculumDay {
  const d = Math.max(1, Math.min(30, day));
  const card = curriculum30Ja.days.find((x) => x.day === d);
  if (!card) throw new Error(`Curriculum day not found: ${d}`);
  return card;
}
