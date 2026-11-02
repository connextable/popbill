import type { KakaoApiRequest, KakaoUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetSentListURLApiRequestPath = never
export type KakaoGetSentListURLApiRequestQuery = { TG: 'BOX' }
export type KakaoGetSentListURLApiRequestBody = never
export type KakaoGetSentListURLApiRequest = KakaoApiRequest<
  KakaoGetSentListURLApiRequestPath,
  KakaoGetSentListURLApiRequestQuery,
  KakaoGetSentListURLApiRequestBody
>
export type KakaoGetSentListURLApiResponse = KakaoUrlApiResponse
