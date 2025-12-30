/**
 * Purpose: Local-date helpers (no UTC shifting). / 目的: ローカル日付の補助関数（UTCシフトなし）。
 * Responsibilities: format and parse YYYY-MM-DD in local time, and compute day diffs. / 役割: ローカル日付の整形/解析と日数差計算。
 * Inputs: Date objects or ISO date strings. / 入力: DateオブジェクトまたはISO日付文字列。
 * Outputs: ISO date strings or Date objects; integer day difference. / 出力: ISO日付文字列/Date、日数差の整数。
 * Dependencies: none. / 依存: なし。
 * Side effects: none. / 副作用: なし。
 * Edge cases: invalid ISO strings fall back to default month/day values. / 例外: 不正ISO文字列は既定値にフォールバック。
 */
export function toISODateLocal(d: Date): string {
  // local timezone で YYYY-MM-DD を作る
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODateLocal(iso: string): Date {
  // "YYYY-MM-DD" をローカル日付として解釈
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

export function diffDays(a: Date, b: Date): number {
  // a - b の日数（ローカルの0時基準）
  const a0 = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const b0 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.floor((a0 - b0) / 86400000);
}
