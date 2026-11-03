import { createPopbillWebhookParser, type PopbillWebhookReceiverConfig } from '@connextable/popbill-runtime'
import { mapWebhookItem } from './mappers'
import type { PopbillWebhookReceiver } from './types'

export { PopbillWebhookError } from '@connextable/popbill-runtime'
export type {
  PopbillWebhookAuthentication,
  PopbillWebhookReceiverConfig,
  PopbillWebhookInput,
  PopbillWebhookSuccessResponse,
  PopbillWebhookErrorCode,
} from '@connextable/popbill-runtime'
export { PopbillWebhookTypes } from '@connextable/popbill-spec/webhook'
export type * from './types'

/** Create a webhook receiver independently of the outbound Popbill API client. */
export function createPopbillWebhookReceiver(config: PopbillWebhookReceiverConfig): PopbillWebhookReceiver {
  const parser = createPopbillWebhookParser(config)
  return {
    parse(input) {
      const { items, ...message } = parser.parse(input)
      return { ...message, events: items.map((item) => mapWebhookItem(item, message.headerEventType)) }
    },
    createSuccessResponse: parser.createSuccessResponse,
  }
}
