import type { KakaoApiRequest, KakaoUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetURLApiRequestPath = never
export type KakaoGetURLApiRequestQuery = { TG: string }
export type KakaoGetURLApiRequestBody = never
export type KakaoGetURLApiRequest = KakaoApiRequest<KakaoGetURLApiRequestPath, KakaoGetURLApiRequestQuery, KakaoGetURLApiRequestBody>
export type KakaoGetURLApiResponse = KakaoUrlApiResponse
