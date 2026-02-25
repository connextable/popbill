import type {
  TaxInvoiceApiModel,
  TaxInvoiceApiResponseBase,
  TaxInvoiceAttachFileBinaryPayload,
  TaxInvoiceGetUrlTogo,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import type { CompatConfig } from '../../../config'
import type {
  TaxinvoiceCallbackService,
  TaxinvoicePromiseService,
} from '../types'
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
      registIssue: ((corpNum: string, taxinvoice: TaxInvoiceApiModel, ...args: unknown[]) => {
        const parsed = parseRegistIssueCallbackArgs(args)

        void requestRegistIssue(context, corpNum, taxinvoice, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'registIssue', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['registIssue'],

      bulkSubmit: ((corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], ...args: unknown[]) => {
        const parsed = parseBulkSubmitCallbackArgs(args)

        void requestBulkSubmit(context, corpNum, submitID, taxinvoiceList, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'bulkSubmit', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['bulkSubmit'],

      getBulkResult: ((corpNum: string, submitID: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetBulkResult(context, corpNum, submitID, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getBulkResult', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getBulkResult'],

      register: ((corpNum: string, taxinvoice: TaxInvoiceApiModel, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestRegister(context, corpNum, taxinvoice, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'register', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['register'],

      update: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, taxinvoice: TaxInvoiceApiModel, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestUpdate(context, corpNum, keyType, mgtKey, taxinvoice, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'update', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['update'],

      issue: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseIssueCallbackArgs(args)

        void requestIssue(context, corpNum, keyType, mgtKey, parsed)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'issue', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['issue'],

      cancelIssue: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) => {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestCancelIssue(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'cancelIssue', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['cancelIssue'],

      registRequest: ((corpNum: string, taxinvoice: TaxInvoiceApiModel, maybeMemoOrSuccess?: unknown, ...args: unknown[]) => {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestRegistRequest(context, corpNum, taxinvoice, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'registRequest', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['registRequest'],

      request: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) => {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestRequest(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'request', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['request'],

      cancelRequest: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) => {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestCancelRequest(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'cancelRequest', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['cancelRequest'],

      refuse: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemoOrSuccess?: unknown, ...args: unknown[]) => {
        const parsed = parseMemoCallbackArgs<TaxInvoiceApiResponseBase>(maybeMemoOrSuccess, args)

        void requestRefuse(context, corpNum, keyType, mgtKey, parsed.memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'refuse', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['refuse'],

      delete: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestDelete(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'delete', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['delete'],

      sendToNTS: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestSendToNts(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'sendToNTS', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['sendToNTS'],

      // 정보확인
      getInfo: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetInfo(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getInfo', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getInfo'],

      getInfos: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetInfos(context, corpNum, keyType, mgtKeyList, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getInfos', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getInfos'],

      getDetailInfo: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetDetailInfo(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getDetailInfo', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getDetailInfo'],

      checkMgtKeyInUse: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<boolean>(args)

        void requestCheckMgtKeyInUse(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'checkMgtKeyInUse', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['checkMgtKeyInUse'],

      getXML: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetXml(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getXML', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getXML'],

      search: ((
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
      ) => {
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
          .catch((error) => {
            handleCallbackError(context, 'search', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['search'],

      getLogs: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetLogs(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getLogs', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getLogs'],

      getURL: ((corpNum: string, togo: TaxInvoiceGetUrlTogo, ...args: unknown[]) => {
        const parsed = parseGetUrlCallbackArgs(togo, args)

        void requestGetUrl(context, corpNum, parsed.togo, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error) => {
            handleCallbackError(context, 'getURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getURL'],

      // 보기/인쇄
      getPopUpURL: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetPopUpUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error) => {
            handleCallbackError(context, 'getPopUpURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getPopUpURL'],

      getViewURL: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetViewUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error) => {
            handleCallbackError(context, 'getViewURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getViewURL'],

      getPrintURL: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetPrintUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error) => {
            handleCallbackError(context, 'getPrintURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getPrintURL'],

      getPDFURL: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetPdfUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error) => {
            handleCallbackError(context, 'getPDFURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getPDFURL'],

      getMassPrintURL: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], ...args: unknown[]) => {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetMassPrintUrl(context, corpNum, keyType, mgtKeyList, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error) => {
            handleCallbackError(context, 'getMassPrintURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getMassPrintURL'],

      getEPrintURL: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetEPrintUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error) => {
            handleCallbackError(context, 'getEPrintURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getEPrintURL'],

      getMailURL: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseUrlMethodCallbackArgs(args)

        void requestGetMailUrl(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((url) => {
            parsed.success?.(url)
          })
          .catch((error) => {
            handleCallbackError(context, 'getMailURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getMailURL'],

      // 부가기능
      getSealURL: ((corpNum: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetSealUrl(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getSealURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getSealURL'],

      attachFile: ((
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        displayName: string,
        filePath: string,
        ...args: unknown[]
      ) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestAttachFile(context, corpNum, keyType, mgtKey, displayName, filePath, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'attachFile', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['attachFile'],

      attachFileBinary: ((
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        binaryFile: TaxInvoiceAttachFileBinaryPayload,
        ...args: unknown[]
      ) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestAttachFileBinary(context, corpNum, keyType, mgtKey, binaryFile, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'attachFileBinary', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['attachFileBinary'],

      deleteFile: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, fileID: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestDeleteFile(context, corpNum, keyType, mgtKey, fileID, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'deleteFile', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['deleteFile'],

      getFiles: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetFiles(context, corpNum, keyType, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getFiles', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getFiles'],

      sendEmail: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, receiver: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestSendEmail(context, corpNum, keyType, mgtKey, receiver, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'sendEmail', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['sendEmail'],

      sendSMS: ((
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        sender: string,
        receiver: string,
        contents: string,
        ...args: unknown[]
      ) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestSendSms(context, corpNum, keyType, mgtKey, sender, receiver, contents, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'sendSMS', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['sendSMS'],

      sendFAX: ((corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestSendFax(context, corpNum, keyType, mgtKey, sender, receiver, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'sendFAX', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['sendFAX'],

      attachStatement: ((
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        subItemCode: number,
        subMgtKey: string,
        ...args: unknown[]
      ) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestAttachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'attachStatement', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['attachStatement'],

      detachStatement: ((
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        mgtKey: string,
        subItemCode: number,
        subMgtKey: string,
        ...args: unknown[]
      ) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestDetachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'detachStatement', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['detachStatement'],

      assignMgtKey: ((
        corpNum: string,
        keyType: TaxInvoiceMgtKeyType,
        itemKey: string,
        mgtKey: string,
        ...args: unknown[]
      ) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestAssignMgtKey(context, corpNum, keyType, itemKey, mgtKey, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'assignMgtKey', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['assignMgtKey'],

      listEmailConfig: ((corpNum: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestListEmailConfig(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'listEmailConfig', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['listEmailConfig'],

      updateEmailConfig: ((corpNum: string, emailType: string, sendYN: boolean, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestUpdateEmailConfig(context, corpNum, emailType, sendYN, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'updateEmailConfig', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['updateEmailConfig'],

      getSendToNTSConfig: ((corpNum: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetSendToNtsConfig(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getSendToNTSConfig', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getSendToNTSConfig'],

      // 인증서 관리
      getTaxCertURL: ((corpNum: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetTaxCertUrl(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getTaxCertURL', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getTaxCertURL'],

      getCertificateExpireDate: ((corpNum: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<string>(args)

        void requestGetCertificateExpireDate(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getCertificateExpireDate', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getCertificateExpireDate'],

      checkCertValidation: ((corpNum: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(args)

        void requestCheckCertValidation(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'checkCertValidation', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['checkCertValidation'],

      getTaxCertInfo: ((corpNum: string, ...args: unknown[]) => {
        const parsed = parseLegacyUserIdAndCallbacks(args)

        void requestGetTaxCertInfo(context, corpNum, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'getTaxCertInfo', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['getTaxCertInfo'],
    },

    promise: {
      // 발행/전송
      registIssue: (async (corpNum: string, taxinvoice: TaxInvoiceApiModel, ...args: unknown[]) => {
        const parsed = parseRegistIssuePromiseArgs(args)

        try {
          return await requestRegistIssue(context, corpNum, taxinvoice, parsed)
        }
        catch (error) {
          return throwPromiseError(context, 'registIssue', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['registIssue'],

      bulkSubmit: (async (corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], ...args: unknown[]) => {
        const parsed = parseBulkSubmitPromiseArgs(args)

        try {
          return await requestBulkSubmit(context, corpNum, submitID, taxinvoiceList, parsed)
        }
        catch (error) {
          return throwPromiseError(context, 'bulkSubmit', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['bulkSubmit'],

      getBulkResult: (async (corpNum: string, submitID: string, userId?: string) => {
        try {
          return await requestGetBulkResult(context, corpNum, submitID, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getBulkResult', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getBulkResult'],

      register: (async (corpNum: string, taxinvoice: TaxInvoiceApiModel, userId?: string) => {
        try {
          return await requestRegister(context, corpNum, taxinvoice, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'register', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['register'],

      update: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, taxinvoice: TaxInvoiceApiModel, userId?: string) => {
        try {
          return await requestUpdate(context, corpNum, keyType, mgtKey, taxinvoice, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'update', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['update'],

      issue: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseIssuePromiseArgs(args)

        try {
          return await requestIssue(context, corpNum, keyType, mgtKey, parsed)
        }
        catch (error) {
          return throwPromiseError(context, 'issue', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['issue'],

      cancelIssue: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) => {
        try {
          return await requestCancelIssue(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'cancelIssue', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['cancelIssue'],

      registRequest: (async (corpNum: string, taxinvoice: TaxInvoiceApiModel, memo?: string, userId?: string) => {
        try {
          return await requestRegistRequest(context, corpNum, taxinvoice, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'registRequest', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['registRequest'],

      request: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) => {
        try {
          return await requestRequest(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'request', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['request'],

      cancelRequest: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) => {
        try {
          return await requestCancelRequest(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'cancelRequest', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['cancelRequest'],

      refuse: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo?: string, userId?: string) => {
        try {
          return await requestRefuse(context, corpNum, keyType, mgtKey, memo ?? '', userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'refuse', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['refuse'],

      delete: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestDelete(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'delete', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['delete'],

      sendToNTS: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestSendToNts(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'sendToNTS', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['sendToNTS'],

      // 정보확인
      getInfo: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetInfo(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getInfo', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getInfo'],

      getInfos: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string) => {
        try {
          return await requestGetInfos(context, corpNum, keyType, mgtKeyList, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getInfos', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getInfos'],

      getDetailInfo: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetDetailInfo(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getDetailInfo', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getDetailInfo'],

      checkMgtKeyInUse: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestCheckMgtKeyInUse(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'checkMgtKeyInUse', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['checkMgtKeyInUse'],

      getXML: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetXml(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getXML', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getXML'],

      search: (async (
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
      ) => {
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
      }) as TaxinvoiceRuntimePromiseMethods['search'],

      getLogs: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetLogs(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getLogs', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getLogs'],

      getURL: (async (corpNum: string, togo: TaxInvoiceGetUrlTogo, userId?: string) => {
        try {
          return await requestGetUrl(context, corpNum, togo, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getURL'],

      // 보기/인쇄
      getPopUpURL: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetPopUpUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getPopUpURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getPopUpURL'],

      getViewURL: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetViewUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getViewURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getViewURL'],

      getPrintURL: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetPrintUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getPrintURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getPrintURL'],

      getPDFURL: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetPdfUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getPDFURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getPDFURL'],

      getMassPrintURL: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string) => {
        try {
          return await requestGetMassPrintUrl(context, corpNum, keyType, mgtKeyList, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getMassPrintURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getMassPrintURL'],

      getEPrintURL: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetEPrintUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getEPrintURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getEPrintURL'],

      getMailURL: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetMailUrl(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getMailURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getMailURL'],

      // 부가기능
      getSealURL: (async (corpNum: string, userId?: string) => {
        try {
          return await requestGetSealUrl(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getSealURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getSealURL'],

      attachFile: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, displayName: string, filePath: string, userId?: string) => {
        try {
          return await requestAttachFile(context, corpNum, keyType, mgtKey, displayName, filePath, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'attachFile', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['attachFile'],

      attachFileBinary: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, binaryFile: TaxInvoiceAttachFileBinaryPayload, userId?: string) => {
        try {
          return await requestAttachFileBinary(context, corpNum, keyType, mgtKey, binaryFile, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'attachFileBinary', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['attachFileBinary'],

      deleteFile: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, fileID: string, userId?: string) => {
        try {
          return await requestDeleteFile(context, corpNum, keyType, mgtKey, fileID, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'deleteFile', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['deleteFile'],

      getFiles: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string) => {
        try {
          return await requestGetFiles(context, corpNum, keyType, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getFiles', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getFiles'],

      sendEmail: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, receiver: string, userId?: string) => {
        try {
          return await requestSendEmail(context, corpNum, keyType, mgtKey, receiver, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'sendEmail', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['sendEmail'],

      sendSMS: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, contents: string, userId?: string) => {
        try {
          return await requestSendSms(context, corpNum, keyType, mgtKey, sender, receiver, contents, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'sendSMS', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['sendSMS'],

      sendFAX: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, userId?: string) => {
        try {
          return await requestSendFax(context, corpNum, keyType, mgtKey, sender, receiver, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'sendFAX', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['sendFAX'],

      attachStatement: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, userId?: string) => {
        try {
          return await requestAttachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'attachStatement', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['attachStatement'],

      detachStatement: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, userId?: string) => {
        try {
          return await requestDetachStatement(context, corpNum, keyType, mgtKey, subItemCode, subMgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'detachStatement', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['detachStatement'],

      assignMgtKey: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, itemKey: string, mgtKey: string, userId?: string) => {
        try {
          return await requestAssignMgtKey(context, corpNum, keyType, itemKey, mgtKey, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'assignMgtKey', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['assignMgtKey'],

      listEmailConfig: (async (corpNum: string, userId?: string) => {
        try {
          return await requestListEmailConfig(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'listEmailConfig', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['listEmailConfig'],

      updateEmailConfig: (async (corpNum: string, emailType: string, sendYN: boolean, userId?: string) => {
        try {
          return await requestUpdateEmailConfig(context, corpNum, emailType, sendYN, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'updateEmailConfig', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['updateEmailConfig'],

      getSendToNTSConfig: (async (corpNum: string, userId?: string) => {
        try {
          return await requestGetSendToNtsConfig(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getSendToNTSConfig', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getSendToNTSConfig'],

      // 인증서 관리
      getTaxCertURL: (async (corpNum: string, userId?: string) => {
        try {
          return await requestGetTaxCertUrl(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getTaxCertURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getTaxCertURL'],

      getCertificateExpireDate: (async (corpNum: string, userId?: string) => {
        try {
          return await requestGetCertificateExpireDate(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getCertificateExpireDate', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getCertificateExpireDate'],

      checkCertValidation: (async (corpNum: string, userId?: string) => {
        try {
          return await requestCheckCertValidation(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'checkCertValidation', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['checkCertValidation'],

      getTaxCertInfo: (async (corpNum: string, userId?: string) => {
        try {
          return await requestGetTaxCertInfo(context, corpNum, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getTaxCertInfo', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getTaxCertInfo'],
    },
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
