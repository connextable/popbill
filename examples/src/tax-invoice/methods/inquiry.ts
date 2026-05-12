import type { MethodDefinition } from './types.ts'
import { createDocumentRequest, createSearchInput, prepareDraftInvoiceKey } from './helpers.ts'
import {
  summarizeArrayLength,
  summarizeDocumentOutput,
  summarizeInvoiceInfo,
  summarizeKeyUsage,
  summarizeSearchResult,
  summarizeXmlOutput,
} from '../utils/summarizers.ts'

export const INQUIRY_METHODS = {
  getInvoiceInfo: {
    description: '문서 1건 상태 조회',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'GIN')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getInvoiceInfo', input, () => context.service.getInvoiceInfo(input), summarizeInvoiceInfo)
    },
  },

  getInvoicesInfo: {
    description: '문서 다건 상태 조회',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'GIS')
      if (!managementKey) {
        return
      }

      const input = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKeys: [managementKey],
      }
      await runner.run('getInvoicesInfo', input, () => context.service.getInvoicesInfo(input), summarizeArrayLength)
    },
  },

  getInvoiceDetailInfo: {
    description: '문서 상세 조회',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'GDI')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getInvoiceDetailInfo', input, () => context.service.getInvoiceDetailInfo(input), summarizeDocumentOutput)
    },
  },

  checkInvoiceManagementKeyInUse: {
    description: '관리번호 사용 여부 확인',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'CHK')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('checkInvoiceManagementKeyInUse', input, () => context.service.checkInvoiceManagementKeyInUse(input), summarizeKeyUsage)
    },
  },

  getInvoiceXML: {
    description: '문서 XML 조회',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'XML')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getInvoiceXML', input, () => context.service.getInvoiceXML(input), summarizeXmlOutput)
    },
  },

  searchInvoices: {
    description: '문서 검색',
    async run(context, runner) {
      const input = createSearchInput(context)
      await runner.run('searchInvoices', input, () => context.service.searchInvoices(input), summarizeSearchResult)
    },
  },

  getInvoiceLogs: {
    description: '문서 이력 조회',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'LOG')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getInvoiceLogs', input, () => context.service.getInvoiceLogs(input), summarizeArrayLength)
    },
  },
} as const satisfies Record<string, MethodDefinition>
