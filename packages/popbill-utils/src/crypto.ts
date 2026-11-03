import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/** Hash to equal-length buffers before comparing secrets without a length exception. */
export function constantTimeEqual(left: string, right: string): boolean {
  return timingSafeEqual(Buffer.from(sha256Base64(left), 'base64'), Buffer.from(sha256Base64(right), 'base64'))
}

export function sha256Base64(input: string): string {
  return createHash('sha256').update(input).digest('base64')
}

export function sha1Base64(input: string | Uint8Array): string {
  return createHash('sha1').update(input).digest('base64')
}

export function hmacSha256Base64(input: string, secretKeyBase64: string): string {
  return createHmac('sha256', Buffer.from(secretKeyBase64, 'base64')).update(input).digest('base64')
}
