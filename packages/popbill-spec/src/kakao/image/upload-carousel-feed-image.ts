import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImagesApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadCarouselFeedImageApiRequestPath = never
export type KakaoUploadCarouselFeedImageApiRequestQuery = never
export type KakaoUploadCarouselFeedImageApiRequestBody = { images: KakaoBinaryFile[] }
export type KakaoUploadCarouselFeedImageApiRequest = KakaoApiRequest<
  KakaoUploadCarouselFeedImageApiRequestPath,
  KakaoUploadCarouselFeedImageApiRequestQuery,
  KakaoUploadCarouselFeedImageApiRequestBody
>
export type KakaoUploadCarouselFeedImageApiResponse = KakaoImagesApiModel
