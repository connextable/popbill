import type { KakaoApiRequest, KakaoOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoCancelReserveRNbyRCVApiRequestPath = { requestNum: string }
export type KakaoCancelReserveRNbyRCVApiRequestQuery = never
export type KakaoCancelReserveRNbyRCVApiRequestBody = { receiveNum: string }
export type KakaoCancelReserveRNbyRCVApiRequest = KakaoApiRequest<
  KakaoCancelReserveRNbyRCVApiRequestPath,
  KakaoCancelReserveRNbyRCVApiRequestQuery,
  KakaoCancelReserveRNbyRCVApiRequestBody
>
export type KakaoCancelReserveRNbyRCVApiResponse = KakaoOperationApiResponse
