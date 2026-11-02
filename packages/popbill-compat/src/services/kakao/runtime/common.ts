import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import type * as Spec from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum } from '@/internal/validation'
import type { KakaoBinaryFile, KakaoButtons, KakaoReceivers } from '../types'
import type { KakaoRuntimeContext } from './context'

export function required(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) throw createLegacyValidationError(message)
}
export async function request<T>(
  context: KakaoRuntimeContext,
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
export async function url(context: KakaoRuntimeContext, corpNum: string, uri: string, userId?: string): Promise<string> {
  return (await request<Spec.KakaoUrlApiResponse>(context, corpNum, uri, userId)).url
}
export function identifier(value: string, message: string): string {
  required(value, message)
  return encodeURIComponent(value)
}
export function receivers(value: KakaoReceivers): Spec.KakaoLegacyReceiverApiModel[] {
  const list = Array.isArray(value) ? value : [value]
  if (list.length === 0 || list.some((item) => !item || !item.rcv)) throw createLegacyValidationError('수신자 정보가 올바르지 않습니다.')
  return list.map(({ rcv, rcvnm, msg, altsjt, altmsg, interOPRefKey, btns, emphasizeTitle }) => ({
    rcv,
    rcvnm,
    msg,
    altsjt,
    altmsg,
    interOPRefKey,
    btns,
    emphasizeTitle,
  }))
}
export function buttons(value?: KakaoButtons): Spec.KakaoButtonApiModel[] {
  return (value === undefined ? [] : Array.isArray(value) ? value : [value]).map(({ t, n, u1, u2, tg, telNum }) => ({ t, n, u1, u2, tg, telNum }))
}
export async function sendNotification(
  context: KakaoRuntimeContext,
  corpNum: string,
  templateCode: string,
  sender: string | undefined,
  content: string | undefined,
  altSubject: string | undefined,
  altContent: string | undefined,
  altSendType: string | undefined,
  sendAt: string | undefined,
  recipients: KakaoReceivers,
  userId?: string,
  requestNum?: string,
  btns?: KakaoButtons,
  emphasizeTitle?: string
): Promise<string> {
  required(templateCode, '템플릿 코드가 입력되지 않았습니다.')
  const msgs = receivers(recipients).map((item) => ({ ...item, emphasizeTitle: item.emphasizeTitle ?? emphasizeTitle }))
  return (
    await request<Spec.KakaoReceiptApiResponse>(context, corpNum, '/ATS', userId, 'POST', {
      templateCode,
      snd: sender,
      content,
      altSubject,
      altContent,
      altSendType,
      sndDT: sendAt,
      requestNum,
      msgs,
      btns: buttons(btns),
    })
  ).receiptNum
}
export async function sendFriend(
  context: KakaoRuntimeContext,
  corpNum: string,
  channel: string,
  sender: string | undefined,
  content: string | undefined,
  altSubject: string | undefined,
  altContent: string | undefined,
  altSendType: string | undefined,
  sendAt: string | undefined,
  advertising: boolean | undefined,
  recipients: KakaoReceivers,
  btns: KakaoButtons | undefined,
  userId?: string,
  requestNum?: string,
  imageUrl?: string,
  filePath?: string
): Promise<string> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  required(channel, '카카오톡 검색용 아이디가 입력되지 않았습니다.')
  const body = {
    plusFriendID: channel,
    snd: sender,
    content,
    altSubject,
    altContent,
    altSendType,
    sndDT: sendAt,
    adsYN: advertising,
    requestNum,
    msgs: receivers(recipients),
    btns: buttons(btns),
    imageURL: imageUrl,
  }
  if (filePath !== undefined)
    return (
      await upload<Spec.KakaoReceiptApiResponse>(
        context,
        corpNum,
        '/FMS',
        [{ fileName: filePath, fileData: await readFile(filePath) }],
        'file',
        userId,
        body
      )
    ).receiptNum
  return (await request<Spec.KakaoReceiptApiResponse>(context, corpNum, '/FTS', userId, 'POST', body)).receiptNum
}
const BRAND_CHANNEL_FIELDS = ['plusFriendID', 'targeting', 'adultYN'] as const
const BRAND_SEND_OPTIONS = ['unsubscribeNo', 'altYN', 'sendNum', 'altSubject', 'altContent', 'altUnsubscribeNo', 'reserveDT', 'requestNum'] as const
const BRAND_DECORATION_FIELDS = ['coupon', 'btns'] as const
/** Each content type keeps its documented wire fields; shared options have one definition. */
const BRAND_FIELDS = {
  Text: [...BRAND_CHANNEL_FIELDS, 'content', ...BRAND_DECORATION_FIELDS, ...BRAND_SEND_OPTIONS],
  Image: [...BRAND_CHANNEL_FIELDS, 'imageUrl', 'imageLink', 'content', ...BRAND_DECORATION_FIELDS, ...BRAND_SEND_OPTIONS],
  WideImage: [...BRAND_CHANNEL_FIELDS, 'imageUrl', 'imageLink', 'content', ...BRAND_DECORATION_FIELDS, ...BRAND_SEND_OPTIONS],
  WideList: [...BRAND_CHANNEL_FIELDS, 'header', 'item', ...BRAND_DECORATION_FIELDS, ...BRAND_SEND_OPTIONS],
  CarouselFeed: [...BRAND_CHANNEL_FIELDS, 'carousel', 'tail', ...BRAND_SEND_OPTIONS],
  Commerce: [...BRAND_CHANNEL_FIELDS, 'imageUrl', 'imageLink', 'addContent', 'commerce', ...BRAND_DECORATION_FIELDS, ...BRAND_SEND_OPTIONS],
  CarouselCommerce: [...BRAND_CHANNEL_FIELDS, 'head', 'carousel', 'tail', ...BRAND_SEND_OPTIONS],
  Variable: [
    'templateCode',
    'targeting',
    'contentVariable',
    'buttonVariable',
    'couponVariable',
    'commerceVariable',
    'carouselVariable',
    ...BRAND_SEND_OPTIONS,
  ],
} as const satisfies Record<string, readonly (keyof Spec.KakaoBrandMessageApiModel)[]>
export type BrandKind = keyof typeof BRAND_FIELDS
export async function sendBrand(
  context: KakaoRuntimeContext,
  kind: BrandKind,
  corpNum: string,
  message: Spec.KakaoBrandMessageApiModel,
  userId?: string
): Promise<string> {
  if (!message || typeof message !== 'object') throw createLegacyValidationError('브랜드 메시지 정보가 입력되지 않았습니다.')
  const body = Object.fromEntries(BRAND_FIELDS[kind].map((key) => [key, message[key]]))
  return (await request<Spec.KakaoReceiptApiResponse>(context, corpNum, '/BMS/' + kind, userId, 'POST', { ...body, msgs: message.receivers }))
    .receiptNum
}
export async function upload<T>(
  context: KakaoRuntimeContext,
  corpNum: string,
  uri: string,
  files: KakaoBinaryFile[],
  fieldName: 'image' | 'images' | 'file',
  userId?: string,
  form?: unknown
): Promise<T> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  if (files.length === 0) throw createLegacyValidationError('파일이 입력되지 않았습니다.')
  const boundary = '----POPBILL-KAKAO-' + randomUUID()
  const chunks: Buffer[] = [
    Buffer.from(
      '--' +
        boundary +
        '\r\nContent-Disposition: form-data; name="form"\r\n\r\n' +
        (form === undefined ? '' : stringifyWithoutEmptyValues(form)) +
        '\r\n'
    ),
  ]
  for (const file of files) {
    required(file.fileName, '파일명이 입력되지 않았습니다.')
    if (!Buffer.isBuffer(file.fileData)) throw createLegacyValidationError('파일 데이터가 입력되지 않았습니다.')
    const name = path.basename(file.fileName).replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/"/g, '%22')
    chunks.push(
      Buffer.from(
        '--' +
          boundary +
          '\r\nContent-Disposition: form-data; name="' +
          fieldName +
          '"; filename="' +
          name +
          '"\r\nContent-Type: application/octet-stream\r\n\r\n'
      ),
      file.fileData,
      Buffer.from('\r\n')
    )
  }
  chunks.push(Buffer.from('--' + boundary + '--\r\n'))
  return context.requestClient.requestJson<T>({
    corpNum,
    uri,
    userId,
    method: 'POST',
    body: Buffer.concat(chunks),
    contentType: 'multipart/form-data;charset=utf-8; boundary=' + boundary,
  })
}
export async function uploadImage<T>(
  context: KakaoRuntimeContext,
  corpNum: string,
  kind: string,
  value: string | string[] | KakaoBinaryFile | KakaoBinaryFile[],
  binary: boolean,
  multiple: boolean,
  userId?: string
): Promise<T> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  const inputs = Array.isArray(value) ? value : [value]
  const files: KakaoBinaryFile[] = []
  for (const input of inputs) {
    if (binary) {
      if (!input || typeof input === 'string') throw createLegacyValidationError('파일이 입력되지 않았습니다.')
      files.push(input)
    } else {
      required(input, '이미지 파일 경로가 입력되지 않았습니다.')
      files.push({ fileName: input, fileData: await readFile(input) })
    }
  }
  return upload<T>(context, corpNum, '/BMS/Upload/Image/' + kind, files, multiple ? 'images' : 'image', userId)
}
