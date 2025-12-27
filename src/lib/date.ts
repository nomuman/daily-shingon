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
