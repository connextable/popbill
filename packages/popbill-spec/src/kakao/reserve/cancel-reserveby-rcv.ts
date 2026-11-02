import type { KakaoApiRequest, KakaoOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoCancelReservebyRCVApiRequestPath = { receiptNum: string }
export type KakaoCancelReservebyRCVApiRequestQuery = never
export type KakaoCancelReservebyRCVApiRequestBody = { receiveNum: string }
export type KakaoCancelReservebyRCVApiRequest = KakaoApiRequest<
  KakaoCancelReservebyRCVApiRequestPath,
  KakaoCancelReservebyRCVApiRequestQuery,
  KakaoCancelReservebyRCVApiRequestBody
>
export type KakaoCancelReservebyRCVApiResponse = KakaoOperationApiResponse
