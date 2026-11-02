import type { KakaoApiRequest, KakaoReceiptApiResponse, KakaoBinaryFile } from '../common'
import type { KakaoFriendApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendFMS_sameApiRequestPath = never
export type KakaoSendFMS_sameApiRequestQuery = never
/** Legacy FMS multipart carries JSON in form and a single image in file. */
export type KakaoSendFMS_sameApiRequestBody = { form: KakaoFriendApiBody; file: KakaoBinaryFile }
export type KakaoSendFMS_sameApiRequest = KakaoApiRequest<
  KakaoSendFMS_sameApiRequestPath,
  KakaoSendFMS_sameApiRequestQuery,
  KakaoSendFMS_sameApiRequestBody
>
export type KakaoSendFMS_sameApiResponse = KakaoReceiptApiResponse
