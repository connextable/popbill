import type { ExampleContext, RuntimeConfig } from './types.ts'
import { formatDate } from './taxinvoice-fixtures.ts'
import { createPopbillClient } from '@connextable/popbill'
import { formatError } from './utils/error.ts'
import { logWarn } from './utils/log.ts'

export function createExampleContext(config: RuntimeConfig): ExampleContext {
  const client = createPopbillClient({
    linkId: config.linkId,
    secretKey: config.secretKey,
    userId: config.userId,
    isTest: config.isTest,
    useLocalTime: config.useLocalTime,
    requestTimeoutMs: config.requestTimeoutMs,
    acceptEncoding: config.acceptEncoding,
    onError(error) {
      logWarn('onError callback', formatError(error))
    },
  })

  return {
    service: client.services.taxInvoice,
    businessNumber: config.corpNum,
    invoiceDocumentKeyType: 'SELL',
    today: formatDate(new Date()),
    searchStartDate: formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)),
    config,
    shared: {
      primaryIssuedManagementKey: '',
    },
  }
}
