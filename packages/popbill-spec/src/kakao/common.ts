import type { PopbillApiRequestHeaders } from '../headers'
import type { PopbillApiRequest } from '../request'
export type KakaoApiRequest<P = never, Q = never, B = never> = PopbillApiRequest<P, Q, B, PopbillApiRequestHeaders> &
  ([P] extends [never] ? unknown : { path: P }) &
  ([Q] extends [never] ? unknown : { query: Q }) &
  ([B] extends [never] ? unknown : { body: B })
export interface KakaoOperationApiResponse {
  code: number
  message: string
}
export interface KakaoUrlApiResponse {
  url: string
}
export interface KakaoReceiptApiResponse {
  receiptNum: string
}
export type KakaoMessageType = 'ATS' | 'FTS' | 'FMS' | 'BMS'
export type KakaoBrandTargeting = 'I' | 'O' | 'N' | 'M' | (string & {})
export interface KakaoBinaryFile {
  fileName: string
  fileData: Uint8Array
}
