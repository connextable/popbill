import type { KakaoApiRequest, KakaoReceiptApiResponse, KakaoBinaryFile } from '../common'
import type { KakaoFriendApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendFMS_multiApiRequestPath = never
export type KakaoSendFMS_multiApiRequestQuery = never
/** Legacy FMS multipart carries JSON in form and a single image in file. */
export type KakaoSendFMS_multiApiRequestBody = { form: KakaoFriendApiBody; file: KakaoBinaryFile }
export type KakaoSendFMS_multiApiRequest = KakaoApiRequest<
  KakaoSendFMS_multiApiRequestPath,
  KakaoSendFMS_multiApiRequestQuery,
  KakaoSendFMS_multiApiRequestBody
>
export type KakaoSendFMS_multiApiResponse = KakaoReceiptApiResponse
