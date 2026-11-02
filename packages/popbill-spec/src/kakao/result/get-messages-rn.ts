import type { KakaoApiRequest } from '../common'
import type { KakaoMessagesApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetMessagesRNApiRequestPath = { requestNum: string }
export type KakaoGetMessagesRNApiRequestQuery = never
export type KakaoGetMessagesRNApiRequestBody = never
export type KakaoGetMessagesRNApiRequest = KakaoApiRequest<
  KakaoGetMessagesRNApiRequestPath,
  KakaoGetMessagesRNApiRequestQuery,
  KakaoGetMessagesRNApiRequestBody
>
export type KakaoGetMessagesRNApiResponse = KakaoMessagesApiModel
