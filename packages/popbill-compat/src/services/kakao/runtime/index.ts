import { invokeUserCallback as invoke } from '@/internal/callback'
import type { CompatConfig } from '@/config'
import { asThrowableCompatError, toCompatRuntimeError } from '@/internal/errors'
import { KAKAO_METHODS } from '../methods'
import type { KakaoCallbackService, KakaoCanonicalPromiseService, KakaoPromiseService } from '../types'
import { createKakaoRuntimeContext } from './context'
import * as methods from './methods'
import { parseCallbackArguments, normalizeCallbackArguments } from './parsers'
export function createKakaoRuntimeMethods(config: CompatConfig): { callback: KakaoCallbackService; promise: KakaoPromiseService } {
  const context = createKakaoRuntimeContext(config)
  const requests = {
    getPlusFriendMgtURL: methods.requestGetPlusFriendMgtURL.bind(null, context),
    listPlusFriendID: methods.requestListPlusFriendID.bind(null, context),
    getSenderNumberMgtURL: methods.requestGetSenderNumberMgtURL.bind(null, context),
    getSenderNumberList: methods.requestGetSenderNumberList.bind(null, context),
    checkSenderNumber: methods.requestCheckSenderNumber.bind(null, context),
    getATSTemplateMgtURL: methods.requestGetATSTemplateMgtURL.bind(null, context),
    getATSTemplate: methods.requestGetATSTemplate.bind(null, context),
    listATSTemplate: methods.requestListATSTemplate.bind(null, context),
    getBMSTemplateMgtURL: methods.requestGetBMSTemplateMgtURL.bind(null, context),
    getBMSTemplate: methods.requestGetBMSTemplate.bind(null, context),
    listBMSTemplate: methods.requestListBMSTemplate.bind(null, context),
    uploadImage: methods.requestUploadImage.bind(null, context),
    uploadImageBinary: methods.requestUploadImageBinary.bind(null, context),
    uploadWideImage: methods.requestUploadWideImage.bind(null, context),
    uploadWideImageBinary: methods.requestUploadWideImageBinary.bind(null, context),
    uploadWideListMainImage: methods.requestUploadWideListMainImage.bind(null, context),
    uploadWideListMainImageBinary: methods.requestUploadWideListMainImageBinary.bind(null, context),
    uploadWideListImage: methods.requestUploadWideListImage.bind(null, context),
    uploadWideListImageBinary: methods.requestUploadWideListImageBinary.bind(null, context),
    uploadCarouselFeedImage: methods.requestUploadCarouselFeedImage.bind(null, context),
    uploadCarouselFeedImageBinary: methods.requestUploadCarouselFeedImageBinary.bind(null, context),
    uploadCommerceImage: methods.requestUploadCommerceImage.bind(null, context),
    uploadCommerceImageBinary: methods.requestUploadCommerceImageBinary.bind(null, context),
    uploadCarouselCommerceImage: methods.requestUploadCarouselCommerceImage.bind(null, context),
    uploadCarouselCommerceImageBinary: methods.requestUploadCarouselCommerceImageBinary.bind(null, context),
    sendATS_one: methods.requestSendATS_one.bind(null, context),
    sendATS_multi: methods.requestSendATS_multi.bind(null, context),
    sendATS_same: methods.requestSendATS_same.bind(null, context),
    sendFTS_one: methods.requestSendFTS_one.bind(null, context),
    sendFTS_multi: methods.requestSendFTS_multi.bind(null, context),
    sendFTS_same: methods.requestSendFTS_same.bind(null, context),
    sendFMS_one: methods.requestSendFMS_one.bind(null, context),
    sendFMS_multi: methods.requestSendFMS_multi.bind(null, context),
    sendFMS_same: methods.requestSendFMS_same.bind(null, context),
    sendBMSText: methods.requestSendBMSText.bind(null, context),
    sendBMSImage: methods.requestSendBMSImage.bind(null, context),
    sendBMSWideImage: methods.requestSendBMSWideImage.bind(null, context),
    sendBMSWideList: methods.requestSendBMSWideList.bind(null, context),
    sendBMSCarouselFeed: methods.requestSendBMSCarouselFeed.bind(null, context),
    sendBMSCommerce: methods.requestSendBMSCommerce.bind(null, context),
    sendBMSCarouselCommerce: methods.requestSendBMSCarouselCommerce.bind(null, context),
    sendBMSVariable: methods.requestSendBMSVariable.bind(null, context),
    cancelReserve: methods.requestCancelReserve.bind(null, context),
    cancelReserveRN: methods.requestCancelReserveRN.bind(null, context),
    cancelReservebyRCV: methods.requestCancelReservebyRCV.bind(null, context),
    cancelReserveRNbyRCV: methods.requestCancelReserveRNbyRCV.bind(null, context),
    getMessages: methods.requestGetMessages.bind(null, context),
    getMessagesRN: methods.requestGetMessagesRN.bind(null, context),
    search: methods.requestSearch.bind(null, context),
    getURL: methods.requestGetURL.bind(null, context),
    getSentListURL: methods.requestGetSentListURL.bind(null, context),
    getUnitCost: methods.requestGetUnitCost.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
  } satisfies KakaoCanonicalPromiseService
  const promise = Object.fromEntries(
    KAKAO_METHODS.map((method) => [
      method,
      async (...args: unknown[]) => {
        try {
          return await (requests[method] as (...args: unknown[]) => Promise<unknown>)(...normalizeCallbackArguments(method, args))
        } catch (error) {
          const normalized = asThrowableCompatError(toCompatRuntimeError(error, 'KakaoService.' + method))
          invoke(context.defaultErrorHandler, normalized)
          throw normalized
        }
      },
    ])
  ) as KakaoPromiseService
  const callback = Object.fromEntries(
    KAKAO_METHODS.map((method) => [
      method,
      (...args: unknown[]) => {
        const parsed = parseCallbackArguments(args)
        void (requests[method] as (...args: unknown[]) => Promise<unknown>)(...normalizeCallbackArguments(method, parsed.requestArgs)).then(
          (response) => invoke(parsed.success, response),
          (error) => invoke(parsed.error ?? context.defaultErrorHandler, toCompatRuntimeError(error, 'KakaoService.' + method))
        )
      },
    ])
  ) as KakaoCallbackService
  return { callback, promise }
}
