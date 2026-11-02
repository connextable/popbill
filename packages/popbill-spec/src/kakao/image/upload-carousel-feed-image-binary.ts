import type { KakaoApiRequest, KakaoBinaryFile } from '../common'
import type { KakaoImagesApiModel } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoUploadCarouselFeedImageBinaryApiRequestPath = never
export type KakaoUploadCarouselFeedImageBinaryApiRequestQuery = never
export type KakaoUploadCarouselFeedImageBinaryApiRequestBody = { images: KakaoBinaryFile[] }
export type KakaoUploadCarouselFeedImageBinaryApiRequest = KakaoApiRequest<
  KakaoUploadCarouselFeedImageBinaryApiRequestPath,
  KakaoUploadCarouselFeedImageBinaryApiRequestQuery,
  KakaoUploadCarouselFeedImageBinaryApiRequestBody
>
export type KakaoUploadCarouselFeedImageBinaryApiResponse = KakaoImagesApiModel
