import type { KakaoApiRequest } from '../common'
import type { KakaoBusinessChannelApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoListPlusFriendIDApiRequestPath = never
export type KakaoListPlusFriendIDApiRequestQuery = never
export type KakaoListPlusFriendIDApiRequestBody = never
export type KakaoListPlusFriendIDApiRequest = KakaoApiRequest<
  KakaoListPlusFriendIDApiRequestPath,
  KakaoListPlusFriendIDApiRequestQuery,
  KakaoListPlusFriendIDApiRequestBody
>
export type KakaoListPlusFriendIDApiResponse = KakaoBusinessChannelApiModel[]
