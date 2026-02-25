import { stringifyWithoutEmptyValues } from '@connextable/popbill-core'
import type {
  TaxInvoiceApiResponseBase,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestDetachStatement(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  subItemCode: number,
  subMgtKey: string,
  userId: string,
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  if (subItemCode === null || subItemCode === undefined) {
    throw createLegacyValidationError('첨부해제할 전자명세서코드가 입력되지 않았습니다.')
  }

  if (!subMgtKey) {
    throw createLegacyValidationError('첨부해제할 전자명세서 문서번호가 입력되지 않았습니다.')
  }

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}/DetachStmt`,
    corpNum,
    userId,
    method: 'POST',
    body: stringifyWithoutEmptyValues({
      ItemCode: subItemCode,
      MgtKey: subMgtKey,
    }),
  })
}
