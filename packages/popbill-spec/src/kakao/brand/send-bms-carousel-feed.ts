import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoBrandMessageApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendBMSCarouselFeedApiRequestPath = never
export type KakaoSendBMSCarouselFeedApiRequestQuery = never
export type KakaoSendBMSCarouselFeedApiRequestBody = KakaoBrandMessageApiBody & { plusFriendID: string }
export type KakaoSendBMSCarouselFeedApiRequest = KakaoApiRequest<
  KakaoSendBMSCarouselFeedApiRequestPath,
  KakaoSendBMSCarouselFeedApiRequestQuery,
  KakaoSendBMSCarouselFeedApiRequestBody
>
export type KakaoSendBMSCarouselFeedApiResponse = KakaoReceiptApiResponse
