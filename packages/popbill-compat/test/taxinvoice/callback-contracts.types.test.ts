import { expectTypeOf, test } from 'vitest'
import type * as Spec from '@connextable/popbill-spec'
import type { TaxinvoiceCallbackService } from '@/services/taxinvoice/types'

function checkLegacyCallbacks(service: TaxinvoiceCallbackService): void {
  const error = (_value: unknown): void => {}
  const info = (_value: Spec.TaxInvoiceGetInfoApiResponse): void => {}
  const charge = (_value: Spec.TaxInvoiceGetChargeInfoApiResponse): void => {}
  const pdf = (_value: Buffer): void => {}
  const sent = (_value: Spec.TaxInvoiceApiResponseBase): void => {}
  service.getInfo('1234567890', 'SELL', 'KEY', undefined, error)
  service.getInfo('1234567890', 'SELL', 'KEY', undefined, info, undefined)
  service.getChargeInfo('1234567890', undefined, error)
  service.getChargeInfo('1234567890', undefined, charge, undefined)
  service.getPDF('1234567890', 'SELL', 'KEY', undefined, error)
  service.getPDF('1234567890', 'SELL', 'KEY', 'user', undefined, error)
  service.getPDF('1234567890', 'SELL', 'KEY', undefined, '1', pdf)
  service.getPDF('1234567890', 'SELL', 'KEY', 'user', undefined, pdf, undefined)
  service.send('1234567890', 'SELL', 'KEY', 'memo', undefined, error)
  service.send('1234567890', 'SELL', 'KEY', 'memo', 'user', undefined, error)
  service.send('1234567890', 'SELL', 'KEY', 'memo', 'title', undefined, sent, undefined)
  service.registIssue('1234567890', {}, undefined, error)
  service.registIssue('1234567890', {}, false, undefined, error)
  service.registIssue('1234567890', {}, undefined, sent, undefined)
  service.bulkSubmit('1234567890', 'SUBMIT-1', [], undefined, error)
  service.bulkSubmit('1234567890', 'SUBMIT-1', [], undefined, sent, undefined)
  service.issue('1234567890', 'SELL', 'KEY', undefined, error)
  service.issue('1234567890', 'SELL', 'KEY', 'memo', undefined, error)
  service.issue('1234567890', 'SELL', 'KEY', undefined, sent, undefined)
  service.registRequest('1234567890', {}, undefined, error)
  service.register('1234567890', {}, 'user', true, sent, undefined)
  // @ts-expect-error One callback after undefined is the legacy error callback.
  service.getInfo('1234567890', 'SELL', 'KEY', undefined, info)
  // @ts-expect-error An undefined UserID with success requires an explicit error slot.
  service.getChargeInfo('1234567890', undefined, charge)
  // @ts-expect-error An undefined UserID with success requires an explicit error slot.
  service.getPDF('1234567890', 'SELL', 'KEY', undefined, pdf)
  // @ts-expect-error An undefined PDF copy with success requires both callback slots.
  service.getPDF('1234567890', 'SELL', 'KEY', 'user', undefined, pdf)
  // @ts-expect-error An undefined UserID after a title requires both callback slots.
  service.send('1234567890', 'SELL', 'KEY', 'memo', 'title', undefined, sent)
  // @ts-expect-error An undefined WriteSpecification and one callback is the short error-only form.
  service.registIssue('1234567890', {}, undefined, sent)
  // @ts-expect-error An undefined ForceIssue and one callback is the short error-only form.
  service.bulkSubmit('1234567890', 'SUBMIT-1', [], undefined, sent)
  // @ts-expect-error An undefined memo and one callback is the short error-only form.
  service.issue('1234567890', 'SELL', 'KEY', undefined, sent)
}

test('keeps callback types aligned with legacy arity', () => {
  expectTypeOf(checkLegacyCallbacks).toBeFunction()
})
