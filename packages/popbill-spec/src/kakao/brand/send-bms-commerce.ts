import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoBrandMessageApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendBMSCommerceApiRequestPath = never
export type KakaoSendBMSCommerceApiRequestQuery = never
export type KakaoSendBMSCommerceApiRequestBody = KakaoBrandMessageApiBody & { plusFriendID: string }
export type KakaoSendBMSCommerceApiRequest = KakaoApiRequest<
  KakaoSendBMSCommerceApiRequestPath,
  KakaoSendBMSCommerceApiRequestQuery,
  KakaoSendBMSCommerceApiRequestBody
>
export type KakaoSendBMSCommerceApiResponse = KakaoReceiptApiResponse
