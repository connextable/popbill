import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImageApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadImageBinaryApiRequestPath = never
export type KakaoUploadImageBinaryApiRequestQuery = never
export type KakaoUploadImageBinaryApiRequestBody = { image: KakaoBinaryFile }
export type KakaoUploadImageBinaryApiRequest = KakaoApiRequest<
  KakaoUploadImageBinaryApiRequestPath,
  KakaoUploadImageBinaryApiRequestQuery,
  KakaoUploadImageBinaryApiRequestBody
>
export type KakaoUploadImageBinaryApiResponse = KakaoImageApiModel
