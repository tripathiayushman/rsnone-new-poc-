let seq = 0;
export function orderId(): string {
  // mock format matches C25/C26: RSN10234; new orders count upward from 10482 (C13)
  const n = 10482 + (Date.now() % 1000) + seq++;
  return `RSN${n}`;
}
export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}
