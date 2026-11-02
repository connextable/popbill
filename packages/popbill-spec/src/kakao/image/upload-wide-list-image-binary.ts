import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImagesApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadWideListImageBinaryApiRequestPath = never
export type KakaoUploadWideListImageBinaryApiRequestQuery = never
export type KakaoUploadWideListImageBinaryApiRequestBody = { images: KakaoBinaryFile[] }
export type KakaoUploadWideListImageBinaryApiRequest = KakaoApiRequest<
  KakaoUploadWideListImageBinaryApiRequestPath,
  KakaoUploadWideListImageBinaryApiRequestQuery,
  KakaoUploadWideListImageBinaryApiRequestBody
>
export type KakaoUploadWideListImageBinaryApiResponse = KakaoImagesApiModel
