import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImageApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadWideImageApiRequestPath = never
export type KakaoUploadWideImageApiRequestQuery = never
export type KakaoUploadWideImageApiRequestBody = { image: KakaoBinaryFile }
export type KakaoUploadWideImageApiRequest = KakaoApiRequest<
  KakaoUploadWideImageApiRequestPath,
  KakaoUploadWideImageApiRequestQuery,
  KakaoUploadWideImageApiRequestBody
>
export type KakaoUploadWideImageApiResponse = KakaoImageApiModel
