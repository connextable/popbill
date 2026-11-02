import type { KakaoApiRequest, KakaoUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetATSTemplateMgtURLApiRequestPath = never
export type KakaoGetATSTemplateMgtURLApiRequestQuery = { TG: 'TEMPLATE' }
export type KakaoGetATSTemplateMgtURLApiRequestBody = never
export type KakaoGetATSTemplateMgtURLApiRequest = KakaoApiRequest<
  KakaoGetATSTemplateMgtURLApiRequestPath,
  KakaoGetATSTemplateMgtURLApiRequestQuery,
  KakaoGetATSTemplateMgtURLApiRequestBody
>
export type KakaoGetATSTemplateMgtURLApiResponse = KakaoUrlApiResponse
