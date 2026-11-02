import type { KakaoApiRequest, KakaoUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoGetPlusFriendMgtURLApiRequestPath = never
export type KakaoGetPlusFriendMgtURLApiRequestQuery = { TG: 'PLUSFRIEND' }
export type KakaoGetPlusFriendMgtURLApiRequestBody = never
export type KakaoGetPlusFriendMgtURLApiRequest = KakaoApiRequest<
  KakaoGetPlusFriendMgtURLApiRequestPath,
  KakaoGetPlusFriendMgtURLApiRequestQuery,
  KakaoGetPlusFriendMgtURLApiRequestBody
>
export type KakaoGetPlusFriendMgtURLApiResponse = KakaoUrlApiResponse
