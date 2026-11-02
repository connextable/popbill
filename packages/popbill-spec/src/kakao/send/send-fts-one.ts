import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoFriendApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendFTS_oneApiRequestPath = never
export type KakaoSendFTS_oneApiRequestQuery = never
export type KakaoSendFTS_oneApiRequestBody = KakaoFriendApiBody
export type KakaoSendFTS_oneApiRequest = KakaoApiRequest<
  KakaoSendFTS_oneApiRequestPath,
  KakaoSendFTS_oneApiRequestQuery,
  KakaoSendFTS_oneApiRequestBody
>
export type KakaoSendFTS_oneApiResponse = KakaoReceiptApiResponse
