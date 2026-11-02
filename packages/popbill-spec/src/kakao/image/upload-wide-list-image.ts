import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImagesApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadWideListImageApiRequestPath = never
export type KakaoUploadWideListImageApiRequestQuery = never
export type KakaoUploadWideListImageApiRequestBody = { images: KakaoBinaryFile[] }
export type KakaoUploadWideListImageApiRequest = KakaoApiRequest<
  KakaoUploadWideListImageApiRequestPath,
  KakaoUploadWideListImageApiRequestQuery,
  KakaoUploadWideListImageApiRequestBody
>
export type KakaoUploadWideListImageApiResponse = KakaoImagesApiModel
