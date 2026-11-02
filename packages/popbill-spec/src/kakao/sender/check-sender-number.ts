import type { KakaoApiRequest, KakaoOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoCheckSenderNumberApiRequestPath = { senderNumber: string }
export type KakaoCheckSenderNumberApiRequestQuery = never
export type KakaoCheckSenderNumberApiRequestBody = never
export type KakaoCheckSenderNumberApiRequest = KakaoApiRequest<
  KakaoCheckSenderNumberApiRequestPath,
  KakaoCheckSenderNumberApiRequestQuery,
  KakaoCheckSenderNumberApiRequestBody
>
export type KakaoCheckSenderNumberApiResponse = KakaoOperationApiResponse
