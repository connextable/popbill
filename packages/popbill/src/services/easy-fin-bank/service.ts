import type { EasyFinBankPromiseService } from '@connextable/popbill-compat/factory'
import type { PopbillApiError } from '@/errors'
import { invokeEasyFinBankMethod } from './adapters/error'
import { mapAccountChanges, mapAccountRegistration } from './mappers/document'
import * as mappers from './mappers/response'
import type { EasyFinBankService } from './types'

interface CreateEasyFinBankServiceInput {
  compatEasyFinBankService: EasyFinBankPromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}

export function createEasyFinBankService(input: CreateEasyFinBankServiceInput): EasyFinBankService {
  const compat = input.compatEasyFinBankService
  const userId = input.defaultUserId
  const invoke = <T>(method: keyof EasyFinBankService, handler: () => Promise<T>) => invokeEasyFinBankMethod(input, `easyFinBank.${method}`, handler)
  return {
    getBankAccountManagementURL(request) {
      return invoke('getBankAccountManagementURL', async () => ({ url: await compat.getBankAccountMgtURL(request.businessNumber, userId) }))
    },
    registerBankAccount(request) {
      return invoke('registerBankAccount', async () =>
        mappers.mapOperation(
          await compat.registBankAccount(
            request.businessNumber,
            { ...mapAccountRegistration(request.account), UsePeriod: request.subscriptionMonths },
            userId
          )
        )
      )
    },
    updateBankAccount(request) {
      return invoke('updateBankAccount', async () =>
        mappers.mapOperation(
          await compat.updateBankAccount(request.businessNumber, request.bankCode, request.accountNumber, mapAccountChanges(request.account), userId)
        )
      )
    },
    getBankAccount(request) {
      return invoke('getBankAccount', async () =>
        mappers.mapBankAccount(await compat.getBankAccountInfo(request.businessNumber, request.bankCode, request.accountNumber, userId))
      )
    },
    listBankAccounts(request) {
      return invoke('listBankAccounts', async () => (await compat.listBankAccount(request.businessNumber, userId)).map(mappers.mapBankAccount))
    },
    requestBankAccountClosure(request) {
      return invoke('requestBankAccountClosure', async () =>
        mappers.mapOperation(await compat.closeBankAccount(request.businessNumber, request.bankCode, request.accountNumber, '일반', userId))
      )
    },
    cancelBankAccountClosure(request) {
      return invoke('cancelBankAccountClosure', async () =>
        mappers.mapOperation(await compat.revokeCloseBankAccount(request.businessNumber, request.bankCode, request.accountNumber, userId))
      )
    },
    deleteBankAccount(request) {
      return invoke('deleteBankAccount', async () =>
        mappers.mapOperation(await compat.deleteBankAccount(request.businessNumber, request.bankCode, request.accountNumber, userId))
      )
    },
    requestCollection(request) {
      return invoke('requestCollection', async () => ({
        collectionId: await compat.requestJob(
          request.businessNumber,
          request.bankCode,
          request.accountNumber,
          request.startDate,
          request.endDate,
          userId
        ),
      }))
    },
    getCollectionStatus(request) {
      return invoke('getCollectionStatus', async () =>
        mappers.mapCollectionStatus(await compat.getJobState(request.businessNumber, request.collectionId, userId))
      )
    },
    listCollectionStatuses(request) {
      return invoke('listCollectionStatuses', async () =>
        (await compat.listActiveJob(request.businessNumber, userId)).map(mappers.mapCollectionStatus)
      )
    },
    searchTransactions(request) {
      return invoke('searchTransactions', async () =>
        mappers.mapSearchResult(
          await compat.search(
            request.businessNumber,
            request.collectionId,
            request.transactionTypes ? [...request.transactionTypes] : undefined,
            request.queryText,
            request.pageNumber,
            request.pageSize,
            request.sortOrder,
            userId
          )
        )
      )
    },
    summarizeTransactions(request) {
      return invoke('summarizeTransactions', async () =>
        mappers.mapSummary(
          await compat.summary(
            request.businessNumber,
            request.collectionId,
            request.transactionTypes ? [...request.transactionTypes] : undefined,
            request.queryText,
            userId
          )
        )
      )
    },
    saveTransactionMemo(request) {
      return invoke('saveTransactionMemo', async () =>
        mappers.mapOperation(await compat.saveMemo(request.businessNumber, request.transactionId, request.memo, userId))
      )
    },
    getSubscriptionRegistrationURL(request) {
      return invoke('getSubscriptionRegistrationURL', async () => ({ url: await compat.getFlatRatePopUpURL(request.businessNumber, userId) }))
    },
    getSubscriptionStatus(request) {
      return invoke('getSubscriptionStatus', async () =>
        mappers.mapSubscription(await compat.getFlatRateState(request.businessNumber, request.bankCode, request.accountNumber, userId))
      )
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', async () => mappers.mapChargeInfo(await compat.getChargeInfo(request.businessNumber, userId)))
    },
  }
}
