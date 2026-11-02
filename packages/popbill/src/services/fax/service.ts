import type { FaxPromiseService } from '@connextable/popbill-compat/factory'
import { createInputValidationError } from '@connextable/popbill-compat/errors'
import { PopbillErrorStage, type PopbillApiError } from '@/errors'
import { invokeFaxMethod } from './adapters/error'
import { mapFaxResendInput, mapFaxSendInput } from './mappers/document'
import { mapFaxResult, mapFaxSearchResult, mapFaxSenderNumber } from './mappers/response'
import type { FaxService, SearchFaxesInput } from './types'

interface CreateFaxServiceInput {
  compatFaxService: FaxPromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}

/** Converts explicit object inputs to the legacy wire adapter. */
export function createFaxService(input: CreateFaxServiceInput): FaxService {
  const compat = input.compatFaxService
  const userId = input.defaultUserId
  const invoke = <T>(method: keyof FaxService, handler: () => Promise<T>): Promise<T> => invokeFaxMethod(input, `fax.${method}`, handler)
  return {
    getFaxSenderRegistrationURL(request) {
      return invoke('getFaxSenderRegistrationURL', async () => ({ url: await compat.getSenderNumberMgtURL(request.businessNumber, userId) }))
    },
    getSenderNumbers(request) {
      return invoke('getSenderNumbers', async () => (await compat.getSenderNumberList(request.businessNumber, userId)).map(mapFaxSenderNumber))
    },
    checkSenderNumber(request) {
      return invoke('checkSenderNumber', () => compat.checkSenderNumber(request.businessNumber, request.senderPhoneNumber, userId))
    },
    sendFaxFromPaths(request) {
      return invoke('sendFaxFromPaths', async () => ({
        receiptNumber: await compat.sendFax(request.businessNumber, { ...mapFaxSendInput(request, userId), FilePaths: [...request.filePaths] }),
      }))
    },
    sendFaxFromBinary(request) {
      return invoke('sendFaxFromBinary', async () => ({
        receiptNumber: await compat.sendFaxBinary(request.businessNumber, {
          ...mapFaxSendInput(request, userId),
          BinaryFiles: request.files.map((file) => ({ fileName: file.fileName, fileData: file.fileData })),
        }),
      }))
    },
    resendFaxByReceipt(request) {
      return invoke('resendFaxByReceipt', async () => ({
        receiptNumber: await compat.resendFax(request.businessNumber, { ...mapFaxResendInput(request, userId), ReceiptNum: request.receiptNumber }),
      }))
    },
    resendFaxByRequest(request) {
      return invoke('resendFaxByRequest', async () => ({
        receiptNumber: await compat.resendFaxRN(request.businessNumber, {
          ...mapFaxResendInput(request, userId),
          OrgRequestNum: request.requestNumber,
        }),
      }))
    },
    cancelScheduledFaxByReceipt(request) {
      return invoke('cancelScheduledFaxByReceipt', () => compat.cancelReserve(request.businessNumber, request.receiptNumber, userId))
    },
    cancelScheduledFaxByRequest(request) {
      return invoke('cancelScheduledFaxByRequest', () => compat.cancelReserveRN(request.businessNumber, request.requestNumber, userId))
    },
    getFaxResultsByReceipt(request) {
      return invoke('getFaxResultsByReceipt', async () =>
        (await compat.getFaxResult(request.businessNumber, request.receiptNumber, userId)).map(mapFaxResult)
      )
    },
    getFaxResultsByRequest(request) {
      return invoke('getFaxResultsByRequest', async () =>
        (await compat.getFaxResultRN(request.businessNumber, request.requestNumber, userId)).map(mapFaxResult)
      )
    },
    searchFaxes(request) {
      return invoke('searchFaxes', async () => {
        const normalized = normalizeSearch(request)
        return mapFaxSearchResult(
          await compat.search(
            request.businessNumber,
            normalized.startDate,
            normalized.endDate,
            request.stateCodes === undefined ? undefined : [...request.stateCodes],
            request.scheduledOnly,
            request.currentUserOnly,
            normalized.sortOrder,
            normalized.pageNumber,
            normalized.pageSize,
            request.queryText,
            userId
          )
        )
      })
    },
    getSentFaxListURL(request) {
      return invoke('getSentFaxListURL', async () => ({ url: await compat.getSentListURL(request.businessNumber, userId) }))
    },
    getFaxPreviewURL(request) {
      return invoke('getFaxPreviewURL', async () => ({ url: await compat.getPreviewURL(request.businessNumber, request.receiptNumber, userId) }))
    },
    getUnitCost(request) {
      return invoke('getUnitCost', async () => ({ unitCost: await compat.getUnitCost(request.businessNumber, request.receiveNumberType, userId) }))
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', () => compat.getChargeInfo(request.businessNumber, request.receiveNumberType, userId))
    },
  }
}

function normalizeSearch(input: SearchFaxesInput) {
  const fail = (message: string): never => {
    throw createInputValidationError(message, { operation: 'fax.searchFaxes', stage: PopbillErrorStage.ValidateInput })
  }
  const date = (value: string, field: string): string => {
    if (typeof value !== 'string' || !/^\d{8}$/.test(value.trim())) return fail(`${field}는 yyyyMMdd 형식이어야 합니다.`)
    const normalized = value.trim()
    const year = Number(normalized.slice(0, 4)),
      month = Number(normalized.slice(4, 6)),
      day = Number(normalized.slice(6, 8))
    const parsed = new Date(Date.UTC(year, month - 1, day))
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day)
      return fail(`${field}가 유효한 날짜가 아닙니다.`)
    return normalized
  }
  const startDate = date(input.startDate, 'startDate'),
    endDate = date(input.endDate, 'endDate')
  if (startDate > endDate) fail('startDate는 endDate 이후일 수 없습니다.')
  const sortOrder = input.sortOrder ?? 'D',
    pageNumber = input.pageNumber ?? 1,
    pageSize = input.pageSize ?? 500
  if (sortOrder !== 'A' && sortOrder !== 'D') fail('sortOrder가 올바르지 않습니다.')
  if (!Number.isInteger(pageNumber) || pageNumber < 1) fail('pageNumber는 1 이상의 정수여야 합니다.')
  if (!Number.isInteger(pageSize) || pageSize < 1) fail('pageSize는 1 이상의 정수여야 합니다.')
  if (input.stateCodes !== undefined && (!Array.isArray(input.stateCodes) || input.stateCodes.some((state) => typeof state !== 'string')))
    fail('stateCodes가 올바르지 않습니다.')
  return { startDate, endDate, sortOrder, pageNumber, pageSize }
}
