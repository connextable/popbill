import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoBrandMessageApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendBMSTextApiRequestPath = never
export type KakaoSendBMSTextApiRequestQuery = never
export type KakaoSendBMSTextApiRequestBody = KakaoBrandMessageApiBody & { plusFriendID: string }
export type KakaoSendBMSTextApiRequest = KakaoApiRequest<
  KakaoSendBMSTextApiRequestPath,
  KakaoSendBMSTextApiRequestQuery,
  KakaoSendBMSTextApiRequestBody
>
export type KakaoSendBMSTextApiResponse = KakaoReceiptApiResponse
