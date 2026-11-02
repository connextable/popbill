import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoFriendApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendFTS_multiApiRequestPath = never
export type KakaoSendFTS_multiApiRequestQuery = never
export type KakaoSendFTS_multiApiRequestBody = KakaoFriendApiBody
export type KakaoSendFTS_multiApiRequest = KakaoApiRequest<
  KakaoSendFTS_multiApiRequestPath,
  KakaoSendFTS_multiApiRequestQuery,
  KakaoSendFTS_multiApiRequestBody
>
export type KakaoSendFTS_multiApiResponse = KakaoReceiptApiResponse
