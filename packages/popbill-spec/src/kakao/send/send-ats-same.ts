import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoNotificationApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendATS_sameApiRequestPath = never
export type KakaoSendATS_sameApiRequestQuery = never
export type KakaoSendATS_sameApiRequestBody = KakaoNotificationApiBody
export type KakaoSendATS_sameApiRequest = KakaoApiRequest<
  KakaoSendATS_sameApiRequestPath,
  KakaoSendATS_sameApiRequestQuery,
  KakaoSendATS_sameApiRequestBody
>
export type KakaoSendATS_sameApiResponse = KakaoReceiptApiResponse
