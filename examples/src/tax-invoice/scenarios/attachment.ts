import { createManagementKey, createTempAttachmentFile } from '../taxinvoice-fixtures.ts'
import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { createDraftInvoice } from '../workflows/invoice.ts'
import { logWarn } from '../utils/log.ts'
import { summarizeArrayLength, summarizeInvoiceInfo, summarizeOperationResult } from '../utils/summarizers.ts'

export const attachmentScenario: ScenarioDefinition = {
  description: '파일첨부(path,binary)/첨부목록/첨부삭제/명세서첨부/문서번호할당',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const managementKey = await createDraftInvoice(context, runner, 'ATT')
    if (!managementKey) {
      return
    }

    const documentInput = {
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    }

    const filePath = await createTempAttachmentFile(managementKey)

    const attachFromPathInput = {
      ...documentInput,
      displayName: 'examples-attach-path.txt',
      filePath,
    }
    await runner.run(
      'attachFileFromPath',
      attachFromPathInput,
      () => context.service.attachFileFromPath(attachFromPathInput),
      summarizeOperationResult
    )

    const attachFromBinaryInput = {
      ...documentInput,
      fileName: 'examples-attach-binary.txt',
      fileData: Buffer.from(`examples binary attachment ${managementKey}`, 'utf8'),
    }
    await runner.run(
      'attachFileFromBinary',
      {
        ...attachFromBinaryInput,
        fileData: `<Buffer ${attachFromBinaryInput.fileData.length} bytes>`,
      },
      () => context.service.attachFileFromBinary(attachFromBinaryInput),
      summarizeOperationResult
    )

    const filesResult = await runner.run(
      'getAttachedFiles',
      documentInput,
      () => context.service.getAttachedFiles(documentInput),
      summarizeArrayLength
    )

    if (filesResult.ok && Array.isArray(filesResult.value) && filesResult.value.length > 0) {
      const fileIdentifier = filesResult.value.find((file) => typeof file.fileIdentifier === 'string')?.fileIdentifier

      if (fileIdentifier) {
        const deleteAttachedFileInput = {
          ...documentInput,
          fileIdentifier,
        }
        await runner.run(
          'deleteAttachedFile',
          deleteAttachedFileInput,
          () => context.service.deleteAttachedFile(deleteAttachedFileInput),
          summarizeOperationResult
        )
      } else {
        logWarn('deleteAttachedFile skipped', { reason: 'fileIdentifier not found in getAttachedFiles response' })
      }
    }

    if (context.config.statementManagementKey.length > 0) {
      const statementInput = {
        ...documentInput,
        statementItemCode: context.config.statementItemCode,
        statementManagementKey: context.config.statementManagementKey,
      }

      await runner.run(
        'attachInvoiceStatement',
        statementInput,
        () => context.service.attachInvoiceStatement(statementInput),
        summarizeOperationResult
      )

      await runner.run(
        'detachInvoiceStatement',
        statementInput,
        () => context.service.detachInvoiceStatement(statementInput),
        summarizeOperationResult
      )
    } else {
      logWarn('attachInvoiceStatement/detachInvoiceStatement skipped', {
        reason: 'POPBILL_STATEMENT_MGT_KEY is empty',
      })
    }

    const infoResult = await runner.run(
      'getInvoiceInfo (for assignInvoiceManagementKey)',
      documentInput,
      () => context.service.getInvoiceInfo(documentInput),
      summarizeInvoiceInfo
    )

    if (infoResult.ok && typeof infoResult.value?.itemKey === 'string' && infoResult.value.itemKey.length > 0) {
      const assignInput = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        itemKey: infoResult.value.itemKey,
        invoiceManagementKey: createManagementKey('NEW'),
      }
      await runner.run(
        'assignInvoiceManagementKey',
        assignInput,
        () => context.service.assignInvoiceManagementKey(assignInput),
        summarizeOperationResult
      )
    } else {
      logWarn('assignInvoiceManagementKey skipped', { reason: 'itemKey not available' })
    }
  },
}
