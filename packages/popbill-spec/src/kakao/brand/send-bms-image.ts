import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoBrandMessageApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendBMSImageApiRequestPath = never
export type KakaoSendBMSImageApiRequestQuery = never
export type KakaoSendBMSImageApiRequestBody = KakaoBrandMessageApiBody & { plusFriendID: string }
export type KakaoSendBMSImageApiRequest = KakaoApiRequest<
  KakaoSendBMSImageApiRequestPath,
  KakaoSendBMSImageApiRequestQuery,
  KakaoSendBMSImageApiRequestBody
>
export type KakaoSendBMSImageApiResponse = KakaoReceiptApiResponse
