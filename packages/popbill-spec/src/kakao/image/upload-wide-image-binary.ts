import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImageApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadWideImageBinaryApiRequestPath = never
export type KakaoUploadWideImageBinaryApiRequestQuery = never
export type KakaoUploadWideImageBinaryApiRequestBody = { image: KakaoBinaryFile }
export type KakaoUploadWideImageBinaryApiRequest = KakaoApiRequest<
  KakaoUploadWideImageBinaryApiRequestPath,
  KakaoUploadWideImageBinaryApiRequestQuery,
  KakaoUploadWideImageBinaryApiRequestBody
>
export type KakaoUploadWideImageBinaryApiResponse = KakaoImageApiModel
