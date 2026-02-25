import type {
  TaxInvoiceApiResponseBase,
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
  type TaxinvoiceRuntimeMethodName,
} from './common'
import { createTaxinvoiceRuntimeContext } from './context'
import { requestCancelIssue } from './methods/cancel-issue'
import { requestGetEPrintUrl } from './methods/get-e-print-url'
import { requestGetMailUrl } from './methods/get-mail-url'
import { requestGetMassPrintUrl } from './methods/get-mass-print-url'
import { requestGetPdfUrl } from './methods/get-pdf-url'
import { requestGetPopUpUrl } from './methods/get-pop-up-url'
import { requestGetPrintUrl } from './methods/get-print-url'
import { requestGetUrl } from './methods/get-url'
import { requestGetViewUrl } from './methods/get-view-url'
import { requestIssue } from './methods/issue'
import { parseIssueCallbackArgs, parseIssuePromiseArgs } from './parsers/issue'
import { parseGetUrlCallbackArgs, parseUrlMethodCallbackArgs } from './parsers/url'

type TaxinvoiceRuntimeMethodNames = TaxinvoiceRuntimeMethodName

type TaxinvoiceRuntimeCallbackMethods = Pick<TaxinvoiceCallbackService, TaxinvoiceRuntimeMethodNames>
type TaxinvoiceRuntimePromiseMethods = Pick<TaxinvoicePromiseService, TaxinvoiceRuntimeMethodNames>

export function createTaxinvoiceRuntimeMethods(config: CompatConfig): {
  callback: TaxinvoiceRuntimeCallbackMethods
  promise: TaxinvoiceRuntimePromiseMethods
} {
  const context = createTaxinvoiceRuntimeContext(config)

  return {
    callback: {
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
        const memo = typeof maybeMemoOrSuccess === 'string' ? maybeMemoOrSuccess : ''
        const callbackArgs = typeof maybeMemoOrSuccess === 'function'
          ? [maybeMemoOrSuccess, ...args]
          : args
        const parsed = parseLegacyUserIdAndCallbacks<TaxInvoiceApiResponseBase>(callbackArgs)

        void requestCancelIssue(context, corpNum, keyType, mgtKey, memo, parsed.userId)
          .then((response) => {
            parsed.success?.(response)
          })
          .catch((error) => {
            handleCallbackError(context, 'cancelIssue', error, parsed.error)
          })
      }) as TaxinvoiceRuntimeCallbackMethods['cancelIssue'],

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
    },

    promise: {
      issue: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, ...args: unknown[]) => {
        const parsed = parseIssuePromiseArgs(args)

        try {
          return await requestIssue(context, corpNum, keyType, mgtKey, parsed)
        }
        catch (error) {
          return throwPromiseError(context, 'issue', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['issue'],

      cancelIssue: (async (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, maybeMemo?: unknown, maybeUserId?: unknown) => {
        const memo = typeof maybeMemo === 'string' ? maybeMemo : ''
        const userId = typeof maybeUserId === 'string' ? maybeUserId : ''

        try {
          return await requestCancelIssue(context, corpNum, keyType, mgtKey, memo, userId)
        }
        catch (error) {
          return throwPromiseError(context, 'cancelIssue', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['cancelIssue'],

      getURL: (async (corpNum: string, togo: TaxInvoiceGetUrlTogo, userId?: string) => {
        try {
          return await requestGetUrl(context, corpNum, togo, userId ?? '')
        }
        catch (error) {
          return throwPromiseError(context, 'getURL', error)
        }
      }) as TaxinvoiceRuntimePromiseMethods['getURL'],

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
    },
  }
}
