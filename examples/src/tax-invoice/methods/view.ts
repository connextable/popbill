import type { MethodDefinition } from './types.ts'
import { createDocumentRequest, prepareIssuedInvoiceKey } from './helpers.ts'
import { summarizeAccessUrl } from '../utils/summarizers.ts'

export const VIEW_METHODS = {
  getTaxInvoiceBoxURL: {
    description: '세금계산서 문서함 URL 조회',
    async run(context, runner) {
      const input = {
        businessNumber: context.businessNumber,
        taxInvoiceBoxScope: 'TBOX' as const,
      }
      await runner.run('getTaxInvoiceBoxURL', input, () => context.service.getTaxInvoiceBoxURL(input), summarizeAccessUrl)
    },
  },

  getInvoicePopupURL: {
    description: '문서 팝업 URL 조회',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'POP')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getInvoicePopupURL', input, () => context.service.getInvoicePopupURL(input), summarizeAccessUrl)
    },
  },

  getInvoiceViewURL: {
    description: '문서 보기 URL 조회',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'VIW')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getInvoiceViewURL', input, () => context.service.getInvoiceViewURL(input), summarizeAccessUrl)
    },
  },

  getSupplierInvoicePrintURL: {
    description: '공급자용 인쇄 URL 조회',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'SUP')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getSupplierInvoicePrintURL', input, () => context.service.getSupplierInvoicePrintURL(input), summarizeAccessUrl)
    },
  },

  getBuyerInvoicePrintURL: {
    description: '공급받는자용 인쇄 URL 조회',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'BUY')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getBuyerInvoicePrintURL', input, () => context.service.getBuyerInvoicePrintURL(input), summarizeAccessUrl)
    },
  },

  getBulkInvoicePrintURL: {
    description: '다건 인쇄 URL 조회',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'BPR')
      if (!managementKey) {
        return
      }

      const input = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKeys: [managementKey],
      }
      await runner.run('getBulkInvoicePrintURL', input, () => context.service.getBulkInvoicePrintURL(input), summarizeAccessUrl)
    },
  },

  getInvoiceMailURL: {
    description: '메일보기 URL 조회',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'MLU')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getInvoiceMailURL', input, () => context.service.getInvoiceMailURL(input), summarizeAccessUrl)
    },
  },

  getInvoicePDFURL: {
    description: 'PDF URL 조회',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'PDF')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getInvoicePDFURL', input, () => context.service.getInvoicePDFURL(input), summarizeAccessUrl)
    },
  },

  getSealAndAttachmentRegistrationURL: {
    description: '인감 및 첨부문서 등록 URL 조회',
    async run(context, runner) {
      const input = {
        businessNumber: context.businessNumber,
      }
      await runner.run(
        'getSealAndAttachmentRegistrationURL',
        input,
        () => context.service.getSealAndAttachmentRegistrationURL(input),
        summarizeAccessUrl
      )
    },
  },
} as const satisfies Record<string, MethodDefinition>
