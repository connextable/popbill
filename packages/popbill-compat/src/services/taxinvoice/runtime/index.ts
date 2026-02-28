
import type { CompatConfig } from '@/config'
import type { TaxinvoiceCallbackService, TaxinvoicePromiseService } from '@/services/taxinvoice/types'
import { handleCallbackError, parseLegacyUserIdAndCallbacks, throwPromiseError, type TaxinvoiceRuntimeMethods } from './common'
import { createTaxinvoiceRuntimeContext } from './context'
import * as parsers from './parsers'
import * as methods from './methods'
import type * as Spec from '@connextable/popbill-spec'

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
      registIssue(corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, ...args: unknown[]) {
        const parsed = parsers.parseRegistIssueCallbackArgs(args)

        void methods.requestRegistIssue(context, corpNum, taxinvoice, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'registIssue', error, parsed.error)
          })
      },

      bulkSubmit(corpNum: string, submitID: string, taxinvoiceList: Spec.TaxInvoiceApiModel[], ...args: unknown[]) {
        const parsed = parsers.parseBulkSubmitCallbackArgs(args)

        void methods.requestBulkSubmit(context, corpNum, submitID, taxinvoiceList, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'bulkSubmit', error, parsed.error)
          })
      },

      getBulkResult(corpNum: string, submitID: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetBulkResult(context, corpNum, submitID, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getBulkResult', error, parsed.error)
          })
      },

      register(corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestRegister(context, corpNum, taxinvoice, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'register', error, parsed.error)
          })
      },

      update(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, taxinvoice: Spec.TaxInvoiceApiModel, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestUpdate(context, corpNum, keyType, mgtKey, taxinvoice, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'update', error, parsed.error)
          })
      },

      issue(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parsers.parseIssueCallbackArgs(args)

        void methods.requestIssue(context, corpNum, keyType, mgtKey, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'issue', error, parsed.error)
          })
      },

      cancelIssue(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<Spec.TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void methods.requestCancelIssue(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'cancelIssue', error, parsed.error)
          })
      },

      registRequest(corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<Spec.TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void methods.requestRegistRequest(context, corpNum, taxinvoice, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'registRequest', error, parsed.error)
          })
      },

      request(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<Spec.TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void methods.requestRequest(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'request', error, parsed.error)
          })
      },

      cancelRequest(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<Spec.TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void methods.requestCancelRequest(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'cancelRequest', error, parsed.error)
          })
      },

      refuse(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) {
        const parsed = parseMemoCallbackArgs<Spec.TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void methods.requestRefuse(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'refuse', error, parsed.error)
          })
      },

      delete(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestDelete(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'delete', error, parsed.error)
          })
      },

      sendToNTS(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestSendToNts(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'sendToNTS', error, parsed.error)
          })
      },

      // 정보확인
      getInfo(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetInfo(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getInfo', error, parsed.error)
          })
      },

      getInfos(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKeyList: string[], ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetInfos(context, corpNum, keyType, mgtKeyList, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getInfos', error, parsed.error)
          })
      },

      getDetailInfo(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetDetailInfo(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getDetailInfo', error, parsed.error)
          })
      },

      checkMgtKeyInUse(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<boolean>(args)

        void methods.requestCheckMgtKeyInUse(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'checkMgtKeyInUse', error, parsed.error)
          })
      },

      getXML(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetXml(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getXML', error, parsed.error)
          })
      },

      search(
        corpNum: string,
        keyType: Spec.TaxInvoiceMgtKeyType,
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
        const parsed = parsers.parseSearchCallbackArgs(args)

        void methods.requestSearch(
          context,
          corpNum,
          keyType,
          {
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
          },
          parsed
        )
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'search', error, parsed.error)
          })
      },

      getLogs(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetLogs(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getLogs', error, parsed.error)
          })
      },

      getURL(corpNum: string, togo: Spec.TaxInvoiceGetUrlTogo, ...args: unknown[]) {
        const parsed = parsers.parseGetUrlCallbackArgs(togo, args)

        void methods.requestGetUrl(context, corpNum, parsed.togo, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getURL', error, parsed.error)
          })
      },

      // 보기/인쇄
      getPopUpURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parsers.parseUrlMethodCallbackArgs(args)

        void methods.requestGetPopUpUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getPopUpURL', error, parsed.error)
          })
      },

      getViewURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parsers.parseUrlMethodCallbackArgs(args)

        void methods.requestGetViewUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getViewURL', error, parsed.error)
          })
      },

      getPrintURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parsers.parseUrlMethodCallbackArgs(args)

        void methods.requestGetPrintUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getPrintURL', error, parsed.error)
          })
      },

      getPDFURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parsers.parseUrlMethodCallbackArgs(args)

        void methods.requestGetPdfUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getPDFURL', error, parsed.error)
          })
      },

      getMassPrintURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKeyList: string[], ...args: unknown[]) {
        const parsed = parsers.parseUrlMethodCallbackArgs(args)

        void methods.requestGetMassPrintUrl(context, corpNum, keyType, mgtKeyList, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getMassPrintURL', error, parsed.error)
          })
      },

      getEPrintURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parsers.parseUrlMethodCallbackArgs(args)

        void methods.requestGetEPrintUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getEPrintURL', error, parsed.error)
          })
      },

      getMailURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parsers.parseUrlMethodCallbackArgs(args)

        void methods.requestGetMailUrl(context, corpNum, keyType, mgtKey, parsed.userId)
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

        void methods.requestGetSealUrl(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getSealURL', error, parsed.error)
          })
      },

      attachFile(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, displayName: string, filePath: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestAttachFile(context, corpNum, keyType, mgtKey, displayName, filePath, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'attachFile', error, parsed.error)
          })
      },

      attachFileBinary(
        corpNum: string,
        keyType: Spec.TaxInvoiceMgtKeyType,
        mgtKey: string,
        binaryFile: Spec.TaxInvoiceAttachFileBinaryPayload,
        ...args: unknown[]
      ) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestAttachFileBinary(context, corpNum, keyType, mgtKey, binaryFile, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'attachFileBinary', error, parsed.error)
          })
      },

      deleteFile(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, fileID: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestDeleteFile(context, corpNum, keyType, mgtKey, fileID, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'deleteFile', error, parsed.error)
          })
      },

      getFiles(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetFiles(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getFiles', error, parsed.error)
          })
      },

      sendEmail(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, receiver: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestSendEmail(context, corpNum, keyType, mgtKey, receiver, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'sendEmail', error, parsed.error)
          })
      },

      sendSMS(
        corpNum: string,
        keyType: Spec.TaxInvoiceMgtKeyType,
        mgtKey: string,
        sender: string,
        receiver: string,
        contents: string,
        ...args: unknown[]
      ) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestSendSms(context, corpNum, keyType, mgtKey, sender, receiver, contents, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'sendSMS', error, parsed.error)
          })
      },

      sendFAX(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestSendFax(context, corpNum, keyType, mgtKey, sender, receiver, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'sendFAX', error, parsed.error)
          })
      },

      attachStatement(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestAttachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'attachStatement', error, parsed.error)
          })
      },

      detachStatement(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestDetachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'detachStatement', error, parsed.error)
          })
      },

      assignMgtKey(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, itemKey: string, mgtKey: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestAssignMgtKey(context, corpNum, keyType, itemKey, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'assignMgtKey', error, parsed.error)
          })
      },

      listEmailConfig(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestListEmailConfig(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'listEmailConfig', error, parsed.error)
          })
      },

      updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestUpdateEmailConfig(context, corpNum, emailType, sendYN, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'updateEmailConfig', error, parsed.error)
          })
      },

      getSendToNTSConfig(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetSendToNtsConfig(context, corpNum, parsed.userId)
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

        void methods.requestGetTaxCertUrl(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getTaxCertURL', error, parsed.error)
          })
      },

      getCertificateExpireDate(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<string>(args)

        void methods.requestGetCertificateExpireDate(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'getCertificateExpireDate', error, parsed.error)
          })
      },

      checkCertValidation(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks<Spec.TaxInvoiceApiResponseBase>(args)

        void methods.requestCheckCertValidation(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error: unknown) => {
            handleCallbackError(context, 'checkCertValidation', error, parsed.error)
          })
      },

      getTaxCertInfo(corpNum: string, ...args: unknown[]) {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void methods.requestGetTaxCertInfo(context, corpNum, parsed.userId)
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
      async registIssue(corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, ...args: unknown[]) {
        const parsed = parsers.parseRegistIssuePromiseArgs(args)

        try {
          return await methods.requestRegistIssue(context, corpNum, taxinvoice, parsed)
        } catch (error) {
          return throwPromiseError(context, 'registIssue', error)
        }
      },

      async bulkSubmit(corpNum: string, submitID: string, taxinvoiceList: Spec.TaxInvoiceApiModel[], ...args: unknown[]) {
        const parsed = parsers.parseBulkSubmitPromiseArgs(args)

        try {
          return await methods.requestBulkSubmit(context, corpNum, submitID, taxinvoiceList, parsed)
        } catch (error) {
          return throwPromiseError(context, 'bulkSubmit', error)
        }
      },

      async getBulkResult(corpNum: string, submitID: string, userId?: string) {
        try {
          return await methods.requestGetBulkResult(context, corpNum, submitID, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getBulkResult', error)
        }
      },

      async register(corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, userId?: string) {
        try {
          return await methods.requestRegister(context, corpNum, taxinvoice, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'register', error)
        }
      },

      async update(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, taxinvoice: Spec.TaxInvoiceApiModel, userId?: string) {
        try {
          return await methods.requestUpdate(context, corpNum, keyType, mgtKey, taxinvoice, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'update', error)
        }
      },

      async issue(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) {
        const parsed = parsers.parseIssuePromiseArgs(args)

        try {
          return await methods.requestIssue(context, corpNum, keyType, mgtKey, parsed)
        } catch (error) {
          return throwPromiseError(context, 'issue', error)
        }
      },

      async cancelIssue(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) {
        try {
          return await methods.requestCancelIssue(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'cancelIssue', error)
        }
      },

      async registRequest(corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, memo?: string, userId?: string) {
        try {
          return await methods.requestRegistRequest(context, corpNum, taxinvoice, memo ?? '', userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'registRequest', error)
        }
      },

      async request(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) {
        try {
          return await methods.requestRequest(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'request', error)
        }
      },

      async cancelRequest(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) {
        try {
          return await methods.requestCancelRequest(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'cancelRequest', error)
        }
      },

      async refuse(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) {
        try {
          return await methods.requestRefuse(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'refuse', error)
        }
      },

      async delete(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestDelete(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'delete', error)
        }
      },

      async sendToNTS(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestSendToNts(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'sendToNTS', error)
        }
      },

      // 정보확인
      async getInfo(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetInfo(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getInfo', error)
        }
      },

      async getInfos(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string) {
        try {
          return await methods.requestGetInfos(context, corpNum, keyType, mgtKeyList, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getInfos', error)
        }
      },

      async getDetailInfo(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetDetailInfo(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getDetailInfo', error)
        }
      },

      async checkMgtKeyInUse(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestCheckMgtKeyInUse(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'checkMgtKeyInUse', error)
        }
      },

      async getXML(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetXml(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getXML', error)
        }
      },

      async search(
        corpNum: string,
        keyType: Spec.TaxInvoiceMgtKeyType,
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
        const parsed = parsers.parseSearchPromiseArgs(args)

        try {
          return await methods.requestSearch(
            context,
            corpNum,
            keyType,
            {
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
            },
            parsed
          )
        } catch (error) {
          return throwPromiseError(context, 'search', error)
        }
      },

      async getLogs(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetLogs(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getLogs', error)
        }
      },

      async getURL(corpNum: string, togo: Spec.TaxInvoiceGetUrlTogo, userId?: string) {
        try {
          return await methods.requestGetUrl(context, corpNum, togo, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getURL', error)
        }
      },

      // 보기/인쇄
      async getPopUpURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetPopUpUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getPopUpURL', error)
        }
      },

      async getViewURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetViewUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getViewURL', error)
        }
      },

      async getPrintURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetPrintUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getPrintURL', error)
        }
      },

      async getPDFURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetPdfUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getPDFURL', error)
        }
      },

      async getMassPrintURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string) {
        try {
          return await methods.requestGetMassPrintUrl(context, corpNum, keyType, mgtKeyList, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getMassPrintURL', error)
        }
      },

      async getEPrintURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetEPrintUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getEPrintURL', error)
        }
      },

      async getMailURL(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetMailUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getMailURL', error)
        }
      },

      // 부가기능
      async getSealURL(corpNum: string, userId?: string) {
        try {
          return await methods.requestGetSealUrl(context, corpNum, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getSealURL', error)
        }
      },

      async attachFile(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, displayName: string, filePath: string, userId?: string) {
        try {
          return await methods.requestAttachFile(context, corpNum, keyType, mgtKey, displayName, filePath, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'attachFile', error)
        }
      },

      async attachFileBinary(
        corpNum: string,
        keyType: Spec.TaxInvoiceMgtKeyType,
        mgtKey: string,
        binaryFile: Spec.TaxInvoiceAttachFileBinaryPayload,
        userId?: string
      ) {
        try {
          return await methods.requestAttachFileBinary(context, corpNum, keyType, mgtKey, binaryFile, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'attachFileBinary', error)
        }
      },

      async deleteFile(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, fileID: string, userId?: string) {
        try {
          return await methods.requestDeleteFile(context, corpNum, keyType, mgtKey, fileID, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'deleteFile', error)
        }
      },

      async getFiles(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) {
        try {
          return await methods.requestGetFiles(context, corpNum, keyType, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getFiles', error)
        }
      },

      async sendEmail(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, receiver: string, userId?: string) {
        try {
          return await methods.requestSendEmail(context, corpNum, keyType, mgtKey, receiver, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'sendEmail', error)
        }
      },

      async sendSMS(
        corpNum: string,
        keyType: Spec.TaxInvoiceMgtKeyType,
        mgtKey: string,
        sender: string,
        receiver: string,
        contents: string,
        userId?: string
      ) {
        try {
          return await methods.requestSendSms(context, corpNum, keyType, mgtKey, sender, receiver, contents, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'sendSMS', error)
        }
      },

      async sendFAX(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, userId?: string) {
        try {
          return await methods.requestSendFax(context, corpNum, keyType, mgtKey, sender, receiver, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'sendFAX', error)
        }
      },

      async attachStatement(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, userId?: string) {
        try {
          return await methods.requestAttachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'attachStatement', error)
        }
      },

      async detachStatement(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, userId?: string) {
        try {
          return await methods.requestDetachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'detachStatement', error)
        }
      },

      async assignMgtKey(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, itemKey: string, mgtKey: string, userId?: string) {
        try {
          return await methods.requestAssignMgtKey(context, corpNum, keyType, itemKey, mgtKey, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'assignMgtKey', error)
        }
      },

      async listEmailConfig(corpNum: string, userId?: string) {
        try {
          return await methods.requestListEmailConfig(context, corpNum, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'listEmailConfig', error)
        }
      },

      async updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, userId?: string) {
        try {
          return await methods.requestUpdateEmailConfig(context, corpNum, emailType, sendYN, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'updateEmailConfig', error)
        }
      },

      async getSendToNTSConfig(corpNum: string, userId?: string) {
        try {
          return await methods.requestGetSendToNtsConfig(context, corpNum, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getSendToNTSConfig', error)
        }
      },

      // 인증서 관리
      async getTaxCertURL(corpNum: string, userId?: string) {
        try {
          return await methods.requestGetTaxCertUrl(context, corpNum, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getTaxCertURL', error)
        }
      },

      async getCertificateExpireDate(corpNum: string, userId?: string) {
        try {
          return await methods.requestGetCertificateExpireDate(context, corpNum, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getCertificateExpireDate', error)
        }
      },

      async checkCertValidation(corpNum: string, userId?: string) {
        try {
          return await methods.requestCheckCertValidation(context, corpNum, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'checkCertValidation', error)
        }
      },

      async getTaxCertInfo(corpNum: string, userId?: string) {
        try {
          return await methods.requestGetTaxCertInfo(context, corpNum, userId ?? '')
        } catch (error) {
          return throwPromiseError(context, 'getTaxCertInfo', error)
        }
      },
    } as TaxinvoiceRuntimePromiseMethods,
  }
}

function parseMemoCallbackArgs<T>(maybeMemoOrSuccess: unknown, args: unknown[]): ParsedMemoCallbacks<T> {
  const memo = typeof maybeMemoOrSuccess === 'string' ? maybeMemoOrSuccess : ''
  const callbackArgs = typeof maybeMemoOrSuccess === 'function' ? [maybeMemoOrSuccess, ...args] : args
  const parsed = parseLegacyUserIdAndCallbacks<T>(callbackArgs)

  return {
    memo,
    userId: parsed.userId,
    success: parsed.success,
    error: parsed.error,
  }
}
