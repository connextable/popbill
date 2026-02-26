import type { TaxInvoiceGetCertificateExpireDateApiResponse } from '@connextable/popbill-spec'
import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetCertificateExpireDate(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string
): Promise<string> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const response = await context.requestClient.requestJson<TaxInvoiceGetCertificateExpireDateApiResponse>({
    uri: '/Taxinvoice?cfg=CERT',
    corpNum,
    userId,
    method: 'GET',
  })

  if (!response.certificateExpiration || response.certificateExpiration.length < 14) {
    return ''
  }

  const raw = response.certificateExpiration
  const year = Number(raw.slice(0, 4))
  const month = Number(raw.slice(4, 6))
  const day = Number(raw.slice(6, 8))
  const hour = Number(raw.slice(8, 10))
  const minute = Number(raw.slice(10, 12))
  const second = Number(raw.slice(12, 14))

  const localDate = new Date(year, month - 1, day, hour, minute, second)
  return localDate.toLocaleString()
}
