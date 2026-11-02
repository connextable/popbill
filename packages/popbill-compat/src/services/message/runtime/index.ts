import { invokeUserCallback as invokeCallback } from '@/internal/callback'
import type { CompatConfig } from '@/config'
import { asThrowableCompatError, toCompatRuntimeError } from '@/internal/errors'
import { MESSAGE_METHODS } from '../methods'
import type { MessageCallbackService, MessagePromiseService } from '../types'
import { createMessageRuntimeContext } from './context'
import * as methods from './methods'
import { parseCallbackArguments } from './parsers'
type RequestMethod = (...args: unknown[]) => Promise<unknown>
export function createMessageRuntimeMethods(config: CompatConfig): { callback: MessageCallbackService; promise: MessagePromiseService } {
  const context = createMessageRuntimeContext(config)
  const requests = {
    getSenderNumberMgtURL: methods.requestGetSenderNumberMgtURL.bind(null, context),
    getSenderNumberList: methods.requestGetSenderNumberList.bind(null, context),
    checkSenderNumber: methods.requestCheckSenderNumber.bind(null, context),
    checkAutoDenyNumber: methods.requestCheckAutoDenyNumber.bind(null, context),
    getAutoDenyList: methods.requestGetAutoDenyList.bind(null, context),
    sendSMS: methods.requestSendSMS.bind(null, context),
    sendSMS_multi: methods.requestSendSMS_multi.bind(null, context),
    sendLMS: methods.requestSendLMS.bind(null, context),
    sendLMS_multi: methods.requestSendLMS_multi.bind(null, context),
    sendXMS: methods.requestSendXMS.bind(null, context),
    sendXMS_multi: methods.requestSendXMS_multi.bind(null, context),
    sendMMS: methods.requestSendMMS.bind(null, context),
    sendMMS_multi: methods.requestSendMMS_multi.bind(null, context),
    sendMMSBinary: methods.requestSendMMSBinary.bind(null, context),
    sendMMSBinary_multi: methods.requestSendMMSBinary_multi.bind(null, context),
    sendMessage: methods.requestSendMessage.bind(null, context),
    sendMessage_MMS: methods.requestSendMessage_MMS.bind(null, context),
    cancelReserve: methods.requestCancelReserve.bind(null, context),
    cancelReserveRN: methods.requestCancelReserveRN.bind(null, context),
    cancelReservebyRCV: methods.requestCancelReservebyRCV.bind(null, context),
    cancelReserveRNbyRCV: methods.requestCancelReserveRNbyRCV.bind(null, context),
    getMessages: methods.requestGetMessages.bind(null, context),
    getMessagesRN: methods.requestGetMessagesRN.bind(null, context),
    getStates: methods.requestGetStates.bind(null, context),
    search: methods.requestSearch.bind(null, context),
    getURL: methods.requestGetURL.bind(null, context),
    getSentListURL: methods.requestGetSentListURL.bind(null, context),
    getUnitCost: methods.requestGetUnitCost.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
  } satisfies MessagePromiseService
  return {
    callback: Object.fromEntries(
      MESSAGE_METHODS.map((method) => [
        method,
        (...args: unknown[]) => {
          const parsed = parseCallbackArguments(args)
          const invoke = requests[method] as RequestMethod
          void invoke(...parsed.requestArgs).then(
            (response) => invokeCallback(parsed.success, response),
            (error) => {
              const normalized = toCompatRuntimeError(error, 'MessageService.' + method)
              invokeCallback(parsed.error ?? context.defaultErrorHandler, normalized)
            }
          )
        },
      ])
    ) as unknown as MessageCallbackService,
    promise: Object.fromEntries(
      MESSAGE_METHODS.map((method) => [
        method,
        async (...args: unknown[]) => {
          try {
            return await (requests[method] as RequestMethod)(...args)
          } catch (error) {
            const normalized = asThrowableCompatError(toCompatRuntimeError(error, 'MessageService.' + method))
            invokeCallback(context.defaultErrorHandler, normalized)
            throw normalized
          }
        },
      ])
    ) as unknown as MessagePromiseService,
  }
}
