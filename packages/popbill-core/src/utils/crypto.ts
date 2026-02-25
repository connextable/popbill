import { createHash, createHmac } from 'node:crypto'

export function sha256Base64(input: string): string {
  return createHash('sha256').update(input).digest('base64')
}

export function sha1Base64(input: string): string {
  return createHash('sha1').update(input).digest('base64')
}

export function hmacSha256Base64(input: string, secretKeyBase64: string): string {
  return createHmac('sha256', Buffer.from(secretKeyBase64, 'base64')).update(input).digest('base64')
}
