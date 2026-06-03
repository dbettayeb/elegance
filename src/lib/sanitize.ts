export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .slice(0, maxLength)
}

export function sanitizeName(input: string): string {
  return sanitizeText(input, 80)
}

export function sanitizePhone(input: string): string {
  return input.replace(/[^0-9+\s\-]/g, '').slice(0, 20)
}