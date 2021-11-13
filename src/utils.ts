export function power(x: number, y: number): number {
  return y === 0 ? 1 : x * power(x, y - 1);
}
