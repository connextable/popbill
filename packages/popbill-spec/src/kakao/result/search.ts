import type { KakaoApiRequest } from '../common'
import type { KakaoSearchApiQuery, KakaoSearchApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSearchApiRequestPath = never
export type KakaoSearchApiRequestQuery = KakaoSearchApiQuery
export type KakaoSearchApiRequestBody = never
export type KakaoSearchApiRequest = KakaoApiRequest<KakaoSearchApiRequestPath, KakaoSearchApiRequestQuery, KakaoSearchApiRequestBody>
export type KakaoSearchApiResponse = KakaoSearchApiModel
