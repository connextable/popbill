import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestSendSms(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  sender: string,
  receiver: string,
  contents: string,
  userId: string
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'SMS',
    body: stringifyWithoutEmptyValues({
      sender,
      receiver,
      contents,
    }),
  })
}
