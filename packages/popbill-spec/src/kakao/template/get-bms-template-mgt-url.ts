import type { KakaoApiRequest, KakaoUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetBMSTemplateMgtURLApiRequestPath = never
export type KakaoGetBMSTemplateMgtURLApiRequestQuery = { TG: 'BMS_TEMPLATE' }
export type KakaoGetBMSTemplateMgtURLApiRequestBody = never
export type KakaoGetBMSTemplateMgtURLApiRequest = KakaoApiRequest<
  KakaoGetBMSTemplateMgtURLApiRequestPath,
  KakaoGetBMSTemplateMgtURLApiRequestQuery,
  KakaoGetBMSTemplateMgtURLApiRequestBody
>
export type KakaoGetBMSTemplateMgtURLApiResponse = KakaoUrlApiResponse
