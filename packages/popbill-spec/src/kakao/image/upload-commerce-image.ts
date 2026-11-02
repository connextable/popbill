import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImageApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadCommerceImageApiRequestPath = never
export type KakaoUploadCommerceImageApiRequestQuery = never
export type KakaoUploadCommerceImageApiRequestBody = { image: KakaoBinaryFile }
export type KakaoUploadCommerceImageApiRequest = KakaoApiRequest<
  KakaoUploadCommerceImageApiRequestPath,
  KakaoUploadCommerceImageApiRequestQuery,
  KakaoUploadCommerceImageApiRequestBody
>
export type KakaoUploadCommerceImageApiResponse = KakaoImageApiModel
