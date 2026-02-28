import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestDetachStatement(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  subItemCode: number,
  subMgtKey: string,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  if (!Number.isInteger(subItemCode)) {
    throw createLegacyValidationError('첨부해제할 전자명세서코드가 입력되지 않았습니다.')
  }

  if (!subMgtKey) {
    throw createLegacyValidationError('첨부해제할 전자명세서 문서번호가 입력되지 않았습니다.')
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
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
