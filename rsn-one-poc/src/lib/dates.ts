const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
/** "12 Sep 2024" */
export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
/** "12 Sep" */
export function fmtDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
/** "12 Sep, 10:30 AM" */
export function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${h}:${m} ${ap}`;
}
/** "8 Sep 2024, 10:24 AM" */
export function fmtLong(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${h}:${m} ${ap}`;
}
/** "2h ago" / "12 Aug" */
export function fmtAgo(iso: string, now = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  const h = Math.floor(diff / 36e5);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return fmtDay(iso);
}
export function daysAgo(n: number, h = 10, m = 30): string {
  const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, m, 0, 0);
  return d.toISOString();
}
export function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 36e5).toISOString();
}
