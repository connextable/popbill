import type { KakaoApiRequest } from '../common'
import type { KakaoNotificationTemplateApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoListATSTemplateApiRequestPath = never
export type KakaoListATSTemplateApiRequestQuery = never
export type KakaoListATSTemplateApiRequestBody = never
export type KakaoListATSTemplateApiRequest = KakaoApiRequest<
  KakaoListATSTemplateApiRequestPath,
  KakaoListATSTemplateApiRequestQuery,
  KakaoListATSTemplateApiRequestBody
>
export type KakaoListATSTemplateApiResponse = KakaoNotificationTemplateApiModel[]
