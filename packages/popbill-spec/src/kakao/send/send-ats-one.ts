import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoNotificationApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendATS_oneApiRequestPath = never
export type KakaoSendATS_oneApiRequestQuery = never
export type KakaoSendATS_oneApiRequestBody = KakaoNotificationApiBody
export type KakaoSendATS_oneApiRequest = KakaoApiRequest<
  KakaoSendATS_oneApiRequestPath,
  KakaoSendATS_oneApiRequestQuery,
  KakaoSendATS_oneApiRequestBody
>
export type KakaoSendATS_oneApiResponse = KakaoReceiptApiResponse
