import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImagesApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadCarouselCommerceImageBinaryApiRequestPath = never
export type KakaoUploadCarouselCommerceImageBinaryApiRequestQuery = never
export type KakaoUploadCarouselCommerceImageBinaryApiRequestBody = { images: KakaoBinaryFile[] }
export type KakaoUploadCarouselCommerceImageBinaryApiRequest = KakaoApiRequest<
  KakaoUploadCarouselCommerceImageBinaryApiRequestPath,
  KakaoUploadCarouselCommerceImageBinaryApiRequestQuery,
  KakaoUploadCarouselCommerceImageBinaryApiRequestBody
>
export type KakaoUploadCarouselCommerceImageBinaryApiResponse = KakaoImagesApiModel
