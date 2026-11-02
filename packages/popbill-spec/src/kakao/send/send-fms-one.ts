import type { KakaoApiRequest, KakaoReceiptApiResponse, KakaoBinaryFile } from '../common'
import type { KakaoFriendApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendFMS_oneApiRequestPath = never
export type KakaoSendFMS_oneApiRequestQuery = never
/** Legacy FMS multipart carries JSON in form and a single image in file. */
export type KakaoSendFMS_oneApiRequestBody = { form: KakaoFriendApiBody; file: KakaoBinaryFile }
export type KakaoSendFMS_oneApiRequest = KakaoApiRequest<
  KakaoSendFMS_oneApiRequestPath,
  KakaoSendFMS_oneApiRequestQuery,
  KakaoSendFMS_oneApiRequestBody
>
export type KakaoSendFMS_oneApiResponse = KakaoReceiptApiResponse
