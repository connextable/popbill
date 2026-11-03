import type { StatementPromiseService as CompatStatementService } from '@connextable/popbill-compat/factory'
import { createInputValidationError } from '@connextable/popbill-compat/errors'
import { isValidCalendarDate8 } from '@connextable/popbill-utils'
import type { PopbillApiError } from '@/errors'
import { PopbillErrorStage } from '@/errors'
import { invokeStatementMethod } from './adapters/error'
import { mapStatementDocument } from './mappers/document'
import * as mappers from './mappers/response'
import * as statementInfoMappers from './mappers/statement-info'
import * as types from './types'

interface CreateStatementServiceInput {
  compatStatementService: CompatStatementService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}

/** 전자명세서 DTO를 compat의 위치 인자로 변환합니다. */
export function createStatementService(input: CreateStatementServiceInput): types.StatementService {
  const compat = input.compatStatementService
  const userId = input.defaultUserId
  const invoke = <T>(method: keyof types.StatementService, handler: () => Promise<T>): Promise<T> =>
    invokeStatementMethod(input, `statement.${method}`, handler)

  return {
    issueStatementImmediately(request) {
      return invoke('issueStatementImmediately', async () =>
        mappers.mapStatementIssueResult(
          await compat.registIssue(request.businessNumber, mapStatementDocument(request.document), request.historyMemo, userId, request.emailSubject)
        )
      )
    },
    registerStatement(request) {
      return invoke('registerStatement', async () =>
        mappers.mapStatementOperationResult(await compat.register(request.businessNumber, mapStatementDocument(request.document), userId))
      )
    },
    updateStatement(request) {
      return invoke('updateStatement', async () =>
        mappers.mapStatementOperationResult(
          await compat.update(request.businessNumber, request.documentTypeCode, request.managementKey, mapStatementDocument(request.document), userId)
        )
      )
    },
    issueStatement(request) {
      return invoke('issueStatement', async () =>
        mappers.mapStatementOperationResult(
          await compat.issue(
            request.businessNumber,
            request.documentTypeCode,
            request.managementKey,
            request.historyMemo,
            request.emailSubject,
            userId
          )
        )
      )
    },
    cancelIssuedStatement(request) {
      return invoke('cancelIssuedStatement', async () =>
        mappers.mapStatementOperationResult(
          await compat.cancel(request.businessNumber, request.documentTypeCode, request.managementKey, request.historyMemo, userId)
        )
      )
    },
    deleteStatement(request) {
      return invoke('deleteStatement', async () =>
        mappers.mapStatementOperationResult(await compat.delete(request.businessNumber, request.documentTypeCode, request.managementKey, userId))
      )
    },
    getStatementInfo(request) {
      return invoke('getStatementInfo', async () =>
        statementInfoMappers.mapStatementInfo(await compat.getInfo(request.businessNumber, request.documentTypeCode, request.managementKey, userId))
      )
    },
    getStatementsInfo(request) {
      return invoke('getStatementsInfo', async () =>
        (await compat.getInfos(request.businessNumber, request.documentTypeCode, [...request.managementKeys], userId)).map(
          statementInfoMappers.mapStatementInfo
        )
      )
    },
    getStatementDetailInfo(request) {
      return invoke('getStatementDetailInfo', async () =>
        mappers.mapStatementDocumentOutput(
          await compat.getDetailInfo(request.businessNumber, request.documentTypeCode, request.managementKey, userId)
        )
      )
    },
    checkStatementManagementKeyInUse(request) {
      return invoke('checkStatementManagementKeyInUse', async () => ({
        isInUse: await compat.checkMgtKeyInUse(request.businessNumber, request.documentTypeCode, request.managementKey, userId),
      }))
    },
    searchStatements(request) {
      return invoke('searchStatements', async () => {
        const normalized = normalizeSearchRequest(request)
        return mappers.mapStatementSearchResult(
          await compat.search(
            request.businessNumber,
            request.searchDateType,
            normalized.startDate,
            normalized.endDate,
            [...(request.stateCodes ?? [])],
            [...(request.documentTypeCodes ?? [])],
            request.queryText ?? '',
            normalized.sortOrder,
            normalized.pageNumber,
            normalized.pageSize,
            userId
          )
        )
      })
    },
    getStatementLogs(request) {
      return invoke('getStatementLogs', async () =>
        (await compat.getLogs(request.businessNumber, request.documentTypeCode, request.managementKey, userId)).map(mappers.mapStatementLog)
      )
    },
    getStatementBoxURL(request) {
      return invoke('getStatementBoxURL', async () =>
        mappers.mapStatementAccessUrl(await compat.getURL(request.businessNumber, request.statementBoxScope, userId))
      )
    },
    getStatementPopupURL(request) {
      return invoke('getStatementPopupURL', async () =>
        mappers.mapStatementAccessUrl(await compat.getPopUpURL(request.businessNumber, request.documentTypeCode, request.managementKey, userId))
      )
    },
    getStatementViewURL(request) {
      return invoke('getStatementViewURL', async () =>
        mappers.mapStatementAccessUrl(await compat.getViewURL(request.businessNumber, request.documentTypeCode, request.managementKey, userId))
      )
    },
    getSenderStatementPrintURL(request) {
      return invoke('getSenderStatementPrintURL', async () =>
        mappers.mapStatementAccessUrl(await compat.getPrintURL(request.businessNumber, request.documentTypeCode, request.managementKey, userId))
      )
    },
    getReceiverStatementPrintURL(request) {
      return invoke('getReceiverStatementPrintURL', async () =>
        mappers.mapStatementAccessUrl(await compat.getEPrintURL(request.businessNumber, request.documentTypeCode, request.managementKey, userId))
      )
    },
    getBulkStatementPrintURL(request) {
      return invoke('getBulkStatementPrintURL', async () =>
        mappers.mapStatementAccessUrl(
          await compat.getMassPrintURL(request.businessNumber, request.documentTypeCode, [...request.managementKeys], userId)
        )
      )
    },
    getStatementMailURL(request) {
      return invoke('getStatementMailURL', async () =>
        mappers.mapStatementAccessUrl(await compat.getMailURL(request.businessNumber, request.documentTypeCode, request.managementKey, userId))
      )
    },
    getSealAndAttachmentRegistrationURL(request) {
      return invoke('getSealAndAttachmentRegistrationURL', async () =>
        mappers.mapStatementAccessUrl(await compat.getSealURL(request.businessNumber, userId))
      )
    },
    attachFileFromPath(request) {
      return invoke('attachFileFromPath', async () =>
        mappers.mapStatementOperationResult(
          await compat.attachFile(
            request.businessNumber,
            request.documentTypeCode,
            request.managementKey,
            request.displayName,
            request.filePath,
            userId
          )
        )
      )
    },
    attachFileFromBinary(request) {
      return invoke('attachFileFromBinary', async () =>
        mappers.mapStatementOperationResult(
          await compat.attachFileBinary(
            request.businessNumber,
            request.documentTypeCode,
            request.managementKey,
            { fileName: request.fileName, fileData: request.fileData },
            userId
          )
        )
      )
    },
    deleteAttachedFile(request) {
      return invoke('deleteAttachedFile', async () =>
        mappers.mapStatementOperationResult(
          await compat.deleteFile(request.businessNumber, request.documentTypeCode, request.managementKey, request.fileIdentifier, userId)
        )
      )
    },
    getAttachedFiles(request) {
      return invoke('getAttachedFiles', async () =>
        (await compat.getFiles(request.businessNumber, request.documentTypeCode, request.managementKey, userId)).map(mappers.mapStatementAttachedFile)
      )
    },
    resendStatementEmail(request) {
      return invoke('resendStatementEmail', async () =>
        mappers.mapStatementOperationResult(
          await compat.sendEmail(request.businessNumber, request.documentTypeCode, request.managementKey, request.receiverEmailAddress, userId)
        )
      )
    },
    resendStatementSMS(request) {
      return invoke('resendStatementSMS', async () =>
        mappers.mapStatementOperationResult(
          await compat.sendSMS(
            request.businessNumber,
            request.documentTypeCode,
            request.managementKey,
            request.senderPhoneNumber,
            request.receiverPhoneNumber,
            request.messageBody,
            userId
          )
        )
      )
    },
    resendStatementFAX(request) {
      return invoke('resendStatementFAX', async () =>
        mappers.mapStatementOperationResult(
          await compat.sendFAX(
            request.businessNumber,
            request.documentTypeCode,
            request.managementKey,
            request.senderPhoneNumber,
            request.receiverPhoneNumber,
            userId
          )
        )
      )
    },
    sendStatementFAX(request) {
      return invoke('sendStatementFAX', async () => ({
        receiptNumber: await compat.FAXSend(
          request.businessNumber,
          mapStatementDocument(request.document),
          request.senderPhoneNumber,
          request.receiverPhoneNumber,
          userId
        ),
      }))
    },
    attachStatement(request) {
      return invoke('attachStatement', async () =>
        mappers.mapStatementOperationResult(
          await compat.attachStatement(
            request.businessNumber,
            request.documentTypeCode,
            request.managementKey,
            request.attachedDocumentTypeCode,
            request.attachedManagementKey,
            userId
          )
        )
      )
    },
    detachStatement(request) {
      return invoke('detachStatement', async () =>
        mappers.mapStatementOperationResult(
          await compat.detachStatement(
            request.businessNumber,
            request.documentTypeCode,
            request.managementKey,
            request.attachedDocumentTypeCode,
            request.attachedManagementKey,
            userId
          )
        )
      )
    },
    getEmailSendSettings(request) {
      return invoke('getEmailSendSettings', async () =>
        (await compat.listEmailConfig(request.businessNumber, userId)).map(mappers.mapStatementEmailSendSetting)
      )
    },
    updateEmailSendSettings(request) {
      return invoke('updateEmailSendSettings', async () =>
        mappers.mapStatementOperationResult(
          await compat.updateEmailConfig(request.businessNumber, request.emailTypeCode, request.sendEnabled, userId)
        )
      )
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', async () =>
        mappers.mapStatementChargeInfo(await compat.getChargeInfo(request.businessNumber, request.documentTypeCode, userId))
      )
    },
    getUnitCost(request) {
      return invoke('getUnitCost', async () => ({ unitCost: await compat.getUnitCost(request.businessNumber, request.documentTypeCode) }))
    },
  }
}

function normalizeSearchRequest(request: types.SearchStatementsInput): {
  startDate: string
  endDate: string
  sortOrder: types.StatementSortOrder
  pageNumber: number
  pageSize: number
} {
  const fail = (message: string): never => {
    throw createInputValidationError(message, { operation: 'statement.searchStatements', stage: PopbillErrorStage.ValidateInput })
  }
  if (!Object.values(types.StatementDateType).includes(request.searchDateType)) fail('searchDateType이 올바르지 않습니다.')
  const startDate = normalizeDate(request.startDate, 'startDate', fail)
  const endDate = normalizeDate(request.endDate, 'endDate', fail)
  if (startDate > endDate) fail('startDate는 endDate 이후일 수 없습니다.')
  if (
    request.stateCodes !== undefined &&
    (!Array.isArray(request.stateCodes) || request.stateCodes.some((code) => typeof code !== 'string' || !/^\d[\d*][\d*]$/.test(code)))
  ) {
    fail('stateCodes는 숫자 3자리 또는 와일드카드 상태코드 배열이어야 합니다.')
  }
  if (
    request.documentTypeCodes !== undefined &&
    (!Array.isArray(request.documentTypeCodes) || request.documentTypeCodes.some((code) => !Object.values(types.StatementItemCodes).includes(code)))
  ) {
    fail('documentTypeCodes가 올바르지 않습니다.')
  }
  const sortOrder = request.sortOrder ?? types.StatementSortOrder.Descending
  if (!Object.values(types.StatementSortOrder).includes(sortOrder)) fail('sortOrder가 올바르지 않습니다.')
  const pageNumber = request.pageNumber ?? 1
  const pageSize = request.pageSize ?? 100
  if (!Number.isInteger(pageNumber) || pageNumber < 1) fail('pageNumber는 1 이상의 정수여야 합니다.')
  if (!Number.isInteger(pageSize) || pageSize < 1) fail('pageSize는 1 이상의 정수여야 합니다.')
  return { startDate, endDate, sortOrder, pageNumber, pageSize }
}

function normalizeDate(value: string, field: string, fail: (message: string) => never): string {
  if (typeof value !== 'string') fail(`${field}는 yyyyMMdd 형식이어야 합니다.`)
  const normalized = value.trim()
  if (!/^\d{8}$/.test(normalized)) fail(`${field}는 yyyyMMdd 형식이어야 합니다.`)
  if (!isValidCalendarDate8(normalized)) fail(`${field}가 유효한 날짜가 아닙니다.`)
  return normalized
}
