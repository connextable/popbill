import type { KakaoApiRequest, KakaoUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetSenderNumberMgtURLApiRequestPath = never
export type KakaoGetSenderNumberMgtURLApiRequestQuery = { TG: 'SENDER' }
export type KakaoGetSenderNumberMgtURLApiRequestBody = never
export type KakaoGetSenderNumberMgtURLApiRequest = KakaoApiRequest<
  KakaoGetSenderNumberMgtURLApiRequestPath,
  KakaoGetSenderNumberMgtURLApiRequestQuery,
  KakaoGetSenderNumberMgtURLApiRequestBody
>
export type KakaoGetSenderNumberMgtURLApiResponse = KakaoUrlApiResponse
