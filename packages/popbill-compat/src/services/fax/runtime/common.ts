import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { escapeMultipartFileName, stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import type * as Spec from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum } from '@/internal/validation'
import type { FaxBinaryFile, FaxReceiver, FaxResendOptions, FaxSendBinaryOptions, FaxSendFileOptions, FaxSendOptions } from '../types'
import type { FaxRuntimeContext } from './context'

export function requiredText(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) throw createLegacyValidationError(message)
}
export function validateBusinessNumber(corpNum: string): void {
  const error = validateCorpNum(corpNum)
  if (error) throw error
}
export async function request<T>(
  context: FaxRuntimeContext,
  corpNum: string,
  uri: string,
  userId?: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  validateBusinessNumber(corpNum)
  return context.requestClient.requestJson<T>({
    corpNum,
    uri,
    userId,
    method,
    body: body === undefined ? undefined : stringifyWithoutEmptyValues(body),
  })
}
export async function url(context: FaxRuntimeContext, corpNum: string, uri: string, userId?: string): Promise<string> {
  return (await request<Spec.FaxUrlApiResponse>(context, corpNum, uri, userId)).url
}
export function numberPath(prefix: string, number: string, missingMessage: string): string {
  requiredText(number, missingMessage)
  return `${prefix}${encodeURIComponent(number)}`
}
export function receiveNumberType(value: string | null | undefined): Spec.FaxReceiveNumberType {
  if (value === undefined || value === null || value === '') return '일반'
  if (value !== '일반' && value !== '지능') throw createLegacyValidationError('수신번호 유형이 올바르지 않습니다.')
  return value
}

export function parseSendOptions(binary: boolean, args: unknown[]): FaxSendFileOptions | FaxSendBinaryOptions {
  const [first, receiver, third, fourth, fifth, senderName, adsYN, title, requestNum, userId] = args
  if (first && typeof first === 'object' && !Array.isArray(first)) return first as FaxSendFileOptions | FaxSendBinaryOptions
  if (args.length === 4 && Array.isArray(receiver)) {
    return { SenderNum: first, Receiver: receiver, [binary ? 'BinaryFiles' : 'FilePaths']: third, ReserveDT: fourth } as unknown as
      | FaxSendFileOptions
      | FaxSendBinaryOptions
  }
  return {
    SenderNum: first,
    Receiver: receiver,
    ReceiverName: third,
    [binary ? 'BinaryFiles' : 'FilePaths']: fourth,
    ReserveDT: fifth,
    SenderName: senderName,
    AdsYN: adsYN,
    Title: title,
    RequestNum: requestNum,
    UserID: userId,
  } as unknown as FaxSendFileOptions | FaxSendBinaryOptions
}
export function parseResendOptions(byRequestNumber: boolean, args: unknown[]): FaxResendOptions {
  const [first, sender, senderName, receiver, receiverName, reserveDT, title, requestNum, userId] = args
  if (first && typeof first === 'object' && !Array.isArray(first)) return first as FaxResendOptions
  const original = { [byRequestNumber ? 'OrgRequestNum' : 'ReceiptNum']: first }
  if (byRequestNumber && args.length === 3) return { ...original, RequestNum: sender, Title: senderName } as FaxResendOptions
  // Legacy registers two overloads of this arity; the last (receiver override) wins.
  if (byRequestNumber && args.length === 6 && !Array.isArray(receiver)) {
    return {
      ...original,
      Receiver: sender,
      ReceiverName: senderName,
      ReserveDT: receiver,
      Title: receiverName,
      RequestNum: reserveDT,
    } as FaxResendOptions
  }
  if (Array.isArray(receiver) && (args.length === 5 || args.length === 7)) {
    return {
      ...original,
      SenderNum: sender,
      SenderName: senderName,
      Receiver: receiver,
      ReserveDT: receiverName,
      Title: reserveDT,
      RequestNum: title,
    } as FaxResendOptions
  }
  return {
    ...original,
    SenderNum: sender,
    SenderName: senderName,
    Receiver: receiver,
    ReceiverName: receiverName,
    ReserveDT: reserveDT,
    Title: title,
    RequestNum: requestNum,
    UserID: userId,
  } as FaxResendOptions
}
function receivers(value: FaxSendOptions['Receiver'], receiveName?: string, interOPRefKey?: string): Spec.FaxReceiverApiModel[] {
  const list: FaxReceiver[] = typeof value === 'string' ? [{ receiveNum: value, receiveName, interOPRefKey }] : Array.isArray(value) ? value : [value]
  if (list.length === 0) throw createLegacyValidationError('수신자 정보가 입력되지 않았습니다.')
  return list.map((entry) => {
    requiredText(entry?.receiveNum, '수신번호가 입력되지 않았습니다.')
    return { rcv: entry.receiveNum, rcvnm: entry.receiveName, interOPRefKey: entry.interOPRefKey }
  })
}
export function resendBody(options: FaxResendOptions): Spec.FaxResendApiModel {
  return {
    requestNum: options.RequestNum,
    snd: options.SenderNum,
    sndnm: options.SenderName,
    rcvs:
      options.Receiver === undefined || options.Receiver === ''
        ? undefined
        : receivers(options.Receiver, options.ReceiverName, options.interOPRefKey),
    title: options.Title,
    sndDT: options.ReserveDT,
  }
}
export async function send(
  context: FaxRuntimeContext,
  corpNum: string,
  options: FaxSendFileOptions | FaxSendBinaryOptions,
  binary: boolean
): Promise<string> {
  validateBusinessNumber(corpNum)
  requiredText(options?.SenderNum, '발신번호가 입력되지 않았습니다.')
  const receiverList = receivers(options.Receiver, options.ReceiverName, options.interOPRefKey)
  let files: FaxBinaryFile[]
  if (binary) {
    files = (options as FaxSendBinaryOptions).BinaryFiles
    if (!Array.isArray(files) || files.length === 0 || files.length > 30)
      throw createLegacyValidationError('전송할 파일은 1개 이상 30개 이하로 입력해야 합니다.')
    for (const file of files) {
      requiredText(file?.fileName, '전송할 파일명이 입력되지 않았습니다.')
      if (!Buffer.isBuffer(file.fileData)) throw createLegacyValidationError('전송할 파일 바이너리가 입력되지 않았습니다.')
    }
  } else {
    const input = (options as FaxSendFileOptions).FilePaths
    const paths = typeof input === 'string' ? [input] : input
    if (!Array.isArray(paths) || paths.length === 0 || paths.length > 30)
      throw createLegacyValidationError('전송할 파일은 1개 이상 30개 이하로 입력해야 합니다.')
    for (const filePath of paths) requiredText(filePath, '전송할 파일경로가 입력되지 않았습니다.')
    files = await Promise.all(paths.map(async (filePath) => ({ fileName: path.basename(filePath), fileData: await readFile(filePath) })))
  }
  const form: Spec.FaxSendApiModel = {
    requestNum: options.RequestNum,
    snd: options.SenderNum,
    sndnm: options.SenderName,
    rcvs: receiverList,
    fCnt: files.length,
    title: options.Title,
    adsYN: options.AdsYN,
    sndDT: options.ReserveDT,
  }
  const payload = multipart(form, files)
  const result = await context.requestClient.requestJson<Spec.FaxReceiptApiResponse>({
    corpNum,
    uri: '/FAX',
    userId: options.UserID,
    method: 'POST',
    body: payload.body,
    contentType: payload.contentType,
  })
  return result.receiptNum
}
function multipart(form: Spec.FaxSendApiModel, files: FaxBinaryFile[]): { body: Buffer; contentType: string } {
  const boundary = `----POPBILL-FAX-${randomUUID()}`
  const chunks: Buffer[] = [
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="form"\r\n\r\n${stringifyWithoutEmptyValues(form)}\r\n`),
  ]
  for (const file of files) {
    const fileName = escapeMultipartFileName(path.basename(file.fileName))
    chunks.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`
      ),
      file.fileData,
      Buffer.from('\r\n')
    )
  }
  chunks.push(Buffer.from(`--${boundary}--\r\n`))
  return { body: Buffer.concat(chunks), contentType: `multipart/form-data; boundary=${boundary}` }
}
