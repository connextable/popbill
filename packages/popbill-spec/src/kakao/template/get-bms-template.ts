import type { KakaoApiRequest } from '../common'
import type { KakaoBrandTemplateApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetBMSTemplateApiRequestPath = { templateCode: string }
export type KakaoGetBMSTemplateApiRequestQuery = never
export type KakaoGetBMSTemplateApiRequestBody = never
export type KakaoGetBMSTemplateApiRequest = KakaoApiRequest<
  KakaoGetBMSTemplateApiRequestPath,
  KakaoGetBMSTemplateApiRequestQuery,
  KakaoGetBMSTemplateApiRequestBody
>
export type KakaoGetBMSTemplateApiResponse = KakaoBrandTemplateApiModel
