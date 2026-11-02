import type { KakaoApiRequest } from '../common'
import type { KakaoMessagesApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetMessagesApiRequestPath = { receiptNum: string }
export type KakaoGetMessagesApiRequestQuery = never
export type KakaoGetMessagesApiRequestBody = never
export type KakaoGetMessagesApiRequest = KakaoApiRequest<
  KakaoGetMessagesApiRequestPath,
  KakaoGetMessagesApiRequestQuery,
  KakaoGetMessagesApiRequestBody
>
export type KakaoGetMessagesApiResponse = KakaoMessagesApiModel
