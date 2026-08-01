// Rupees, no paise (prices are whole-rupee integers).
export function rupees(inr: number): string {
  return '₹' + inr.toLocaleString('en-IN')
}
