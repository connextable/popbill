import type { KakaoApiRequest } from '../common'
import type { KakaoSenderNumberApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetSenderNumberListApiRequestPath = never
export type KakaoGetSenderNumberListApiRequestQuery = never
export type KakaoGetSenderNumberListApiRequestBody = never
export type KakaoGetSenderNumberListApiRequest = KakaoApiRequest<
  KakaoGetSenderNumberListApiRequestPath,
  KakaoGetSenderNumberListApiRequestQuery,
  KakaoGetSenderNumberListApiRequestBody
>
export type KakaoGetSenderNumberListApiResponse = KakaoSenderNumberApiModel[]
