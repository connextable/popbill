
import { validateCorpNum, validateEmailSendYn, validateEmailType } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestUpdateEmailConfig(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  emailType: string,
  sendYN: boolean,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const emailTypeError = validateEmailType(emailType)
  if (emailTypeError) {
    throw emailTypeError
  }

  const sendYnError = validateEmailSendYn(sendYN)
  if (sendYnError) {
    throw sendYnError
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/EmailSendConfig?EmailType=${encodeURIComponent(emailType)}&SendYN=${String(sendYN)}`,
    corpNum,
    userId,
    method: 'POST',
  })
}
