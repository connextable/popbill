import type { KakaoApiRequest, KakaoOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoCancelReserveApiRequestPath = { receiptNum: string }
export type KakaoCancelReserveApiRequestQuery = never
export type KakaoCancelReserveApiRequestBody = never
export type KakaoCancelReserveApiRequest = KakaoApiRequest<
  KakaoCancelReserveApiRequestPath,
  KakaoCancelReserveApiRequestQuery,
  KakaoCancelReserveApiRequestBody
>
export type KakaoCancelReserveApiResponse = KakaoOperationApiResponse
