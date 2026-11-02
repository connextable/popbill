import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImageApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadImageApiRequestPath = never
export type KakaoUploadImageApiRequestQuery = never
export type KakaoUploadImageApiRequestBody = { image: KakaoBinaryFile }
export type KakaoUploadImageApiRequest = KakaoApiRequest<
  KakaoUploadImageApiRequestPath,
  KakaoUploadImageApiRequestQuery,
  KakaoUploadImageApiRequestBody
>
export type KakaoUploadImageApiResponse = KakaoImageApiModel
