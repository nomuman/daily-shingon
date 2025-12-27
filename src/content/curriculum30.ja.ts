import type { Curriculum30, CurriculumActionOption, CurriculumDay, SanmitsuKey } from '../types/curriculum';

// JSONはプロジェクトルートの content/ に置いている想定
import raw from '../../content/curriculum/30days.ja.json';

const SANMITSU_KEYS: SanmitsuKey[] = ['body', 'speech', 'mind'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSanmitsuKey(value: unknown): value is SanmitsuKey {
  return typeof value === 'string' && SANMITSU_KEYS.includes(value as SanmitsuKey);
}

function toStringOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((v) => typeof v === 'string') as string[];
  return items.length ? items : undefined;
}

function buildFallbackDay(day: number): CurriculumDay {
  return {
    id: `fallback-day-${day}`,
    day,
    title: '今日の学び',
    learn: '学びデータの読み込みに失敗しました。アプリを再起動しても直らない場合は、データを更新してください。',
    recommendedActionKey: 'body',
    actionOptions: [
      { key: 'body', text: '深呼吸して整える' },
      { key: 'speech', text: '一言だけ優しくする' },
      { key: 'mind', text: '今の気持ちを観察する' },
    ],
    nightQuestion: '今日はどこを少し整え直せそうですか？',
  };
}

function normalizeActionOptions(
  value: unknown,
  errors: string[],
  dayLabel: string
): CurriculumActionOption[] | null {
  if (!Array.isArray(value)) {
    errors.push(`${dayLabel}: actionOptions が配列ではありません`);
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
    errors.push(`${dayLabel}: actionOptions が空または不正です`);
    return null;
  }

  return options;
}

function normalizeDay(
  value: unknown,
  errors: string[],
  index: number
): CurriculumDay | null {
  if (!isRecord(value)) {
    errors.push(`days[${index}] がオブジェクトではありません`);
    return null;
  }

  const dayLabel = `days[${index}]`;
  const dayNumber = typeof value.day === 'number' ? value.day : Number.NaN;
  if (!Number.isFinite(dayNumber)) {
    errors.push(`${dayLabel}: day が数値ではありません`);
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
    errors.push(`${dayLabel}: recommendedActionKey が不正です`);
  }

  if (!actionOptions.some((opt) => opt.key === recommendedActionKey)) {
    errors.push(`${dayLabel}: recommendedActionKey が actionOptions に存在しません`);
    recommendedActionKey = actionOptions[0].key;
  }

  const title = toStringOrEmpty(value.title);
  const learn = toStringOrEmpty(value.learn);
  const nightQuestion = toStringOrEmpty(value.nightQuestion);

  if (!title || !learn || !nightQuestion) {
    errors.push(`${dayLabel}: title/learn/nightQuestion の必須項目が欠けています`);
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

function buildCurriculum30(input: unknown): Curriculum30 {
  const errors: string[] = [];
  if (!isRecord(input)) {
    errors.push('ルートがオブジェクトではありません');
    const fallbackDays = Array.from({ length: 30 }, (_, i) => buildFallbackDay(i + 1));
    console.warn('[curriculum] invalid data; using fallback', { errors });
    return {
      schemaVersion: 'unknown',
      locale: 'ja',
      program: '30days',
      generatedAt: 'unknown',
      sourceIndex: {},
      days: fallbackDays,
    };
  }

  const daysInput = Array.isArray(input.days) ? input.days : [];
  if (!Array.isArray(input.days)) {
    errors.push('days が配列ではありません');
  }

  const dayMap = new Map<number, CurriculumDay>();
  daysInput.forEach((entry, index) => {
    const normalized = normalizeDay(entry, errors, index);
    if (!normalized) return;
    if (normalized.day < 1 || normalized.day > 30) {
      errors.push(`days[${index}]: day が 1..30 の範囲外です (${normalized.day})`);
      return;
    }
    if (dayMap.has(normalized.day)) {
      errors.push(`day ${normalized.day} が重複しています`);
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
      errors.push(`day ${day} が欠けています`);
      days.push(buildFallbackDay(day));
    }
  }

  const schemaVersion = toStringOrEmpty(input.schemaVersion) || 'unknown';
  const locale = toStringOrEmpty(input.locale) || 'ja';
  const program = toStringOrEmpty(input.program) || '30days';
  const generatedAt = toStringOrEmpty(input.generatedAt) || 'unknown';
  const sourceIndex = normalizeSourceIndex(input.sourceIndex);

  if (!toStringOrEmpty(input.schemaVersion)) errors.push('schemaVersion が欠けています');
  if (!toStringOrEmpty(input.locale)) errors.push('locale が欠けています');
  if (!toStringOrEmpty(input.program)) errors.push('program が欠けています');
  if (!toStringOrEmpty(input.generatedAt)) errors.push('generatedAt が欠けています');

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

export const curriculum30Ja = buildCurriculum30(raw);

export function getDayCard(day: number): CurriculumDay {
  const d = Math.max(1, Math.min(30, day));
  const card = curriculum30Ja.days.find((x) => x.day === d);
  return card ?? buildFallbackDay(d);
}
