import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoNotificationApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendATS_multiApiRequestPath = never
export type KakaoSendATS_multiApiRequestQuery = never
export type KakaoSendATS_multiApiRequestBody = KakaoNotificationApiBody
export type KakaoSendATS_multiApiRequest = KakaoApiRequest<
  KakaoSendATS_multiApiRequestPath,
  KakaoSendATS_multiApiRequestQuery,
  KakaoSendATS_multiApiRequestBody
>
export type KakaoSendATS_multiApiResponse = KakaoReceiptApiResponse
