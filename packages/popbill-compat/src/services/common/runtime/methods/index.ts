import type { CommonPromiseService } from '../../types'
import type { CommonRuntimeContext } from '../context'
import { createCheckIsMember } from './check-is-member'
import { createCheckID } from './check-id'
import { createJoinMember } from './join-member'
import { createQuitMember } from './quit-member'
import { createGetCorpInfo } from './get-corp-info'
import { createUpdateCorpInfo } from './update-corp-info'
import { createRegistContact } from './register-contact'
import { createGetContactInfo } from './get-contact-info'
import { createListContact } from './list-contacts'
import { createUpdateContact } from './update-contact'
import { createDeleteContact } from './delete-contact'
import { createGetAccessURL } from './get-access-url'
import { createGetPopbillURL } from './get-popbill-url'
import { createGetBalance } from './get-balance'
import { createGetPartnerBalance } from './get-partner-balance'
import { createGetChargeURL } from './get-charge-url'
import { createGetPartnerURL } from './get-partner-url'
import { createPaymentRequest } from './request-payment'
import { createGetSettleResult } from './get-settlement-result'
import { createGetPaymentHistory } from './get-payment-history'
import { createGetPaymentURL } from './get-payment-url'
import { createGetUseHistory } from './get-use-history'
import { createGetUseHistoryURL } from './get-use-history-url'
import { createGetRefundableBalance } from './get-refundable-balance'
import { createRefund } from './request-refund'
import { createGetRefundInfo } from './get-refund-info'
import { createGetRefundHistory } from './get-refund-history'

export function createCommonRequests(context: CommonRuntimeContext): CommonPromiseService {
  return {
    checkIsMember: createCheckIsMember(context),
    checkID: createCheckID(context),
    joinMember: createJoinMember(context),
    quitMember: createQuitMember(context),
    getCorpInfo: createGetCorpInfo(context),
    updateCorpInfo: createUpdateCorpInfo(context),
    registContact: createRegistContact(context),
    getContactInfo: createGetContactInfo(context),
    listContact: createListContact(context),
    updateContact: createUpdateContact(context),
    deleteContact: createDeleteContact(context),
    getAccessURL: createGetAccessURL(context),
    getPopbillURL: createGetPopbillURL(context),
    getBalance: createGetBalance(context),
    getPartnerBalance: createGetPartnerBalance(context),
    getChargeURL: createGetChargeURL(context),
    getPartnerURL: createGetPartnerURL(context),
    paymentRequest: createPaymentRequest(context),
    getSettleResult: createGetSettleResult(context),
    getPaymentHistory: createGetPaymentHistory(context),
    getPaymentURL: createGetPaymentURL(context),
    getUseHistory: createGetUseHistory(context),
    getUseHistoryURL: createGetUseHistoryURL(context),
    getRefundableBalance: createGetRefundableBalance(context),
    refund: createRefund(context),
    getRefundInfo: createGetRefundInfo(context),
    getRefundHistory: createGetRefundHistory(context),
  }
}
