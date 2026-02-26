import type { TaxInvoiceGetLogsApiResponse, TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetLogs(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string
): Promise<TaxInvoiceGetLogsApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<TaxInvoiceGetLogsApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}/Logs`,
    corpNum,
    userId,
    method: 'GET',
  })
}
