import { toISODateLocal } from './date';
import { getMorningLog, isMorningComplete } from './morningLog';
import { getNightLog, isNightComplete } from './nightLog';

export type HeatmapValue = { date: string; count: number };

type DailyStatus = {
  dateISO: string;
  morningDone: boolean;
  nightDone: boolean;
  nightHasNote: boolean;
};

function addDays(base: Date, deltaDays: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + deltaDays);
  return d;
}

/**
 * 直近N日分の状態を取得（新しい順）
 * - バッチ処理でAsyncStorageアクセスを抑える
 */
export async function getLastNDaysStatusBatched(
  days: number,
  batchSize = 28,
  baseDate = new Date(),
): Promise<DailyStatus[]> {
  const n = Math.max(1, Math.min(days, 400));
  const size = Math.max(1, Math.min(batchSize, 90));
  const dates: Date[] = [];

  for (let i = 0; i < n; i += 1) {
    dates.push(addDays(baseDate, -i));
  }

  const results: DailyStatus[] = [];

  for (let start = 0; start < dates.length; start += size) {
    const chunk = dates.slice(start, start + size);

    const chunkResults = await Promise.all(
      chunk.map(async (date) => {
        const dateISO = toISODateLocal(date);

        const morning = await getMorningLog(date);
        const night = await getNightLog(date);

        return {
          dateISO,
          morningDone: isMorningComplete(morning),
          nightDone: isNightComplete(night),
          nightHasNote: !!(night?.note && night.note.trim().length > 0),
        };
      }),
    );

    results.push(...chunkResults);
  }

  return results;
}

/**
 * ContributionGraph 用に {date, count} を作る
 * countの意味（0〜3）:
 * 0: 記録なし
 * 1: 朝 or 夜 どちらか完了
 * 2: 朝+夜 完了
 * 3: 朝+夜 完了 + 夜メモあり（📝相当）
 */
export async function getHeatmap365Values(): Promise<HeatmapValue[]> {
  const statuses = await getLastNDaysStatusBatched(365);

  return statuses.map((status) => {
    const both = status.morningDone && status.nightDone;
    const either = status.morningDone || status.nightDone;

    let count = 0;
    if (either) count = 1;
    if (both) count = 2;
    if (both && status.nightHasNote) count = 3;

    return { date: status.dateISO, count };
  });
}
