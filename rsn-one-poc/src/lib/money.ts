/** Indian-style grouping, as in the mocks: ₹25,199 / ₹1,00,000 */
export function inr(n: number, opts: { sign?: boolean } = {}): string {
  const abs = Math.abs(Math.round(n));
  const s = abs.toString();
  let out: string;
  if (s.length <= 3) out = s;
  else {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    out = rest + ',' + last3;
  }
  const sign = n < 0 ? '- ' : opts.sign ? '+ ' : '';
  return `${sign}₹${out}`;
}
