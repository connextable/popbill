import type { KakaoApiRequest, KakaoOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoCancelReserveRNApiRequestPath = { requestNum: string }
export type KakaoCancelReserveRNApiRequestQuery = never
export type KakaoCancelReserveRNApiRequestBody = never
export type KakaoCancelReserveRNApiRequest = KakaoApiRequest<
  KakaoCancelReserveRNApiRequestPath,
  KakaoCancelReserveRNApiRequestQuery,
  KakaoCancelReserveRNApiRequestBody
>
export type KakaoCancelReserveRNApiResponse = KakaoOperationApiResponse
