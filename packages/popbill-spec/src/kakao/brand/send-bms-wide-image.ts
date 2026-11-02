import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoBrandMessageApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendBMSWideImageApiRequestPath = never
export type KakaoSendBMSWideImageApiRequestQuery = never
export type KakaoSendBMSWideImageApiRequestBody = KakaoBrandMessageApiBody & { plusFriendID: string }
export type KakaoSendBMSWideImageApiRequest = KakaoApiRequest<
  KakaoSendBMSWideImageApiRequestPath,
  KakaoSendBMSWideImageApiRequestQuery,
  KakaoSendBMSWideImageApiRequestBody
>
export type KakaoSendBMSWideImageApiResponse = KakaoReceiptApiResponse
