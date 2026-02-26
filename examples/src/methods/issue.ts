import { createManagementKey, createSubmissionIdentifier } from '../taxinvoice-fixtures.ts'
import type { MethodDefinition } from './types.ts'
import { createDocument, createDraftInvoice } from '../workflows/invoice.ts'
import {
  createDocumentRequest,
  createImmediateIssueInput,
  createImmediateReverseRequestInput,
  createUpdateDocumentInput,
  prepareDraftInvoiceKey,
  prepareIssuedInvoiceKey,
  prepareReverseRequestedInvoiceKey,
} from './helpers.ts'
import { summarizeOperationResult } from '../utils/summarizers.ts'

export const ISSUE_METHODS = {
  issueInvoiceImmediately: {
    description: '등록과 동시에 즉시 발행',
    async run(context, runner) {
      const input = createImmediateIssueInput(context, 'IMD')
      await runner.run(
        'issueInvoiceImmediately',
        input,
        () => context.service.issueInvoiceImmediately(input),
        summarizeOperationResult
      )
    },
  },

  registerInvoice: {
    description: '임시저장',
    async run(context, runner) {
      const managementKey = createManagementKey('REG')
      const input = {
        businessNumber: context.businessNumber,
        taxInvoiceDocument: createDocument(context, managementKey),
      }

      await runner.run('registerInvoice', input, () => context.service.registerInvoice(input), summarizeOperationResult)
    },
  },

  updateInvoice: {
    description: '임시저장 문서 수정',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'UPDREG')
      if (!managementKey) {
        return
      }

      const input = createUpdateDocumentInput(context, managementKey, 'UPD')
      await runner.run('updateInvoice', input, () => context.service.updateInvoice(input), summarizeOperationResult)
    },
  },

  issueInvoice: {
    description: '임시저장 문서 발행',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'ISSREG')
      if (!managementKey) {
        return
      }

      const input = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        historyMemo: 'examples issue by method',
        emailSubject: 'examples issue by method',
        forceIssue: false,
      }
      await runner.run('issueInvoice', input, () => context.service.issueInvoice(input), summarizeOperationResult)
    },
  },

  cancelIssuedInvoice: {
    description: '발행취소',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'CNL')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        historyMemo: 'examples cancel issue by method',
      }
      await runner.run(
        'cancelIssuedInvoice',
        input,
        () => context.service.cancelIssuedInvoice(input),
        summarizeOperationResult
      )
    },
  },

  deleteInvoice: {
    description: '임시저장 문서 삭제',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'DEL')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('deleteInvoice', input, () => context.service.deleteInvoice(input), summarizeOperationResult)
    },
  },

  sendInvoiceToNTS: {
    description: '국세청 전송',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'NTS')
      if (!managementKey) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run(
        'sendInvoiceToNTS',
        input,
        () => context.service.sendInvoiceToNTS(input),
        summarizeOperationResult
      )
    },
  },

  requestReverseIssueImmediately: {
    description: '등록과 동시에 역발행 요청',
    async run(context, runner) {
      const input = createImmediateReverseRequestInput(context, 'RIM')
      await runner.run(
        'requestReverseIssueImmediately',
        input,
        () => context.service.requestReverseIssueImmediately(input),
        summarizeOperationResult
      )
    },
  },

  requestReverseIssue: {
    description: '역발행 요청',
    async run(context, runner) {
      const managementKey = await createDraftInvoice(context, runner, 'RRQREG', {
        issueType: '역발행',
      })
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        historyMemo: 'examples reverse request by method',
      }
      await runner.run(
        'requestReverseIssue',
        input,
        () => context.service.requestReverseIssue(input),
        summarizeOperationResult
      )
    },
  },

  cancelReverseIssueRequest: {
    description: '역발행 요청 취소',
    async run(context, runner) {
      const managementKey = await prepareReverseRequestedInvoiceKey(context, runner, 'RCR')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        historyMemo: 'examples reverse request cancel by method',
      }
      await runner.run(
        'cancelReverseIssueRequest',
        input,
        () => context.service.cancelReverseIssueRequest(input),
        summarizeOperationResult
      )
    },
  },

  refuseReverseIssueRequest: {
    description: '역발행 요청 거부',
    async run(context, runner) {
      const managementKey = await prepareReverseRequestedInvoiceKey(context, runner, 'RRF')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        historyMemo: 'examples reverse request refuse by method',
      }
      await runner.run(
        'refuseReverseIssueRequest',
        input,
        () => context.service.refuseReverseIssueRequest(input),
        summarizeOperationResult
      )
    },
  },

  submitBulkIssue: {
    description: '초대량 발행 접수',
    async run(context, runner) {
      const input = {
        businessNumber: context.businessNumber,
        submissionIdentifier: createSubmissionIdentifier('BLK'),
        taxInvoiceDocuments: [
          createDocument(context, createManagementKey('B01')),
          createDocument(context, createManagementKey('B02')),
        ],
        forceIssue: false,
      }
      await runner.run('submitBulkIssue', input, () => context.service.submitBulkIssue(input), summarizeOperationResult)
    },
  },

  getBulkIssueSubmissionResult: {
    description: '초대량 발행 접수결과 조회',
    async run(context, runner) {
      const submissionIdentifier = createSubmissionIdentifier('BRS')

      const setupInput = {
        businessNumber: context.businessNumber,
        submissionIdentifier,
        taxInvoiceDocuments: [createDocument(context, createManagementKey('BRS'))],
        forceIssue: false,
      }
      const setupResult = await runner.run(
        'setup.submitBulkIssue',
        setupInput,
        () => context.service.submitBulkIssue(setupInput),
        summarizeOperationResult
      )
      if (!setupResult.ok) {
        return
      }

      const input = {
        businessNumber: context.businessNumber,
        submissionIdentifier,
      }
      await runner.run(
        'getBulkIssueSubmissionResult',
        input,
        () => context.service.getBulkIssueSubmissionResult(input),
        summarizeOperationResult
      )
    },
  },
} as const satisfies Record<string, MethodDefinition>
