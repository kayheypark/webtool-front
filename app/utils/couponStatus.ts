const statusClassMap: Record<string, string> = {
  A: '',
  E: 'used',
  X: 'expire',
  D: 'delete',
}

export function couponStatusClass(status: string): string {
  return statusClassMap[status] ?? ''
}
