import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoBrandMessageApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendBMSCarouselCommerceApiRequestPath = never
export type KakaoSendBMSCarouselCommerceApiRequestQuery = never
export type KakaoSendBMSCarouselCommerceApiRequestBody = KakaoBrandMessageApiBody & { plusFriendID: string }
export type KakaoSendBMSCarouselCommerceApiRequest = KakaoApiRequest<
  KakaoSendBMSCarouselCommerceApiRequestPath,
  KakaoSendBMSCarouselCommerceApiRequestQuery,
  KakaoSendBMSCarouselCommerceApiRequestBody
>
export type KakaoSendBMSCarouselCommerceApiResponse = KakaoReceiptApiResponse
