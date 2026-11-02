import type { MessagePromiseService } from '@connextable/popbill-compat/factory'
import type { PopbillApiError } from '@/errors'
import { mapMessageRecipient } from './mappers/document'
import { mapMessageSearch, mapSentMessage } from './mappers/response'
import { invokeMessageMethod } from './adapters/error'
import type * as Types from './types'
export interface CreateMessageServiceInput {
  compatMessageService: MessagePromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}
export function createMessageService(input: CreateMessageServiceInput): Types.MessageService {
  const compat = input.compatMessageService
  const userId = input.defaultUserId
  const invoke = <T>(method: keyof Types.MessageService, handler: () => Promise<T>) => invokeMessageMethod(input, 'message.' + method, handler)
  const sendText = (
    method: 'sendShortMessage' | 'sendLongMessage' | 'sendAutoLengthMessage',
    type: 'SMS' | 'LMS' | 'XMS',
    request: Types.SendMessageRequest
  ) =>
    invoke(method, async () => ({
      receiptNumber: await compat.sendMessage(
        type,
        request.businessNumber,
        request.senderNumber,
        request.senderName ?? '',
        request.subject ?? '',
        request.body,
        request.recipients.map(mapMessageRecipient),
        request.reservedAt,
        request.isAdvertisement,
        request.requestNumber,
        userId
      ),
    }))
  return {
    getSenderNumberRegistrationURL: (request) =>
      invoke('getSenderNumberRegistrationURL', async () => ({ url: await compat.getSenderNumberMgtURL(request.businessNumber, userId) })),
    getSenderNumbers: (request) =>
      invoke('getSenderNumbers', async () =>
        (await compat.getSenderNumberList(request.businessNumber, userId)).map((value) => ({
          number: value.number,
          isRepresentative: value.representYN,
          stateCode: value.state,
          memo: value.memo ?? undefined,
        }))
      ),
    checkSenderNumber: (request) => invoke('checkSenderNumber', () => compat.checkSenderNumber(request.businessNumber, request.senderNumber, userId)),
    getDenyNumberInfo: (request) =>
      invoke('getDenyNumberInfo', async () => {
        const value = await compat.checkAutoDenyNumber(request.businessNumber, userId)
        return { number: value.smsdenyNumber, registeredAt: value.regDT }
      }),
    getDeniedNumbers: (request) =>
      invoke('getDeniedNumbers', async () =>
        (await compat.getAutoDenyList(request.businessNumber, userId)).map((value) => ({ number: value.number, registeredAt: value.regDT }))
      ),
    sendShortMessage: (request) => sendText('sendShortMessage', 'SMS', request),
    sendLongMessage: (request) => sendText('sendLongMessage', 'LMS', request),
    sendAutoLengthMessage: (request) => sendText('sendAutoLengthMessage', 'XMS', request),
    sendImageMessage(request) {
      return invoke('sendImageMessage', async () => {
        const args = [
          request.businessNumber,
          request.senderNumber,
          request.subject ?? '',
          request.body,
          request.recipients.map(mapMessageRecipient),
        ] as const
        const options = [request.reservedAt, request.isAdvertisement, request.requestNumber, request.senderName, userId] as const
        const receiptNumber =
          request.image.filePath !== undefined
            ? await compat.sendMMS_multi(...args, request.image.filePath, ...options)
            : await compat.sendMMSBinary_multi(...args, { fileName: request.image.fileName, fileData: request.image.fileData }, ...options)
        return { receiptNumber }
      })
    },
    cancelScheduledMessagesByReceiptNumber: (request) =>
      invoke('cancelScheduledMessagesByReceiptNumber', () => compat.cancelReserve(request.businessNumber, request.receiptNumber, userId)),
    cancelScheduledMessagesByRequestNumber: (request) =>
      invoke('cancelScheduledMessagesByRequestNumber', () => compat.cancelReserveRN(request.businessNumber, request.requestNumber, userId)),
    cancelScheduledRecipientByReceiptNumber: (request) =>
      invoke('cancelScheduledRecipientByReceiptNumber', () =>
        compat.cancelReservebyRCV(request.businessNumber, request.receiptNumber, request.receiverNumber, userId)
      ),
    cancelScheduledRecipientByRequestNumber: (request) =>
      invoke('cancelScheduledRecipientByRequestNumber', () =>
        compat.cancelReserveRNbyRCV(request.businessNumber, request.requestNumber, request.receiverNumber, userId)
      ),
    getMessagesByReceiptNumber: (request) =>
      invoke('getMessagesByReceiptNumber', async () =>
        (await compat.getMessages(request.businessNumber, request.receiptNumber, userId)).map(mapSentMessage)
      ),
    getMessagesByRequestNumber: (request) =>
      invoke('getMessagesByRequestNumber', async () =>
        (await compat.getMessagesRN(request.businessNumber, request.requestNumber, userId)).map(mapSentMessage)
      ),
    searchMessages: (request) =>
      invoke('searchMessages', async () =>
        mapMessageSearch(
          await compat.search(
            request.businessNumber,
            request.startDate,
            request.endDate,
            [...request.stateCodes],
            request.messageTypes ? [...request.messageTypes] : undefined,
            request.isReserved,
            request.sentByCurrentUserOnly,
            request.sortOrder,
            request.pageNumber,
            request.pageSize,
            request.queryText,
            userId
          )
        )
      ),
    getSentMessageListURL: (request) =>
      invoke('getSentMessageListURL', async () => ({ url: await compat.getSentListURL(request.businessNumber, userId) })),
    getUnitCost: (request) =>
      invoke('getUnitCost', async () => ({ unitCost: await compat.getUnitCost(request.businessNumber, request.messageType) })),
    getChargeInfo: (request) => invoke('getChargeInfo', () => compat.getChargeInfo(request.businessNumber, request.messageType, userId)),
  }
}
