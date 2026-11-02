import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImagesApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadCarouselCommerceImageApiRequestPath = never
export type KakaoUploadCarouselCommerceImageApiRequestQuery = never
export type KakaoUploadCarouselCommerceImageApiRequestBody = { images: KakaoBinaryFile[] }
export type KakaoUploadCarouselCommerceImageApiRequest = KakaoApiRequest<
  KakaoUploadCarouselCommerceImageApiRequestPath,
  KakaoUploadCarouselCommerceImageApiRequestQuery,
  KakaoUploadCarouselCommerceImageApiRequestBody
>
export type KakaoUploadCarouselCommerceImageApiResponse = KakaoImagesApiModel
