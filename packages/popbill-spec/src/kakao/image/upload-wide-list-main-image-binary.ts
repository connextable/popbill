import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImageApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadWideListMainImageBinaryApiRequestPath = never
export type KakaoUploadWideListMainImageBinaryApiRequestQuery = never
export type KakaoUploadWideListMainImageBinaryApiRequestBody = { image: KakaoBinaryFile }
export type KakaoUploadWideListMainImageBinaryApiRequest = KakaoApiRequest<
  KakaoUploadWideListMainImageBinaryApiRequestPath,
  KakaoUploadWideListMainImageBinaryApiRequestQuery,
  KakaoUploadWideListMainImageBinaryApiRequestBody
>
export type KakaoUploadWideListMainImageBinaryApiResponse = KakaoImageApiModel
