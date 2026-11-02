import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum } from '@/internal/validation'
import type { MessageBinaryFile, MessageRecipient } from '../types'
import type { MessageRuntimeContext } from './context'
import type * as Spec from '@connextable/popbill-spec'

export function required(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') throw createLegacyValidationError(message)
}
export async function request<T>(
  context: MessageRuntimeContext,
  corpNum: string,
  uri: string,
  userId?: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  return context.requestClient.requestJson<T>({
    corpNum,
    uri,
    userId,
    method,
    body: body === undefined ? undefined : stringifyWithoutEmptyValues(body),
  })
}
export async function url(context: MessageRuntimeContext, corpNum: string, uri: string, userId?: string): Promise<string> {
  return (await request<Spec.MessageUrlApiResponse>(context, corpNum, uri, userId)).url
}
export function mapMessages(messages: MessageRecipient | MessageRecipient[]): Spec.MessageRecipientApiModel[] {
  const list = Array.isArray(messages) ? messages : [messages]
  if (!list.length || list.some((message) => !message || typeof message !== 'object'))
    throw createLegacyValidationError('문자정보가 입력되지 않았습니다.')
  return list.map((message) => ({
    snd: message.Sender,
    sndnm: message.SenderName,
    rcv: message.Receiver,
    rcvnm: message.ReceiverName,
    msg: message.Contents ?? message.Content,
    sjt: message.Subject,
    interOPRefKey: message.interOPRefKey,
  }))
}
export async function send(
  context: MessageRuntimeContext,
  messageType: Spec.MessageSendType,
  corpNum: string,
  sender: string,
  senderName: string,
  subject: string,
  contents: string,
  messages: MessageRecipient | MessageRecipient[],
  reserveDT?: string,
  adsYN = false,
  requestNum?: string,
  userId?: string,
  file?: string | MessageBinaryFile
): Promise<string> {
  if (!['SMS', 'LMS', 'MMS', 'XMS'].includes(messageType)) throw createLegacyValidationError('메시지 유형이 올바르지 않습니다.')
  const body: Spec.MessageSendApiBody = {
    requestNum,
    snd: sender,
    sndnm: senderName,
    msgs: mapMessages(messages),
    subject,
    content: contents,
    adsYN,
    sndDT: reserveDT,
  }
  if (file === undefined) return (await request<Spec.MessageReceiptApiResponse>(context, corpNum, '/' + messageType, userId, 'POST', body)).receiptNum
  const error = validateCorpNum(corpNum)
  if (error) throw error
  let binary: MessageBinaryFile
  if (typeof file === 'string') {
    required(file, '첨부파일 경로가 입력되지 않았습니다.')
    binary = { fileName: path.basename(file), fileData: await readFile(file) }
  } else {
    binary = file
  }
  if (!binary || !Buffer.isBuffer(binary.fileData)) throw createLegacyValidationError('첨부파일 바이너리가 입력되지 않았습니다.')
  required(binary.fileName, '첨부파일명이 입력되지 않았습니다.')
  // MMS uses file; document attachment APIs use Filedata.
  const boundary = '----POPBILL-MESSAGE-' + randomUUID()
  const fileName = path.basename(binary.fileName).replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/"/g, '%22')
  const payload = Buffer.concat([
    Buffer.from('--' + boundary + '\r\nContent-Disposition: form-data; name="form"\r\n\r\n' + stringifyWithoutEmptyValues(body) + '\r\n'),
    Buffer.from(
      '--' +
        boundary +
        '\r\nContent-Disposition: form-data; name="file"; filename="' +
        fileName +
        '"\r\nContent-Type: application/octet-stream\r\n\r\n'
    ),
    binary.fileData,
    Buffer.from('\r\n--' + boundary + '--\r\n'),
  ])
  const response = await context.requestClient.requestJson<Spec.MessageReceiptApiResponse>({
    corpNum,
    uri: '/MMS',
    userId,
    method: 'POST',
    body: payload,
    contentType: 'multipart/form-data; boundary=' + boundary,
  })
  return response.receiptNum
}
