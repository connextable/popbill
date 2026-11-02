import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoBrandMessageApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendBMSWideListApiRequestPath = never
export type KakaoSendBMSWideListApiRequestQuery = never
export type KakaoSendBMSWideListApiRequestBody = KakaoBrandMessageApiBody & { plusFriendID: string }
export type KakaoSendBMSWideListApiRequest = KakaoApiRequest<
  KakaoSendBMSWideListApiRequestPath,
  KakaoSendBMSWideListApiRequestQuery,
  KakaoSendBMSWideListApiRequestBody
>
export type KakaoSendBMSWideListApiResponse = KakaoReceiptApiResponse
