import type { HTTaxinvoicePromiseService } from '@connextable/popbill-compat/factory'
import { createInputValidationError } from '@connextable/popbill-compat/errors'
import { isValidCalendarDate8 } from '@connextable/popbill-utils'
import type { PopbillApiError } from '@/errors'
import { invokeHomeTaxTaxInvoice } from './adapters/error'
import * as mappers from './mappers'
import type * as types from './types'

interface CreateHomeTaxTaxInvoiceServiceInput {
  compatHTTaxinvoiceService: HTTaxinvoicePromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}
export function createHomeTaxTaxInvoiceService(input: CreateHomeTaxTaxInvoiceServiceInput): types.HomeTaxTaxInvoiceService {
  const compat = input.compatHTTaxinvoiceService
  const userId = input.defaultUserId
  const invoke = <T>(method: keyof types.HomeTaxTaxInvoiceService, handler: () => Promise<T>) => invokeHomeTaxTaxInvoice(input, method, handler)
  return {
    getAuthenticationRegistrationUrl(request) {
      return invoke('getAuthenticationRegistrationUrl', async () => ({
        accessUrl: await compat.getCertificatePopUpURL(request.businessNumber, userId),
      }))
    },
    getCertificateExpiration(request) {
      return invoke('getCertificateExpiration', async () => ({ expiresAt: await compat.getCertificateExpireDate(request.businessNumber) }))
    },
    validateCertificate(request) {
      return invoke('validateCertificate', async () => mappers.mapOperation(await compat.checkCertValidation(request.businessNumber)))
    },
    registerDepartmentUser(request) {
      return invoke('registerDepartmentUser', async () => {
        if (request.identityNumber != null && request.identityNumber !== '' && !/^\d{7}$/.test(request.identityNumber))
          invalid('identityNumber는 주민번호 앞 7자리여야 합니다.', 'registerDepartmentUser')
        return mappers.mapOperation(
          await compat.registDeptUser(request.businessNumber, request.departmentUserId, request.departmentPassword, request.identityNumber, userId)
        )
      })
    },
    checkDepartmentUserRegistration(request) {
      return invoke('checkDepartmentUserRegistration', async () => mappers.mapOperation(await compat.checkDeptUser(request.businessNumber, userId)))
    },
    validateDepartmentUserLogin(request) {
      return invoke('validateDepartmentUserLogin', async () => mappers.mapOperation(await compat.checkLoginDeptUser(request.businessNumber)))
    },
    deleteDepartmentUser(request) {
      return invoke('deleteDepartmentUser', async () => mappers.mapOperation(await compat.deleteDeptUser(request.businessNumber, userId)))
    },
    requestCollection(request) {
      return invoke('requestCollection', async () => {
        validateDateRange(request.startDate, request.endDate)
        return {
          jobId: await compat.requestJob(
            request.businessNumber,
            request.invoiceDirection,
            request.searchDateType,
            request.startDate,
            request.endDate,
            userId
          ),
        }
      })
    },
    getCollectionState(request) {
      return invoke('getCollectionState', async () => mappers.mapJob(await compat.getJobState(request.businessNumber, request.jobId, userId)))
    },
    listActiveCollections(request) {
      return invoke('listActiveCollections', async () => (await compat.listActiveJob(request.businessNumber, userId)).map(mappers.mapJob))
    },
    searchTaxInvoices(request) {
      return invoke('searchTaxInvoices', async () => {
        const pageNumber = request.pageNumber ?? 1
        const pageSize = request.pageSize ?? 500
        const order = request.sortOrder ?? 'D'
        if (!Number.isInteger(pageNumber) || pageNumber < 1) invalid('pageNumber는 1 이상의 정수여야 합니다.', 'searchTaxInvoices')
        if (!Number.isInteger(pageSize) || pageSize < 1) invalid('pageSize는 1 이상의 정수여야 합니다.', 'searchTaxInvoices')
        if (typeof order !== 'string' || order.trim() === '') invalid('sortOrder는 비어 있지 않은 문자열이어야 합니다.', 'searchTaxInvoices')
        const filters = mapFilters(request)
        return mappers.mapSearch(
          await compat.search(request.businessNumber, request.jobId, ...filters, pageNumber, pageSize, order, userId, request.queryText)
        )
      })
    },
    getTaxInvoiceTotals(request) {
      return invoke('getTaxInvoiceTotals', async () =>
        mappers.mapTotals(await compat.summary(request.businessNumber, request.jobId, ...mapFilters(request), userId, request.queryText))
      )
    },
    getTaxInvoice(request) {
      return invoke('getTaxInvoice', async () =>
        mappers.mapDocument(await compat.getTaxinvoice(request.businessNumber, request.confirmationNumber, userId))
      )
    },
    getTaxInvoiceXml(request) {
      return invoke('getTaxInvoiceXml', async () => {
        const value = await compat.getXML(request.businessNumber, request.confirmationNumber, userId)
        return { resultCode: value.ResultCode, resultMessage: value.Message, xml: value.retObject }
      })
    },
    getTaxInvoicePopupUrl(request) {
      return invoke('getTaxInvoicePopupUrl', async () => ({
        accessUrl: await compat.getPopUpURL(request.businessNumber, request.confirmationNumber, userId),
      }))
    },
    getTaxInvoicePrintUrl(request) {
      return invoke('getTaxInvoicePrintUrl', async () => ({
        accessUrl: await compat.getPrintURL(request.businessNumber, request.confirmationNumber, userId),
      }))
    },
    getFlatRateApplicationUrl(request) {
      return invoke('getFlatRateApplicationUrl', async () => ({ accessUrl: await compat.getFlatRatePopUpURL(request.businessNumber, userId) }))
    },
    getFlatRateState(request) {
      return invoke('getFlatRateState', async () => mappers.mapFlatRateState(await compat.getFlatRateState(request.businessNumber, userId)))
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', async () => ({ ...(await compat.getChargeInfo(request.businessNumber, userId)) }))
    },
  }
}
function mapFilters(
  request: types.HomeTaxTaxInvoiceFiltersInput
): [string[] | undefined, string[] | undefined, string[] | undefined, string | undefined, string | undefined, string | undefined] {
  return [
    request.documentTypes,
    request.taxTypes,
    request.purposeTypes,
    request.taxRegistrationParty,
    request.hasTaxRegistrationId === undefined ? undefined : request.hasTaxRegistrationId ? '1' : '0',
    request.taxRegistrationIds?.join(','),
  ]
}
function invalid(message: string, method: string): never {
  throw createInputValidationError(message, { operation: `homeTaxTaxInvoice.${method}` })
}
function validateDateRange(startDate: string, endDate: string): void {
  for (const dateValue of [startDate, endDate]) {
    if (typeof dateValue !== 'string' || !/^\d{8}$/.test(dateValue)) invalid('수집일자는 yyyyMMdd 형식이어야 합니다.', 'requestCollection')
    if (!isValidCalendarDate8(dateValue)) invalid('유효한 수집일자가 아닙니다.', 'requestCollection')
  }
  if (startDate > endDate) invalid('startDate는 endDate 이후일 수 없습니다.', 'requestCollection')
}
