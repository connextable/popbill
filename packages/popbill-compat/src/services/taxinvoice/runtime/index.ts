import type {
  TaxInvoiceApiModel,
  TaxInvoiceApiResponseBase,
  TaxInvoiceAttachFileBinaryPayload,
  TaxInvoiceGetUrlTogo,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import type { CompatConfig } from '@/config'
import type {
  TaxinvoiceCallbackService,
  TaxinvoicePromiseService,
} from '@/services/taxinvoice/types'
import {
  handleCallbackError,
  parseLegacyUserIdAndCallbacks,
  throwPromiseError,
  type TaxinvoiceRuntimeMethods,
} from './common'
import { createTaxinvoiceRuntimeContext } from './context'
import { parseBulkSubmitCallbackArgs, parseBulkSubmitPromiseArgs } from './parsers/bulk-submit'
import { parseIssueCallbackArgs, parseIssuePromiseArgs } from './parsers/issue'
import { parseRegistIssueCallbackArgs, parseRegistIssuePromiseArgs } from './parsers/regist-issue'
import { parseSearchCallbackArgs, parseSearchPromiseArgs } from './parsers/search'
import { parseGetUrlCallbackArgs, parseUrlMethodCallbackArgs } from './parsers/url'
import { requestAssignMgtKey } from './methods/assign-mgt-key'
import { requestAttachFileBinary } from './methods/attach-file-binary'
import { requestAttachFile } from './methods/attach-file'
import { requestAttachStatement } from './methods/attach-statement'
import { requestBulkSubmit } from './methods/bulk-submit'
import { requestCancelIssue } from './methods/cancel-issue'
import { requestCancelRequest } from './methods/cancel-request'
import { requestCheckCertValidation } from './methods/check-cert-validation'
import { requestCheckMgtKeyInUse } from './methods/check-mgt-key-in-use'
import { requestDeleteFile } from './methods/delete-file'
import { requestDelete } from './methods/delete'
import { requestDetachStatement } from './methods/detach-statement'
import { requestGetBulkResult } from './methods/get-bulk-result'
import { requestGetCertificateExpireDate } from './methods/get-certificate-expire-date'
import { requestGetDetailInfo } from './methods/get-detail-info'
import { requestGetEPrintUrl } from './methods/get-e-print-url'
import { requestGetFiles } from './methods/get-files'
import { requestGetInfo } from './methods/get-info'
import { requestGetInfos } from './methods/get-infos'
import { requestGetLogs } from './methods/get-logs'
import { requestGetMailUrl } from './methods/get-mail-url'
import { requestGetMassPrintUrl } from './methods/get-mass-print-url'
import { requestGetPdfUrl } from './methods/get-pdf-url'
import { requestGetPopUpUrl } from './methods/get-pop-up-url'
import { requestGetPrintUrl } from './methods/get-print-url'
import { requestGetSealUrl } from './methods/get-seal-url'
import { requestGetSendToNtsConfig } from './methods/get-send-to-nts-config'
import { requestGetTaxCertInfo } from './methods/get-tax-cert-info'
import { requestGetTaxCertUrl } from './methods/get-tax-cert-url'
import { requestGetUrl } from './methods/get-url'
import { requestGetViewUrl } from './methods/get-view-url'
import { requestGetXml } from './methods/get-xml'
import { requestIssue } from './methods/issue'
import { requestListEmailConfig } from './methods/list-email-config'
import { requestRefuse } from './methods/refuse'
import { requestRegistIssue } from './methods/regist-issue'
import { requestRegistRequest } from './methods/regist-request'
import { requestRegister } from './methods/register'
import { requestRequest } from './methods/request'
import { requestSearch } from './methods/search'
import { requestSendEmail } from './methods/send-email'
import { requestSendFax } from './methods/send-fax'
import { requestSendSms } from './methods/send-sms'
import { requestSendToNts } from './methods/send-to-nts'
import { requestUpdateEmailConfig } from './methods/update-email-config'
import { requestUpdate } from './methods/update'

type TaxinvoiceRuntimeCallbackMethods = Pick<TaxinvoiceCallbackService, TaxinvoiceRuntimeMethods>
type TaxinvoiceRuntimePromiseMethods = Pick<TaxinvoicePromiseService, TaxinvoiceRuntimeMethods>

interface ParsedMemoCallbacks<T> {
  memo: string
  userId: string
  success?: (response: T) => void
  error?: (error: unknown) => void
}

export function createTaxinvoiceRuntimeMethods(config: CompatConfig): {
  callback: TaxinvoiceRuntimeCallbackMethods
  promise: TaxinvoiceRuntimePromiseMethods
} {
  const context = createTaxinvoiceRuntimeContext(config)

  return {
    callback: {
      // 발행/전송
      registIssue(corpNum: string, taxinvoice: TaxInvoiceApiModel, ...args: unknown[]) {
        const parsed = parseRegistIssueCallbackArgs(args)

        void requestRegistIssue(context, corpNum, taxinvoice, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'registIssue', error, parsed.error)
          })
      },

      bulkSubmit(corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], ...args: unknown[]) {
        const parsed = parseBulkSubmitCallbackArgs(args)

        void requestBulkSubmit(context, corpNum, submitID, taxinvoiceList, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'bulkSubmit', error, parsed.error)
          })
      },

      getBulkResult(corpNum: string, submitID: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetBulkResult(context, corpNum, submitID, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getBulkResult', error, parsed.error)
          })
      },

      register(corpNum: string, taxinvoice: TaxInvoiceApiModel, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestRegister(context, corpNum, taxinvoice, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'register', error, parsed.error)
          })
      },

      update(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, taxinvoice: TaxInvoiceApiModel, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestUpdate(context, corpNum, keyType, mgtKey, taxinvoice, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'update', error, parsed.error)
          })
      },

      issue(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseIssueCallbackArgs(args)

        void requestIssue(context, corpNum, keyType, mgtKey, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'issue', error, parsed.error)
          })
      },

      cancelIssue(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestCancelIssue(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'cancelIssue', error, parsed.error)
          })
      },

      registRequest(corpNum: string, taxinvoice: TaxInvoiceApiModel, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestRegistRequest(context, corpNum, taxinvoice, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'registRequest', error, parsed.error)
          })
      },

      request(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestRequest(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'request', error, parsed.error)
          })
      },

      cancelRequest(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestCancelRequest(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'cancelRequest', error, parsed.error)
          })
      },

      refuse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestRefuse(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'refuse', error, parsed.error)
          })
      },

      delete(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestDelete(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'delete', error, parsed.error)
          })
      },

      sendToNTS(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestSendToNts(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'sendToNTS', error, parsed.error)
          })
      },

      // 정보확인
      getInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetInfo(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getInfo', error, parsed.error)
          })
      },

      getInfos(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetInfos(context, corpNum, keyType, mgtKeyList, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getInfos', error, parsed.error)
          })
      },

      getDetailInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetDetailInfo(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getDetailInfo', error, parsed.error)
          })
      },

      checkMgtKeyInUse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<boolean>(args)

        void requestCheckMgtKeyInUse(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'checkMgtKeyInUse', error, parsed.error)
          })
      },

      getXML(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetXml(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getXML', error, parsed.error)
          })
      },

      search(
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        dType: string,
        startDate: string,
        endDate: string,
        state: string[],
        type: string[],
        taxType: string[],
        lateOnly: boolean | null,
        order: string,
        page: number,
        perPage: number,
        ...args: unknown[]
      ) {
        const parsed = parseSearchCallbackArgs(args)

        void requestSearch(context, corpNum, keyType, {
          dType,
          startDate,
          endDate,
          state,
          type,
          taxType,
          lateOnly,
          order,
          page,
          perPage,
        }, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'search', error, parsed.error)
          })
      },

      getLogs(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetLogs(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getLogs', error, parsed.error)
          })
      },

      getURL(corpNum: string, togo: TaxInvoiceGetUrlTogo, ...args: unknown[]) {
        const parsed = parseGetUrlCallbackArgs(togo, args)

        void requestGetUrl(context, corpNum, parsed.togo, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getURL', error, parsed.error)
          })
      },

      // 보기/인쇄
      getPopUpURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetPopUpUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getPopUpURL', error, parsed.error)
          })
      },

      getViewURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetViewUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getViewURL', error, parsed.error)
          })
      },

      getPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetPrintUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getPrintURL', error, parsed.error)
          })
      },

      getPDFURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetPdfUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getPDFURL', error, parsed.error)
          })
      },

      getMassPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], ...args: unknown[]) {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetMassPrintUrl(context, corpNum, keyType, mgtKeyList, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getMassPrintURL', error, parsed.error)
          })
      },

      getEPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetEPrintUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getEPrintURL', error, parsed.error)
          })
      },

      getMailURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetMailUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getMailURL', error, parsed.error)
          })
      },

      // 부가기능
      getSealURL(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetSealUrl(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getSealURL', error, parsed.error)
          })
      },

      attachFile(
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        displayName: string,
        filePath: string,
        ...args: unknown[]
      ) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestAttachFile(context, corpNum, keyType, mgtKey, displayName, filePath, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'attachFile', error, parsed.error)
          })
      },

      attachFileBinary(
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        binaryFile: TaxInvoiceAttachFileBinaryPayload,
        ...args: unknown[]
      ) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestAttachFileBinary(context, corpNum, keyType, mgtKey, binaryFile, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'attachFileBinary', error, parsed.error)
          })
      },

      deleteFile(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, fileID: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestDeleteFile(context, corpNum, keyType, mgtKey, fileID, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'deleteFile', error, parsed.error)
          })
      },

      getFiles(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetFiles(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getFiles', error, parsed.error)
          })
      },

      sendEmail(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, receiver: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestSendEmail(context, corpNum, keyType, mgtKey, receiver, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'sendEmail', error, parsed.error)
          })
      },

      sendSMS(
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        sender: string,
        receiver: string,
        contents: string,
        ...args: unknown[]
      ) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestSendSms(context, corpNum, keyType, mgtKey, sender, receiver, contents, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'sendSMS', error, parsed.error)
          })
      },

      sendFAX(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestSendFax(context, corpNum, keyType, mgtKey, sender, receiver, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'sendFAX', error, parsed.error)
          })
      },

      attachStatement(
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        subItemCode: number,
        subMgtKey: string,
        ...args: unknown[]
      ) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestAttachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'attachStatement', error, parsed.error)
          })
      },

      detachStatement(
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        subItemCode: number,
        subMgtKey: string,
        ...args: unknown[]
      ) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestDetachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'detachStatement', error, parsed.error)
          })
      },

      assignMgtKey(
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        itemKey: string,
        mgtKey: string,
        ...args: unknown[]
      ) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestAssignMgtKey(context, corpNum, keyType, itemKey, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'assignMgtKey', error, parsed.error)
          })
      },

      listEmailConfig(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestListEmailConfig(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'listEmailConfig', error, parsed.error)
          })
      },

      updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestUpdateEmailConfig(context, corpNum, emailType, sendYN, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'updateEmailConfig', error, parsed.error)
          })
      },

      getSendToNTSConfig(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetSendToNtsConfig(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getSendToNTSConfig', error, parsed.error)
          })
      },

      // 인증서 관리
      getTaxCertURL(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetTaxCertUrl(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getTaxCertURL', error, parsed.error)
          })
      },

      getCertificateExpireDate(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<string>(args)

        void requestGetCertificateExpireDate(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getCertificateExpireDate', error, parsed.error)
          })
      },

      checkCertValidation(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestCheckCertValidation(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'checkCertValidation', error, parsed.error)
          })
      },

      getTaxCertInfo(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetTaxCertInfo(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getTaxCertInfo', error, parsed.error)
          })
      },
    } as TaxinvoiceRuntimeCallbackMethods,

    promise: {
      // 발행/전송
      async registIssue(corpNum: string, taxinvoice: TaxInvoiceApiModel, ...args: unknown[]) {
        const parsed = parseRegistIssuePromiseArgs(args)

        try {
          return await requestRegistIssue(context, corpNum, taxinvoice, parsed)
        }
        catch (error) {
          return throwPromiseError(context, 'registIssue', error)
        }
      },

      async bulkSubmit(corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], ...args: unknown[]) {
        const parsed = parseBulkSubmitPromiseArgs(args)

        try {
          return await requestBulkSubmit(context, corpNum, submitID, taxinvoiceList, parsed)
        }
        catch (error) {
          return throwPromiseError(context, 'bulkSubmit', error)
        }
      },

      async getBulkResult(corpNum: string, submitID: string, userId?: string) {
        try {
          return await requestGetBulkResult(context, corpNum, submitID, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getBulkResult', error)
        }
      },

      async register(corpNum: string, taxinvoice: TaxInvoiceApiModel, userId?: string) {
        try {
          return await requestRegister(context, corpNum, taxinvoice, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'register', error)
        }
      },

      async update(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, taxinvoice: TaxInvoiceApiModel, userId?: string) {
        try {
          return await requestUpdate(context, corpNum, keyType, mgtKey, taxinvoice, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'update', error)
        }
      },

      async issue(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseIssuePromiseArgs(args)

        try {
          return await requestIssue(context, corpNum, keyType, mgtKey, parsed)
        }
        catch (error) {
          return throwPromiseError(context, 'issue', error)
        }
      },

      async cancelIssue(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) {
        try {
          return await requestCancelIssue(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'cancelIssue', error)
        }
      },

      async registRequest(corpNum: string, taxinvoice: TaxInvoiceApiModel, memo?: string, userId?: string) {
        try {
          return await requestRegistRequest(context, corpNum, taxinvoice, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'registRequest', error)
        }
      },

      async request(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) {
        try {
          return await requestRequest(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'request', error)
        }
      },

      async cancelRequest(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) {
        try {
          return await requestCancelRequest(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'cancelRequest', error)
        }
      },

      async refuse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) {
        try {
          return await requestRefuse(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'refuse', error)
        }
      },

      async delete(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestDelete(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'delete', error)
        }
      },

      async sendToNTS(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestSendToNts(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'sendToNTS', error)
        }
      },

      // 정보확인
      async getInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetInfo(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getInfo', error)
        }
      },

      async getInfos(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string) {
        try {
          return await requestGetInfos(context, corpNum, keyType, mgtKeyList, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getInfos', error)
        }
      },

      async getDetailInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetDetailInfo(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getDetailInfo', error)
        }
      },

      async checkMgtKeyInUse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestCheckMgtKeyInUse(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'checkMgtKeyInUse', error)
        }
      },

      async getXML(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetXml(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getXML', error)
        }
      },

      async search(
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        dType: string,
        startDate: string,
        endDate: string,
        state: string[],
        type: string[],
        taxType: string[],
        lateOnly: boolean | null,
        order: string,
        page: number,
        perPage: number,
        ...args: unknown[]
      ) {
        const parsed = parseSearchPromiseArgs(args)

        try {
          return await requestSearch(context, corpNum, keyType, {
            dType,
            startDate,
            endDate,
            state,
            type,
            taxType,
            lateOnly,
            order,
            page,
            perPage,
          }, parsed)
        }
        catch (error) {
          return throwPromiseError(context, 'search', error)
        }
      },

      async getLogs(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetLogs(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getLogs', error)
        }
      },

      async getURL(corpNum: string, togo: TaxInvoiceGetUrlTogo, userId?: string) {
        try {
          return await requestGetUrl(context, corpNum, togo, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getURL', error)
        }
      },

      // 보기/인쇄
      async getPopUpURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetPopUpUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getPopUpURL', error)
        }
      },

      async getViewURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetViewUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getViewURL', error)
        }
      },

      async getPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetPrintUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getPrintURL', error)
        }
      },

      async getPDFURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetPdfUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getPDFURL', error)
        }
      },

      async getMassPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string) {
        try {
          return await requestGetMassPrintUrl(context, corpNum, keyType, mgtKeyList, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getMassPrintURL', error)
        }
      },

      async getEPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetEPrintUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getEPrintURL', error)
        }
      },

      async getMailURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetMailUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getMailURL', error)
        }
      },

      // 부가기능
      async getSealURL(corpNum: string, userId?: string) {
        try {
          return await requestGetSealUrl(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getSealURL', error)
        }
      },

      async attachFile(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, displayName: string, filePath: string, userId?: string) {
        try {
          return await requestAttachFile(context, corpNum, keyType, mgtKey, displayName, filePath, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'attachFile', error)
        }
      },

      async attachFileBinary(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, binaryFile: TaxInvoiceAttachFileBinaryPayload, userId?: string) {
        try {
          return await requestAttachFileBinary(context, corpNum, keyType, mgtKey, binaryFile, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'attachFileBinary', error)
        }
      },

      async deleteFile(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, fileID: string, userId?: string) {
        try {
          return await requestDeleteFile(context, corpNum, keyType, mgtKey, fileID, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'deleteFile', error)
        }
      },

      async getFiles(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await requestGetFiles(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getFiles', error)
        }
      },

      async sendEmail(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, receiver: string, userId?: string) {
        try {
          return await requestSendEmail(context, corpNum, keyType, mgtKey, receiver, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'sendEmail', error)
        }
      },

      async sendSMS(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, contents: string, userId?: string) {
        try {
          return await requestSendSms(context, corpNum, keyType, mgtKey, sender, receiver, contents, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'sendSMS', error)
        }
      },

      async sendFAX(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, userId?: string) {
        try {
          return await requestSendFax(context, corpNum, keyType, mgtKey, sender, receiver, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'sendFAX', error)
        }
      },

      async attachStatement(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, userId?: string) {
        try {
          return await requestAttachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'attachStatement', error)
        }
      },

      async detachStatement(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, userId?: string) {
        try {
          return await requestDetachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'detachStatement', error)
        }
      },

      async assignMgtKey(corpNum: string, keyType: TaxInvoiceMgtKeyType, itemKey: string, mgtKey: string, userId?: string) {
        try {
          return await requestAssignMgtKey(context, corpNum, keyType, itemKey, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'assignMgtKey', error)
        }
      },

      async listEmailConfig(corpNum: string, userId?: string) {
        try {
          return await requestListEmailConfig(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'listEmailConfig', error)
        }
      },

      async updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, userId?: string) {
        try {
          return await requestUpdateEmailConfig(context, corpNum, emailType, sendYN, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'updateEmailConfig', error)
        }
      },

      async getSendToNTSConfig(corpNum: string, userId?: string) {
        try {
          return await requestGetSendToNtsConfig(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getSendToNTSConfig', error)
        }
      },

      // 인증서 관리
      async getTaxCertURL(corpNum: string, userId?: string) {
        try {
          return await requestGetTaxCertUrl(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getTaxCertURL', error)
        }
      },

      async getCertificateExpireDate(corpNum: string, userId?: string) {
        try {
          return await requestGetCertificateExpireDate(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getCertificateExpireDate', error)
        }
      },

      async checkCertValidation(corpNum: string, userId?: string) {
        try {
          return await requestCheckCertValidation(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'checkCertValidation', error)
        }
      },

      async getTaxCertInfo(corpNum: string, userId?: string) {
        try {
          return await requestGetTaxCertInfo(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getTaxCertInfo', error)
        }
      },
    } as TaxinvoiceRuntimePromiseMethods,
  }
}

function parseMemoCallbackArgs<T>(maybeMemoOrSuccess: unknown, args: unknown[]): ParsedMemoCallbacks<T> {
  const memo = typeof maybeMemoOrSuccess === 'string' ? maybeMemoOrSuccess : ''
  const callbackArgs = typeof maybeMemoOrSuccess === 'function'
    ? [maybeMemoOrSuccess, ...args]
    : args
  const parsed = parseLegacyUserIdAndCallbacks<T>(callbackArgs)

  return {
    memo,
    userId: parsed.userId,
    success: parsed.success,
    error: parsed.error,
  }
}
