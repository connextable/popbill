import type { KakaoApiRequest } from '../common'
import type { KakaoNotificationTemplateApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetATSTemplateApiRequestPath = { templateCode: string }
export type KakaoGetATSTemplateApiRequestQuery = never
export type KakaoGetATSTemplateApiRequestBody = never
export type KakaoGetATSTemplateApiRequest = KakaoApiRequest<
  KakaoGetATSTemplateApiRequestPath,
  KakaoGetATSTemplateApiRequestQuery,
  KakaoGetATSTemplateApiRequestBody
>
export type KakaoGetATSTemplateApiResponse = KakaoNotificationTemplateApiModel
