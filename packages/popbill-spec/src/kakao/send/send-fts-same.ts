import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoFriendApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendFTS_sameApiRequestPath = never
export type KakaoSendFTS_sameApiRequestQuery = never
export type KakaoSendFTS_sameApiRequestBody = KakaoFriendApiBody
export type KakaoSendFTS_sameApiRequest = KakaoApiRequest<
  KakaoSendFTS_sameApiRequestPath,
  KakaoSendFTS_sameApiRequestQuery,
  KakaoSendFTS_sameApiRequestBody
>
export type KakaoSendFTS_sameApiResponse = KakaoReceiptApiResponse
