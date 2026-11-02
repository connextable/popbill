import type { TaxinvoiceCallbackService, TaxinvoicePromiseService } from '../types'
import { invokeUserCallback } from '@/internal/callback'
import { asErrorCallback, asSuccessCallback, handleCallbackError, parseLegacyUserIdAndCallbacks, throwPromiseError } from './common'
import type { TaxinvoiceRuntimeContext } from './context'
import * as methods from './methods'
import type * as Spec from '@connextable/popbill-spec'

type AdditionalMethod =
  | 'getChargeInfo'
  | 'getUnitCost'
  | 'send'
  | 'cancelSend'
  | 'accept'
  | 'deny'
  | 'getOldPrintURL'
  | 'getEmailPublicKeys'
  | 'getPDF'

export function createAdditionalTaxinvoiceRuntimeMethods(context: TaxinvoiceRuntimeContext): {
  callback: Pick<TaxinvoiceCallbackService, AdditionalMethod>
  promise: Pick<TaxinvoicePromiseService, AdditionalMethod>
} {
  const handlers = {
    getChargeInfo: {
      required: 1,
      invoke: (a: unknown[]) => methods.requestGetChargeInfo(context, a[0] as string, (a[1] as string | undefined) ?? ''),
    },
    getUnitCost: { required: 1, invoke: (a: unknown[]) => methods.requestGetUnitCost(context, a[0] as string) },
    send: {
      required: 4,
      invoke: (a: unknown[]) => {
        // A single optional string is legacy UserID; EmailSubject needs both slots.
        const full = a.length >= 6
        return methods.requestSend(
          context,
          a[0] as string,
          a[1] as Spec.TaxInvoiceMgtKeyType,
          a[2] as string,
          a[3] as string,
          full ? ((a[4] as string | undefined) ?? '') : '',
          (a[full ? 5 : 4] as string | undefined) ?? ''
        )
      },
    },
    cancelSend: {
      required: 4,
      invoke: (a: unknown[]) =>
        methods.requestCancelSend(
          context,
          a[0] as string,
          a[1] as Spec.TaxInvoiceMgtKeyType,
          a[2] as string,
          a[3] as string,
          (a[4] as string | undefined) ?? ''
        ),
    },
    accept: {
      required: 4,
      invoke: (a: unknown[]) =>
        methods.requestAccept(
          context,
          a[0] as string,
          a[1] as Spec.TaxInvoiceMgtKeyType,
          a[2] as string,
          a[3] as string,
          (a[4] as string | undefined) ?? ''
        ),
    },
    deny: {
      required: 4,
      invoke: (a: unknown[]) =>
        methods.requestDeny(
          context,
          a[0] as string,
          a[1] as Spec.TaxInvoiceMgtKeyType,
          a[2] as string,
          a[3] as string,
          (a[4] as string | undefined) ?? ''
        ),
    },
    getOldPrintURL: {
      required: 3,
      invoke: (a: unknown[]) =>
        methods.requestGetOldPrintUrl(context, a[0] as string, a[1] as Spec.TaxInvoiceMgtKeyType, a[2] as string, (a[3] as string | undefined) ?? ''),
    },
    getEmailPublicKeys: {
      required: 1,
      invoke: (a: unknown[]) => methods.requestGetEmailPublicKeys(context, a[0] as string, (a[1] as string | undefined) ?? ''),
    },
    getPDF: {
      required: 3,
      invoke: (a: unknown[]) =>
        methods.requestGetPdf(
          context,
          a[0] as string,
          a[1] as Spec.TaxInvoiceMgtKeyType,
          a[2] as string,
          (a[3] as string | undefined) ?? '',
          a[4] as Spec.TaxInvoiceGetPdfApiRequestQuery['PdfInvoiceType']
        ),
    },
  }
  const callback: Record<string, (...args: unknown[]) => void> = {}
  const promise: Record<string, (...args: unknown[]) => Promise<unknown>> = {}

  for (const name of Object.keys(handlers) as AdditionalMethod[]) {
    const handler = handlers[name]
    promise[name] = async (...args) => {
      try {
        return await handler.invoke(args)
      } catch (error) {
        return throwPromiseError(context, name, error)
      }
    }
    callback[name] = (...args) => {
      const optional = args.slice(handler.required)
      let parsed = parseLegacyUserIdAndCallbacks<unknown>(optional)
      let invocationArgs = [...args.slice(0, handler.required), parsed.userId]
      if (name === 'getUnitCost') {
        parsed = { userId: '', success: asSuccessCallback(optional[0]), error: asErrorCallback(optional[1]) }
        invocationArgs = args.slice(0, handler.required)
      } else if (name === 'send' && (typeof optional[1] === 'string' || (optional.length >= 4 && optional[1] === undefined))) {
        parsed = parseLegacyUserIdAndCallbacks<unknown>(optional.slice(1))
        invocationArgs = [...args.slice(0, handler.required), optional[0], parsed.userId]
      } else if (name === 'getPDF' && (typeof optional[1] === 'string' || (optional.length >= 4 && optional[1] === undefined))) {
        parsed = {
          userId: typeof optional[0] === 'string' ? optional[0] : '',
          success: asSuccessCallback(optional[2]),
          error: asErrorCallback(optional[3]),
        }
        invocationArgs = [...args.slice(0, handler.required), parsed.userId, optional[1]]
      }
      void handler.invoke(invocationArgs).then(
        (response) => {
          invokeUserCallback(parsed.success, response)
        },
        (error: unknown) => handleCallbackError(context, name, error, parsed.error)
      )
    }
  }

  return {
    callback: callback as Pick<TaxinvoiceCallbackService, AdditionalMethod>,
    promise: promise as Pick<TaxinvoicePromiseService, AdditionalMethod>,
  }
}
