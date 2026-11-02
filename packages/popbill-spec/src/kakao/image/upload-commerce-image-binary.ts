import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImageApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadCommerceImageBinaryApiRequestPath = never
export type KakaoUploadCommerceImageBinaryApiRequestQuery = never
export type KakaoUploadCommerceImageBinaryApiRequestBody = { image: KakaoBinaryFile }
export type KakaoUploadCommerceImageBinaryApiRequest = KakaoApiRequest<
  KakaoUploadCommerceImageBinaryApiRequestPath,
  KakaoUploadCommerceImageBinaryApiRequestQuery,
  KakaoUploadCommerceImageBinaryApiRequestBody
>
export type KakaoUploadCommerceImageBinaryApiResponse = KakaoImageApiModel
