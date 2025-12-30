/**
 * Purpose: English 30-day curriculum loader + validator. / 目的: 英語版30日カリキュラムのロード/検証。
 * Responsibilities: normalize raw JSON into safe CurriculumDay objects and provide fallbacks. / 役割: JSONを安全なCurriculumDayに正規化し、フォールバックを提供。
 * Inputs: raw JSON content for 30-day curriculum. / 入力: 30日カリキュラムの生JSON。
 * Outputs: sanitized curriculum data and day card accessor. / 出力: サニタイズ済みデータと日別カード取得。
 * Dependencies: curriculum types, JSON source data. / 依存: カリキュラム型、JSONソース。
 * Side effects: console warnings on invalid data. / 副作用: 不正データ時のconsole警告。
 * Edge cases: missing/invalid fields, duplicate/missing days. / 例外: 欠落/不正フィールド、重複/欠損日。
 */
import type {
  Curriculum30,
  CurriculumActionOption,
  CurriculumDay,
  SanmitsuKey,
} from '../types/curriculum';

import raw from '../../content/curriculum/30days.en.json';

// Allowed action keys for validation. / 検証に使う許可キー。
const SANMITSU_KEYS: SanmitsuKey[] = ['body', 'speech', 'mind'];

// Simple object guard for runtime validation. / 実行時の簡易オブジェクト判定。
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Ensure the key belongs to the supported action keys. / キーが許可リストに含まれるか確認。
function isSanmitsuKey(value: unknown): value is SanmitsuKey {
  return typeof value === 'string' && SANMITSU_KEYS.includes(value as SanmitsuKey);
}

// Convert to string or fall back to empty. / 文字列に変換し、不可なら空文字。
function toStringOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

// Convert unknown arrays to string arrays (or undefined). / 配列を文字列配列へ変換（不可ならundefined）。
function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((v) => typeof v === 'string') as string[];
  return items.length ? items : undefined;
}

// Build a safe fallback card when a day is missing/invalid. / 日付欠損/不正時のフォールバックカード。
function buildFallbackDay(day: number): CurriculumDay {
  return {
    id: `fallback-day-${day}`,
    day,
    title: "Today's learning",
    learn:
      'We could not load the learning data. If restarting does not help, please refresh the data.',
    recommendedActionKey: 'body',
    actionOptions: [
      { key: 'body', text: 'Take a breath and reset your posture.' },
      { key: 'speech', text: 'Say one gentle phrase.' },
      { key: 'mind', text: 'Observe how you feel right now.' },
    ],
    nightQuestion: 'Where could you realign yourself even a little today?',
  };
}

// Validate and normalize action options. / 行い候補を検証・正規化。
function normalizeActionOptions(
  value: unknown,
  errors: string[],
  dayLabel: string,
): CurriculumActionOption[] | null {
  if (!Array.isArray(value)) {
    errors.push(`${dayLabel}: actionOptions is not an array`);
    return null;
  }

  const options = value
    .map((item) => {
      if (!isRecord(item)) return null;
      if (!isSanmitsuKey(item.key)) return null;
      const text = toStringOrEmpty(item.text);
      if (!text) return null;
      return { key: item.key, text };
    })
    .filter((opt): opt is CurriculumActionOption => !!opt);

  if (!options.length) {
    errors.push(`${dayLabel}: actionOptions is empty or invalid`);
    return null;
  }

  return options;
}

// Validate and normalize a single day entry. / 単一日付エントリの検証・正規化。
function normalizeDay(value: unknown, errors: string[], index: number): CurriculumDay | null {
  if (!isRecord(value)) {
    errors.push(`days[${index}] is not an object`);
    return null;
  }

  const dayLabel = `days[${index}]`;
  const dayNumber = typeof value.day === 'number' ? value.day : Number.NaN;
  if (!Number.isFinite(dayNumber)) {
    errors.push(`${dayLabel}: day is not a number`);
    return null;
  }

  const actionOptions = normalizeActionOptions(value.actionOptions, errors, dayLabel);
  if (!actionOptions) {
    return null;
  }

  let recommendedActionKey: SanmitsuKey = actionOptions[0].key;
  if (isSanmitsuKey(value.recommendedActionKey)) {
    recommendedActionKey = value.recommendedActionKey;
  } else {
    errors.push(`${dayLabel}: recommendedActionKey is invalid`);
  }

  if (!actionOptions.some((opt) => opt.key === recommendedActionKey)) {
    errors.push(`${dayLabel}: recommendedActionKey not found in actionOptions`);
    recommendedActionKey = actionOptions[0].key;
  }

  const title = toStringOrEmpty(value.title);
  const learn = toStringOrEmpty(value.learn);
  const nightQuestion = toStringOrEmpty(value.nightQuestion);

  if (!title || !learn || !nightQuestion) {
    errors.push(`${dayLabel}: missing required title/learn/nightQuestion`);
    return null;
  }

  return {
    id: toStringOrEmpty(value.id) || `day-${dayNumber}`,
    day: dayNumber,
    title,
    learn,
    example: toStringOrEmpty(value.example) || undefined,
    recommendedActionKey,
    actionOptions,
    nightQuestion,
    tags: toStringArray(value.tags),
    sources: toStringArray(value.sources),
  };
}

// Validate source index map (string -> string). / 出典インデックスの検証（文字列→文字列）。
function normalizeSourceIndex(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(value)) {
    if (typeof val === 'string') {
      result[key] = val;
    }
  }
  return result;
}

// Build sanitized curriculum with full 1..30 coverage. / 1..30の全日を埋めたサニタイズ済みカリキュラムを生成。
function buildCurriculum30(input: unknown): Curriculum30 {
  const errors: string[] = [];
  if (!isRecord(input)) {
    errors.push('root is not an object');
    const fallbackDays = Array.from({ length: 30 }, (_, i) => buildFallbackDay(i + 1));
    console.warn('[curriculum] invalid data; using fallback', { errors });
    return {
      schemaVersion: 'unknown',
      locale: 'en',
      program: '30days',
      generatedAt: 'unknown',
      sourceIndex: {},
      days: fallbackDays,
    };
  }

  const daysInput = Array.isArray(input.days) ? input.days : [];
  if (!Array.isArray(input.days)) {
    errors.push('days is not an array');
  }

  const dayMap = new Map<number, CurriculumDay>();
  daysInput.forEach((entry, index) => {
    const normalized = normalizeDay(entry, errors, index);
    if (!normalized) return;
    if (normalized.day < 1 || normalized.day > 30) {
      errors.push(`days[${index}]: day is outside 1..30 (${normalized.day})`);
      return;
    }
    if (dayMap.has(normalized.day)) {
      errors.push(`day ${normalized.day} is duplicated`);
      return;
    }
    dayMap.set(normalized.day, normalized);
  });

  const days: CurriculumDay[] = [];
  for (let day = 1; day <= 30; day += 1) {
    const found = dayMap.get(day);
    if (found) {
      days.push(found);
    } else {
      errors.push(`day ${day} is missing`);
      days.push(buildFallbackDay(day));
    }
  }

  const schemaVersion = toStringOrEmpty(input.schemaVersion) || 'unknown';
  const locale = toStringOrEmpty(input.locale) || 'en';
  const program = toStringOrEmpty(input.program) || '30days';
  const generatedAt = toStringOrEmpty(input.generatedAt) || 'unknown';
  const sourceIndex = normalizeSourceIndex(input.sourceIndex);

  if (!toStringOrEmpty(input.schemaVersion)) errors.push('schemaVersion is missing');
  if (!toStringOrEmpty(input.locale)) errors.push('locale is missing');
  if (!toStringOrEmpty(input.program)) errors.push('program is missing');
  if (!toStringOrEmpty(input.generatedAt)) errors.push('generatedAt is missing');

  if (errors.length) {
    console.warn('[curriculum] invalid data; using sanitized fallback', { errors });
  }

  return {
    schemaVersion,
    locale,
    program,
    generatedAt,
    sourceIndex,
    days,
  };
}

export const curriculum30En = buildCurriculum30(raw);

// Safe accessor for a single day card (clamped to 1..30). / 1..30に丸めた日別カード取得。
export function getDayCard(day: number): CurriculumDay {
  const d = Math.max(1, Math.min(30, day));
  const card = curriculum30En.days.find((x) => x.day === d);
  return card ?? buildFallbackDay(d);
}
