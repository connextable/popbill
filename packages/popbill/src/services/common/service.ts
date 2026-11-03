import type { CommonPromiseService } from '@connextable/popbill-compat/factory'
import { createInputValidationError } from '@connextable/popbill-compat/errors'
import { isValidCalendarDate8, parseSafeInteger } from '@connextable/popbill-utils'
import { PopbillErrorStage, type PopbillApiError } from '@/errors'
import { invokeCommonMethod } from './adapters/error'
import { mapCompany, mapContact } from './mappers/document'
import * as map from './mappers/response'
import type * as Types from './types'

export interface CreateCommonServiceInput {
  compatCommonService: CommonPromiseService
  defaultUserId: string
  linkId: string
  onError?: (error: PopbillApiError) => void
}
export function createCommonService(input: CreateCommonServiceInput): Types.CommonService {
  const compat = input.compatCommonService
  const userId = input.defaultUserId
  const invoke = <T>(method: keyof Types.CommonService, handler: () => Promise<T>): Promise<T> =>
    invokeCommonMethod(input, `common.${method}`, handler)
  return {
    checkMemberRegistration(request) {
      return invoke('checkMemberRegistration', async () => {
        const result = await compat.checkIsMember(request.businessNumber)
        return { ...map.operation(result), isMember: parseSafeInteger(result.code) === 1 }
      })
    },
    checkUserIdUsage(request) {
      return invoke('checkUserIdUsage', async () => {
        const result = await compat.checkID(request.userId)
        return { ...map.operation(result), isInUse: parseSafeInteger(result.code) === 1 }
      })
    },
    registerMember(request) {
      return invoke('registerMember', async () =>
        map.operation(
          await compat.joinMember({
            LinkID: input.linkId,
            CorpNum: request.businessNumber,
            ID: request.userId,
            Password: request.password,
            CorpName: request.company.companyName,
            CEOName: request.company.chiefExecutiveOfficerName,
            Addr: request.company.address,
            BizType: request.company.businessType,
            BizClass: request.company.businessClass,
            ContactName: request.contactName,
            ContactTEL: request.contactPhoneNumber,
            ContactEmail: request.contactEmailAddress,
          })
        )
      )
    },
    quitMember(request) {
      return invoke('quitMember', async () => map.operation(await compat.quitMember(request.businessNumber, request.reason, userId)))
    },
    getCompanyInfo(request) {
      return invoke('getCompanyInfo', async () => map.company(await compat.getCorpInfo(request.businessNumber, userId)))
    },
    updateCompanyInfo(request) {
      return invoke('updateCompanyInfo', async () =>
        map.operation(await compat.updateCorpInfo(request.businessNumber, userId, mapCompany(request.company)))
      )
    },
    registerContact(request) {
      return invoke('registerContact', async () =>
        map.operation(
          await compat.registContact(request.businessNumber, userId, { ...mapContact(request.contact), password: request.contact.password })
        )
      )
    },
    getContactInfo(request) {
      return invoke('getContactInfo', async () => map.contact(await compat.getContactInfo(request.businessNumber, request.contactUserId, userId)))
    },
    listContacts(request) {
      return invoke('listContacts', async () => (await compat.listContact(request.businessNumber, userId)).map(map.contact))
    },
    updateContact(request) {
      return invoke('updateContact', async () =>
        map.operation(await compat.updateContact(request.businessNumber, userId, mapContact(request.contact)))
      )
    },
    deleteContact(request) {
      return invoke('deleteContact', async () => map.operation(await compat.deleteContact(request.businessNumber, request.contactUserId, userId)))
    },
    getLoginURL(request) {
      return invoke('getLoginURL', async () => ({ accessUrl: await compat.getAccessURL(request.businessNumber, userId) }))
    },
    getMemberPointBalance(request) {
      return invoke('getMemberPointBalance', async () => ({ remainingPoints: await compat.getBalance(request.businessNumber) }))
    },
    getPartnerPointBalance(request) {
      return invoke('getPartnerPointBalance', async () => ({ remainingPoints: await compat.getPartnerBalance(request.businessNumber) }))
    },
    getMemberPointChargeURL(request) {
      return invoke('getMemberPointChargeURL', async () => ({ accessUrl: await compat.getChargeURL(request.businessNumber, userId) }))
    },
    getPartnerPointChargeURL(request) {
      return invoke('getPartnerPointChargeURL', async () => ({ accessUrl: await compat.getPartnerURL(request.businessNumber, 'CHRG') }))
    },
    requestPointPayment(request) {
      return invoke('requestPointPayment', async () => {
        const result = await compat.paymentRequest(
          request.businessNumber,
          {
            paymentName: request.paymentName,
            settleCost: request.paymentAmount,
            settlerName: request.contactName,
            settlerEmail: request.contactEmailAddress,
            notifyHP: request.notificationPhoneNumber,
          },
          userId
        )
        return { settlementCode: result.settleCode, ...map.operation(result) }
      })
    },
    getPointPaymentInfo(request) {
      return invoke('getPointPaymentInfo', async () =>
        map.payment(await compat.getSettleResult(request.businessNumber, request.settlementCode, userId))
      )
    },
    getPointPaymentHistory(request) {
      return invoke('getPointPaymentHistory', async () => {
        validateHistory(request, 'getPointPaymentHistory')
        return map.page(
          await compat.getPaymentHistory(request.businessNumber, request.startDate, request.endDate, request.pageNumber, request.pageSize, userId),
          map.payment
        )
      })
    },
    getPointPaymentHistoryURL(request) {
      return invoke('getPointPaymentHistoryURL', async () => ({ accessUrl: await compat.getPaymentURL(request.businessNumber, userId) }))
    },
    getPointUseHistory(request) {
      return invoke('getPointUseHistory', async () => {
        validateHistory(request, 'getPointUseHistory')
        if (request.sortOrder !== undefined && request.sortOrder !== 'A' && request.sortOrder !== 'D')
          invalid('sortOrder가 올바르지 않습니다.', 'getPointUseHistory')
        return map.page(
          await compat.getUseHistory(
            request.businessNumber,
            request.startDate,
            request.endDate,
            request.pageNumber,
            request.pageSize,
            request.sortOrder,
            userId
          ),
          map.use
        )
      })
    },
    getPointUseHistoryURL(request) {
      return invoke('getPointUseHistoryURL', async () => ({ accessUrl: await compat.getUseHistoryURL(request.businessNumber, userId) }))
    },
    getRefundablePointBalance(request) {
      return invoke('getRefundablePointBalance', async () => ({
        refundablePoints: (await compat.getRefundableBalance(request.businessNumber, userId)).refundableBalance,
      }))
    },
    requestPointRefund(request) {
      return invoke('requestPointRefund', async () => {
        const result = await compat.refund(
          request.businessNumber,
          {
            accountbank: request.bankName,
            accountnum: request.accountNumber,
            accountname: request.accountHolderName,
            requestpoint: request.requestedPoints,
            contactname: request.contactName,
            tel: request.phoneNumber,
            reason: request.reason,
          },
          userId
        )
        return { refundCode: result.refundCode, ...map.operation(result) }
      })
    },
    getPointRefundInfo(request) {
      return invoke('getPointRefundInfo', async () => map.refund(await compat.getRefundInfo(request.businessNumber, request.refundCode, userId)))
    },
    getPointRefundHistory(request) {
      return invoke('getPointRefundHistory', async () => {
        validatePage(request, 'getPointRefundHistory')
        return map.page(await compat.getRefundHistory(request.businessNumber, request.pageNumber, request.pageSize, userId), map.refund)
      })
    },
  }
}
function invalid(message: string, method: keyof Types.CommonService): never {
  throw createInputValidationError(message, { operation: `common.${method}`, stage: PopbillErrorStage.ValidateInput })
}
function validatePage(request: Types.CommonPageInput, method: keyof Types.CommonService): void {
  if (request.pageNumber !== undefined && (!Number.isInteger(request.pageNumber) || request.pageNumber < 1))
    invalid('pageNumber는 1 이상의 정수여야 합니다.', method)
  if (request.pageSize !== undefined && (!Number.isInteger(request.pageSize) || request.pageSize < 1))
    invalid('pageSize는 1 이상의 정수여야 합니다.', method)
}
function validateHistory(request: Types.CommonHistoryInput, method: keyof Types.CommonService): void {
  validatePage(request, method)
  for (const date of [request.startDate, request.endDate]) {
    if (!/^\d{8}$/.test(date)) invalid('조회일자는 yyyyMMdd 형식이어야 합니다.', method)
    // History dates previously serialized the year without leading zeroes.
    if (!isValidCalendarDate8(date) || date.startsWith('0')) invalid('유효한 조회일자를 입력해야 합니다.', method)
  }
  if (request.startDate > request.endDate) invalid('startDate는 endDate 이후일 수 없습니다.', method)
}
