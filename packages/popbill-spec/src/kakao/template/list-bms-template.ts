import type { KakaoApiRequest } from '../common'
import type { KakaoBrandTemplateApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoListBMSTemplateApiRequestPath = never
export type KakaoListBMSTemplateApiRequestQuery = never
export type KakaoListBMSTemplateApiRequestBody = never
export type KakaoListBMSTemplateApiRequest = KakaoApiRequest<
  KakaoListBMSTemplateApiRequestPath,
  KakaoListBMSTemplateApiRequestQuery,
  KakaoListBMSTemplateApiRequestBody
>
export type KakaoListBMSTemplateApiResponse = KakaoBrandTemplateApiModel[]
