import type { KakaoApiRequest, KakaoReceiptApiResponse } from '../common'
import type { KakaoBrandMessageApiBody } from '../models'

/** @see https://developers.popbill.com/reference/kakaotalk/node/api */
export type KakaoSendBMSVariableApiRequestPath = never
export type KakaoSendBMSVariableApiRequestQuery = never
export type KakaoSendBMSVariableApiRequestBody = KakaoBrandMessageApiBody & { templateCode: string }
export type KakaoSendBMSVariableApiRequest = KakaoApiRequest<
  KakaoSendBMSVariableApiRequestPath,
  KakaoSendBMSVariableApiRequestQuery,
  KakaoSendBMSVariableApiRequestBody
>
export type KakaoSendBMSVariableApiResponse = KakaoReceiptApiResponse
