import { createManagementKey, createTempAttachmentFile } from '../taxinvoice-fixtures.ts'
import type { MethodDefinition } from './types.ts'
import { createDocumentRequest, prepareAttachedFileIdentifier, prepareDraftInvoiceKey } from './helpers.ts'
import { logWarn } from '../utils/log.ts'
import { summarizeArrayLength, summarizeInvoiceInfo, summarizeOperationResult } from '../utils/summarizers.ts'

export const ATTACHMENT_METHODS = {
  attachFileFromPath: {
    description: '파일경로 기반 첨부',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'AFP')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        displayName: 'examples-path-file.txt',
        filePath: await createTempAttachmentFile(managementKey),
      }
      await runner.run(
        'attachFileFromPath',
        input,
        () => context.service.attachFileFromPath(input),
        summarizeOperationResult
      )
    },
  },

  attachFileFromBinary: {
    description: '바이너리 기반 첨부',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'AFB')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        fileName: 'examples-binary-file.txt',
        fileData: Buffer.from(`examples binary attachment ${managementKey}`, 'utf8'),
      }
      await runner.run(
        'attachFileFromBinary',
        {
          ...input,
          fileData: `<Buffer ${input.fileData.length} bytes>`,
        },
        () => context.service.attachFileFromBinary(input),
        summarizeOperationResult
      )
    },
  },

  deleteAttachedFile: {
    description: '첨부파일 삭제',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'DAF')
      if (!managementKey) {
        return
      }

      const fileIdentifier = await prepareAttachedFileIdentifier(context, runner, managementKey)
      if (!fileIdentifier) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        fileIdentifier,
      }
      await runner.run(
        'deleteAttachedFile',
        input,
        () => context.service.deleteAttachedFile(input),
        summarizeOperationResult
      )
    },
  },

  getAttachedFiles: {
    description: '첨부파일 목록 조회',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'GAF')
      if (!managementKey) {
        return
      }

      const setupInput = {
        ...createDocumentRequest(context, managementKey),
        displayName: 'examples-setup-attach.txt',
        filePath: await createTempAttachmentFile(managementKey),
      }
      const setupResult = await runner.run(
        'setup.attachFileFromPath',
        setupInput,
        () => context.service.attachFileFromPath(setupInput),
        summarizeOperationResult
      )
      if (!setupResult.ok) {
        return
      }

      const input = createDocumentRequest(context, managementKey)
      await runner.run('getAttachedFiles', input, () => context.service.getAttachedFiles(input), summarizeArrayLength)
    },
  },

  attachInvoiceStatement: {
    description: '전자명세서 첨부',
    async run(context, runner) {
      if (!context.config.statementManagementKey) {
        logWarn('attachInvoiceStatement skipped', { reason: 'POPBILL_STATEMENT_MGT_KEY is empty' })
        return
      }

      const managementKey = await prepareDraftInvoiceKey(context, runner, 'AST')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        statementItemCode: context.config.statementItemCode,
        statementManagementKey: context.config.statementManagementKey,
      }
      await runner.run(
        'attachInvoiceStatement',
        input,
        () => context.service.attachInvoiceStatement(input),
        summarizeOperationResult
      )
    },
  },

  detachInvoiceStatement: {
    description: '전자명세서 첨부해제',
    async run(context, runner) {
      if (!context.config.statementManagementKey) {
        logWarn('detachInvoiceStatement skipped', { reason: 'POPBILL_STATEMENT_MGT_KEY is empty' })
        return
      }

      const managementKey = await prepareDraftInvoiceKey(context, runner, 'DST')
      if (!managementKey) {
        return
      }

      const setupInput = {
        ...createDocumentRequest(context, managementKey),
        statementItemCode: context.config.statementItemCode,
        statementManagementKey: context.config.statementManagementKey,
      }
      const setupResult = await runner.run(
        'setup.attachInvoiceStatement',
        setupInput,
        () => context.service.attachInvoiceStatement(setupInput),
        summarizeOperationResult
      )
      if (!setupResult.ok) {
        return
      }

      await runner.run(
        'detachInvoiceStatement',
        setupInput,
        () => context.service.detachInvoiceStatement(setupInput),
        summarizeOperationResult
      )
    },
  },

  assignInvoiceManagementKey: {
    description: '문서번호 할당',
    async run(context, runner) {
      const managementKey = await prepareDraftInvoiceKey(context, runner, 'AMK')
      if (!managementKey) {
        return
      }

      const infoInput = createDocumentRequest(context, managementKey)
      const infoResult = await runner.run(
        'setup.getInvoiceInfo',
        infoInput,
        () => context.service.getInvoiceInfo(infoInput),
        summarizeInvoiceInfo
      )
      if (!infoResult.ok) {
        return
      }

      const itemKey = infoResult.value.itemKey
      if (typeof itemKey !== 'string' || itemKey.length === 0) {
        logWarn('assignInvoiceManagementKey skipped', { reason: 'itemKey not found from getInvoiceInfo response' })
        return
      }

      const input = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        itemKey,
        invoiceManagementKey: createManagementKey('NEW'),
      }
      await runner.run(
        'assignInvoiceManagementKey',
        input,
        () => context.service.assignInvoiceManagementKey(input),
        summarizeOperationResult
      )
    },
  },
} as const satisfies Record<string, MethodDefinition>
