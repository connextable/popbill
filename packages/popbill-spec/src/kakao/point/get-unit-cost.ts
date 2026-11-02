import type { KakaoApiRequest } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetUnitCostApiRequestPath = never
export type KakaoGetUnitCostApiRequestQuery = { Type: string }
export type KakaoGetUnitCostApiRequestBody = never
export type KakaoGetUnitCostApiRequest = KakaoApiRequest<
  KakaoGetUnitCostApiRequestPath,
  KakaoGetUnitCostApiRequestQuery,
  KakaoGetUnitCostApiRequestBody
>
export type KakaoGetUnitCostApiResponse = { unitCost: string }
