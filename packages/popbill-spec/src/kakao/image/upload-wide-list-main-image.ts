import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImageApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadWideListMainImageApiRequestPath = never
export type KakaoUploadWideListMainImageApiRequestQuery = never
export type KakaoUploadWideListMainImageApiRequestBody = { image: KakaoBinaryFile }
export type KakaoUploadWideListMainImageApiRequest = KakaoApiRequest<
  KakaoUploadWideListMainImageApiRequestPath,
  KakaoUploadWideListMainImageApiRequestQuery,
  KakaoUploadWideListMainImageApiRequestBody
>
export type KakaoUploadWideListMainImageApiResponse = KakaoImageApiModel
