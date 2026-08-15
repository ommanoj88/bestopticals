export function rupees(inr: number): string {
  return '₹' + inr.toLocaleString('en-IN')
}
