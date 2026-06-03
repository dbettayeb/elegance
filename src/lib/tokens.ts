import { randomBytes, createHash } from 'crypto'

export function generateAccessToken(length = 8): string {
  return randomBytes(length)
    .toString('base64url')
    .slice(0, length)
    .toLowerCase()
}

export function hashIP(ip: string): string {
  return createHash('sha256')
    .update(ip + process.env.IP_HASH_SALT!)
    .digest('hex')
    .slice(0, 16)
}