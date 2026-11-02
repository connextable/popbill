import type { KakaoPromiseService } from '@connextable/popbill-compat/factory'
import { createInputValidationError } from '@connextable/popbill-compat/errors'
import type { PopbillApiError } from '@/errors'
import type { KakaoRecipient, KakaoService, SendBrandMessageRequest } from './types'
import { invokeKakaoMethod } from './adapters/error'
import { mapBrandMessage, mapButton, mapNotificationReceiver } from './mappers/document'
import * as map from './mappers/response'
export interface CreateKakaoServiceInput {
  compatKakaoService: KakaoPromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}
export function createKakaoService(input: CreateKakaoServiceInput): KakaoService {
  const compat = input.compatKakaoService,
    userId = input.defaultUserId
  const invoke = <T>(operation: string, handler: () => Promise<T>): Promise<T> => invokeKakaoMethod(input, 'kakao.' + operation, handler)
  const sendBrand = (
    operation: keyof KakaoService,
    method:
      | 'sendBMSText'
      | 'sendBMSImage'
      | 'sendBMSWideImage'
      | 'sendBMSWideList'
      | 'sendBMSCarouselFeed'
      | 'sendBMSCommerce'
      | 'sendBMSCarouselCommerce'
      | 'sendBMSVariable',
    request: SendBrandMessageRequest
  ) =>
    invoke(operation, async () => {
      validateRecipients(request.recipients)
      if (typeof request.target !== 'string' || !request.target.trim())
        throw createInputValidationError('브랜드 메시지 전송대상이 입력되지 않았습니다.')
      return { receiptNumber: await compat[method](request.businessNumber, mapBrandMessage(request), userId) }
    })
  return {
    getBusinessChannelManagementURL(request) {
      return invoke('getBusinessChannelManagementURL', async () => {
        const value = await compat.getPlusFriendMgtURL(request.businessNumber, userId)
        return { accessUrl: value }
      })
    },
    listBusinessChannels(request) {
      return invoke('listBusinessChannels', async () => {
        const value = await compat.listPlusFriendID(request.businessNumber, userId)
        return value.map(map.channel)
      })
    },
    getSenderNumberManagementURL(request) {
      return invoke('getSenderNumberManagementURL', async () => {
        const value = await compat.getSenderNumberMgtURL(request.businessNumber, userId)
        return { accessUrl: value }
      })
    },
    listSenderNumbers(request) {
      return invoke('listSenderNumbers', async () => {
        const value = await compat.getSenderNumberList(request.businessNumber, userId)
        return value.map(map.sender)
      })
    },
    checkSenderNumberRegistration(request) {
      return invoke('checkSenderNumberRegistration', async () => {
        const value = await compat.checkSenderNumber(request.businessNumber, request.senderPhoneNumber, userId)
        return map.operation(value)
      })
    },
    getNotificationTemplateManagementURL(request) {
      return invoke('getNotificationTemplateManagementURL', async () => {
        const value = await compat.getATSTemplateMgtURL(request.businessNumber, userId)
        return { accessUrl: value }
      })
    },
    getNotificationTemplate(request) {
      return invoke('getNotificationTemplate', async () => {
        const value = await compat.getATSTemplate(request.businessNumber, request.templateCode, userId)
        return map.notificationTemplate(value)
      })
    },
    listNotificationTemplates(request) {
      return invoke('listNotificationTemplates', async () => {
        const value = await compat.listATSTemplate(request.businessNumber, userId)
        return value.map(map.notificationTemplate)
      })
    },
    getBrandTemplateManagementURL(request) {
      return invoke('getBrandTemplateManagementURL', async () => {
        const value = await compat.getBMSTemplateMgtURL(request.businessNumber, userId)
        return { accessUrl: value }
      })
    },
    getBrandTemplate(request) {
      return invoke('getBrandTemplate', async () => {
        const value = await compat.getBMSTemplate(request.businessNumber, request.templateCode, userId)
        return map.brandTemplate(value)
      })
    },
    listBrandTemplates(request) {
      return invoke('listBrandTemplates', async () => {
        const value = await compat.listBMSTemplate(request.businessNumber, userId)
        return value.map(map.brandTemplate)
      })
    },
    uploadBrandImageFromPath(request) {
      return invoke('uploadBrandImageFromPath', async () => {
        const value = await compat.uploadImage(request.businessNumber, request.filePath, userId)
        return map.image(value)
      })
    },
    uploadBrandImageFromBinary(request) {
      return invoke('uploadBrandImageFromBinary', async () => {
        const value = await compat.uploadImageBinary(request.businessNumber, { fileName: request.fileName, fileData: request.fileData }, userId)
        return map.image(value)
      })
    },
    uploadBrandWideImageFromPath(request) {
      return invoke('uploadBrandWideImageFromPath', async () => {
        const value = await compat.uploadWideImage(request.businessNumber, request.filePath, userId)
        return map.image(value)
      })
    },
    uploadBrandWideImageFromBinary(request) {
      return invoke('uploadBrandWideImageFromBinary', async () => {
        const value = await compat.uploadWideImageBinary(request.businessNumber, { fileName: request.fileName, fileData: request.fileData }, userId)
        return map.image(value)
      })
    },
    uploadBrandWideListMainImageFromPath(request) {
      return invoke('uploadBrandWideListMainImageFromPath', async () => {
        const value = await compat.uploadWideListMainImage(request.businessNumber, request.filePath, userId)
        return map.image(value)
      })
    },
    uploadBrandWideListMainImageFromBinary(request) {
      return invoke('uploadBrandWideListMainImageFromBinary', async () => {
        const value = await compat.uploadWideListMainImageBinary(
          request.businessNumber,
          { fileName: request.fileName, fileData: request.fileData },
          userId
        )
        return map.image(value)
      })
    },
    uploadBrandWideListImageFromPath(request) {
      return invoke('uploadBrandWideListImageFromPath', async () => {
        const value = await compat.uploadWideListImage(request.businessNumber, [...request.filePaths], userId)
        return value.result.map(map.image)
      })
    },
    uploadBrandWideListImageFromBinary(request) {
      return invoke('uploadBrandWideListImageFromBinary', async () => {
        const value = await compat.uploadWideListImageBinary(
          request.businessNumber,
          request.files.map((file) => ({ fileName: file.fileName, fileData: file.fileData })),
          userId
        )
        return value.result.map(map.image)
      })
    },
    uploadBrandCarouselFeedImageFromPath(request) {
      return invoke('uploadBrandCarouselFeedImageFromPath', async () => {
        const value = await compat.uploadCarouselFeedImage(request.businessNumber, [...request.filePaths], userId)
        return value.result.map(map.image)
      })
    },
    uploadBrandCarouselFeedImageFromBinary(request) {
      return invoke('uploadBrandCarouselFeedImageFromBinary', async () => {
        const value = await compat.uploadCarouselFeedImageBinary(
          request.businessNumber,
          request.files.map((file) => ({ fileName: file.fileName, fileData: file.fileData })),
          userId
        )
        return value.result.map(map.image)
      })
    },
    uploadBrandCommerceImageFromPath(request) {
      return invoke('uploadBrandCommerceImageFromPath', async () => {
        const value = await compat.uploadCommerceImage(request.businessNumber, request.filePath, userId)
        return map.image(value)
      })
    },
    uploadBrandCommerceImageFromBinary(request) {
      return invoke('uploadBrandCommerceImageFromBinary', async () => {
        const value = await compat.uploadCommerceImageBinary(
          request.businessNumber,
          { fileName: request.fileName, fileData: request.fileData },
          userId
        )
        return map.image(value)
      })
    },
    uploadBrandCarouselCommerceImageFromPath(request) {
      return invoke('uploadBrandCarouselCommerceImageFromPath', async () => {
        const value = await compat.uploadCarouselCommerceImage(request.businessNumber, [...request.filePaths], userId)
        return value.result.map(map.image)
      })
    },
    uploadBrandCarouselCommerceImageFromBinary(request) {
      return invoke('uploadBrandCarouselCommerceImageFromBinary', async () => {
        const value = await compat.uploadCarouselCommerceImageBinary(
          request.businessNumber,
          request.files.map((file) => ({ fileName: file.fileName, fileData: file.fileData })),
          userId
        )
        return value.result.map(map.image)
      })
    },
    sendNotificationMessage(request) {
      return invoke('sendNotificationMessage', async () => {
        const receiptNumber = await compat.sendATS_same(
          request.businessNumber,
          request.templateCode,
          request.senderPhoneNumber,
          request.messageBody,
          request.fallbackSubject,
          request.fallbackBody,
          request.fallbackType,
          request.reserveDateTime,
          [mapNotificationReceiver(request)],
          userId,
          request.requestNumber,
          request.buttons?.map(mapButton),
          request.emphasizedTitle
        )
        return { receiptNumber }
      })
    },
    sendNotificationMessages(request) {
      return invoke('sendNotificationMessages', async () => {
        validateRecipients(request.recipients)
        return {
          receiptNumber: await compat.sendATS_multi(
            request.businessNumber,
            request.templateCode,
            request.senderPhoneNumber,
            request.fallbackType,
            request.reserveDateTime,
            request.recipients.map(mapNotificationReceiver),
            userId,
            request.requestNumber,
            request.buttons?.map(mapButton)
          ),
        }
      })
    },
    sendIdenticalNotificationMessages(request) {
      return invoke('sendIdenticalNotificationMessages', async () => {
        validateRecipients(request.recipients)
        return {
          receiptNumber: await compat.sendATS_same(
            request.businessNumber,
            request.templateCode,
            request.senderPhoneNumber,
            request.messageBody,
            request.fallbackSubject,
            request.fallbackBody,
            request.fallbackType,
            request.reserveDateTime,
            request.recipients.map(mapNotificationReceiver),
            userId,
            request.requestNumber,
            request.buttons?.map(mapButton),
            request.emphasizedTitle
          ),
        }
      })
    },
    sendBrandTextMessages: (request) => sendBrand('sendBrandTextMessages', 'sendBMSText', request),
    sendBrandImageMessages: (request) => sendBrand('sendBrandImageMessages', 'sendBMSImage', request),
    sendBrandWideImageMessages: (request) => sendBrand('sendBrandWideImageMessages', 'sendBMSWideImage', request),
    sendBrandWideListMessages: (request) => sendBrand('sendBrandWideListMessages', 'sendBMSWideList', request),
    sendBrandCarouselFeedMessages: (request) => sendBrand('sendBrandCarouselFeedMessages', 'sendBMSCarouselFeed', request),
    sendBrandCommerceMessages: (request) => sendBrand('sendBrandCommerceMessages', 'sendBMSCommerce', request),
    sendBrandCarouselCommerceMessages: (request) => sendBrand('sendBrandCarouselCommerceMessages', 'sendBMSCarouselCommerce', request),
    sendBrandTemplateMessages: (request) => sendBrand('sendBrandTemplateMessages', 'sendBMSVariable', request),
    cancelReservedMessagesByReceiptNumber(request) {
      return invoke('cancelReservedMessagesByReceiptNumber', async () => {
        const value = await compat.cancelReserve(request.businessNumber, request.receiptNumber, userId)
        return map.operation(value)
      })
    },
    cancelReservedMessagesByRequestNumber(request) {
      return invoke('cancelReservedMessagesByRequestNumber', async () => {
        const value = await compat.cancelReserveRN(request.businessNumber, request.requestNumber, userId)
        return map.operation(value)
      })
    },
    cancelReservedRecipientByReceiptNumber(request) {
      return invoke('cancelReservedRecipientByReceiptNumber', async () => {
        const value = await compat.cancelReservebyRCV(request.businessNumber, request.receiptNumber, request.receiverPhoneNumber, userId)
        return map.operation(value)
      })
    },
    cancelReservedRecipientByRequestNumber(request) {
      return invoke('cancelReservedRecipientByRequestNumber', async () => {
        const value = await compat.cancelReserveRNbyRCV(request.businessNumber, request.requestNumber, request.receiverPhoneNumber, userId)
        return map.operation(value)
      })
    },
    getMessagesByReceiptNumber(request) {
      return invoke('getMessagesByReceiptNumber', async () => {
        const value = await compat.getMessages(request.businessNumber, request.receiptNumber, userId)
        return map.messages(value)
      })
    },
    getMessagesByRequestNumber(request) {
      return invoke('getMessagesByRequestNumber', async () => {
        const value = await compat.getMessagesRN(request.businessNumber, request.requestNumber, userId)
        return map.messages(value)
      })
    },
    searchMessages(request) {
      return invoke('searchMessages', async () => {
        const page = request.pageNumber ?? 1,
          size = request.pageSize ?? 100
        if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1)
          throw createInputValidationError('페이지 범위가 올바르지 않습니다.')
        const value = await compat.search(
          request.businessNumber,
          request.startDate,
          request.endDate,
          request.stateCodes?.length ? request.stateCodes : undefined,
          request.messageTypes,
          request.reservedOnly === undefined ? undefined : request.reservedOnly ? '1' : '0',
          request.senderOnly,
          page,
          size,
          request.sortOrder ?? 'D',
          request.queryText,
          userId,
          request.channelSearchId,
          request.contentTypeCodes
        )
        return map.search(value)
      })
    },
    getMessageHistoryURL(request) {
      return invoke('getMessageHistoryURL', async () => {
        const value = await compat.getSentListURL(request.businessNumber, userId)
        return { accessUrl: value }
      })
    },
    getMessageUnitCost(request) {
      return invoke('getMessageUnitCost', async () => {
        return { unitCostAmount: await compat.getUnitCost(request.businessNumber, request.messageType) }
      })
    },
    getMessageChargeInfo(request) {
      return invoke('getMessageChargeInfo', async () => {
        const value = await compat.getChargeInfo(request.businessNumber, request.messageType, userId)
        return { unitCostAmount: value.unitCost, chargeMethod: value.chargeMethod, rateSystem: value.rateSystem }
      })
    },
  }
}
function validateRecipients(recipients: KakaoRecipient[]): void {
  if (
    !Array.isArray(recipients) ||
    recipients.length < 1 ||
    recipients.some((receiver) => typeof receiver.receiverPhoneNumber !== 'string' || !receiver.receiverPhoneNumber.trim())
  )
    throw createInputValidationError('수신자는 1건 이상이며 수신번호가 필요합니다.')
}
