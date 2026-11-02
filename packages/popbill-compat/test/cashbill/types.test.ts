import type { CashbillCallbackService } from '@/services/cashbill'
import type { CashbillInfoApiModel, CashbillIssueApiResponse, CashbillApiResponseBase } from '@connextable/popbill-spec'

function verifyCallbackContracts(service: CashbillCallbackService): void {
  const info = (response: CashbillInfoApiModel): void => {
    void response.stateCode
  }
  const issued = (response: CashbillIssueApiResponse): void => {
    void response.confirmNum
  }
  const operation = (response: CashbillApiResponseBase): void => {
    void response.code
  }
  const error = (_error: unknown): void => undefined
  service.getInfo('1234567890', 'CASH-001', info)
  service.getInfo('1234567890', 'CASH-001', 'user', info)
  service.getInfo('1234567890', 'CASH-001', undefined, info, undefined)
  service.getInfo('1234567890', 'CASH-001', undefined, error)
  service.issue('1234567890', 'CASH-001', undefined, issued, error)
  service.cancelIssue('1234567890', 'CASH-001', undefined, operation, undefined)
  service.registIssue('1234567890', {}, undefined, undefined, undefined, issued, error)
  service.revokeRegistIssue(
    '1234567890',
    'REVOKE',
    '123456789',
    '20261103',
    false,
    undefined,
    undefined,
    false,
    1,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    issued,
    error
  )
  // @ts-expect-error The sole function after undefined is an error callback, so a success DTO callback needs both callback slots.
  service.getInfo('1234567890', 'CASH-001', undefined, info)
  // @ts-expect-error An undefined memo followed by a success DTO callback requires an explicit error slot.
  service.issue('1234567890', 'CASH-001', undefined, issued)
  // @ts-expect-error An undefined memo followed by a success DTO callback requires an explicit error slot.
  service.cancelIssue('1234567890', 'CASH-001', undefined, operation)
  // @ts-expect-error An undefined email subject followed by a success DTO callback requires an explicit error slot.
  service.registIssue('1234567890', {}, undefined, undefined, undefined, issued)
  service.revokeRegistIssue(
    '1234567890',
    'REVOKE',
    '123456789',
    '20261103',
    false,
    undefined,
    undefined,
    false,
    1,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    // @ts-expect-error An undefined trade datetime followed by a success DTO callback requires an explicit error slot.
    undefined,
    issued
  )
}

it('keeps callback overload assertions available to TypeScript', () => {
  expect(verifyCallbackContracts).toBeTypeOf('function')
})
