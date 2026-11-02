import type { KakaoApiRequest } from '../common'
import type { KakaoChargeInfoApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetChargeInfoApiRequestPath = never
export type KakaoGetChargeInfoApiRequestQuery = { Type: string }
export type KakaoGetChargeInfoApiRequestBody = never
export type KakaoGetChargeInfoApiRequest = KakaoApiRequest<
  KakaoGetChargeInfoApiRequestPath,
  KakaoGetChargeInfoApiRequestQuery,
  KakaoGetChargeInfoApiRequestBody
>
export type KakaoGetChargeInfoApiResponse = KakaoChargeInfoApiModel
