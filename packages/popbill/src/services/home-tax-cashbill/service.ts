import type { HTCashbillPromiseService } from '@connextable/popbill-compat/factory'
import type { PopbillApiError } from '@/errors'
import { invokeHomeTaxCashbillMethod } from './adapters/error'
import { failInput, normalizeSearch, validateCollectionInput, validateFilters } from './adapters/validation'
import * as mappers from './mappers'
import type { HomeTaxCashbillService } from './types'

interface CreateHomeTaxCashbillServiceInput {
  compatHomeTaxCashbillService: HTCashbillPromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}

export function createHomeTaxCashbillService(input: CreateHomeTaxCashbillServiceInput): HomeTaxCashbillService {
  const compat = input.compatHomeTaxCashbillService
  const userId = input.defaultUserId
  const invoke = <T>(method: keyof HomeTaxCashbillService, handler: () => Promise<T>) =>
    invokeHomeTaxCashbillMethod(input, `homeTaxCashbill.${method}`, handler)
  return {
    getAuthenticationRegistrationUrl(request) {
      return invoke('getAuthenticationRegistrationUrl', async () => ({ url: await compat.getCertificatePopUpURL(request.businessNumber, userId) }))
    },
    getCertificateExpiration(request) {
      return invoke('getCertificateExpiration', async () => ({ expiresAt: await compat.getCertificateExpireDate(request.businessNumber) }))
    },
    validateCertificate(request) {
      return invoke('validateCertificate', () => compat.checkCertValidation(request.businessNumber))
    },
    registerDepartmentUser(request) {
      return invoke('registerDepartmentUser', async () => {
        if (
          request.representativeIdentityPrefix != null &&
          request.representativeIdentityPrefix !== '' &&
          !/^\d{7}$/.test(request.representativeIdentityPrefix)
        )
          failInput('registerDepartmentUser', 'representativeIdentityPrefix는 숫자 7자리여야 합니다.')
        return compat.registDeptUser(
          request.businessNumber,
          request.departmentUserId,
          request.departmentUserPassword,
          request.representativeIdentityPrefix,
          userId
        )
      })
    },
    checkDepartmentUserRegistration(request) {
      return invoke('checkDepartmentUserRegistration', () => compat.checkDeptUser(request.businessNumber, userId))
    },
    validateDepartmentUser(request) {
      return invoke('validateDepartmentUser', () => compat.checkLoginDeptUser(request.businessNumber))
    },
    deleteDepartmentUser(request) {
      return invoke('deleteDepartmentUser', () => compat.deleteDeptUser(request.businessNumber, userId))
    },
    requestCollection(request) {
      return invoke('requestCollection', async () => {
        validateCollectionInput(request)
        return { jobId: await compat.requestJob(request.businessNumber, request.receiptDirection, request.startDate, request.endDate, userId) }
      })
    },
    getCollectionJobState(request) {
      return invoke('getCollectionJobState', async () =>
        mappers.mapCollectionJobState(await compat.getJobState(request.businessNumber, request.jobId, userId))
      )
    },
    listActiveCollectionJobs(request) {
      return invoke('listActiveCollectionJobs', async () =>
        (await compat.listActiveJob(request.businessNumber, userId)).map(mappers.mapCollectionJobState)
      )
    },
    searchCashbills(request) {
      return invoke('searchCashbills', async () => {
        const options = normalizeSearch(request)
        return mappers.mapSearchResult(
          await compat.search(
            request.businessNumber,
            request.jobId,
            request.tradeTypes,
            request.tradeUsages,
            options.pageNumber,
            options.pageSize,
            options.sortOrder,
            userId
          )
        )
      })
    },
    getCashbillSummary(request) {
      return invoke('getCashbillSummary', async () => {
        validateFilters(request, 'getCashbillSummary')
        return mappers.mapSummary(await compat.summary(request.businessNumber, request.jobId, request.tradeTypes, request.tradeUsages, userId))
      })
    },
    getFlatRateRegistrationUrl(request) {
      return invoke('getFlatRateRegistrationUrl', async () => ({ url: await compat.getFlatRatePopUpURL(request.businessNumber, userId) }))
    },
    getFlatRateState(request) {
      return invoke('getFlatRateState', async () => mappers.mapFlatRateState(await compat.getFlatRateState(request.businessNumber, userId)))
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', () => compat.getChargeInfo(request.businessNumber, userId))
    },
  }
}
