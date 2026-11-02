import { expectTypeOf, it } from 'vitest'
import type * as Spec from '@connextable/popbill-spec'
import type { CommonCallbackService } from '@/services/common'

function checkLegacyCallbacks(callbackService: CommonCallbackService, success: (value: unknown) => void): void {
  callbackService.getRefundHistory('1234567890', 1, 500, success)
  callbackService.getRefundHistory('1234567890', 1, undefined, success, undefined)
  callbackService.getPaymentHistory('1234567890', '20260101', '20260131', 1, undefined, success, undefined)
  callbackService.getUseHistory('1234567890', '20260101', '20260131', 1, 500, undefined, success, undefined)
  // @ts-expect-error An undefined optional field needs both callback slots to avoid an error-only legacy invocation.
  callbackService.getRefundHistory('1234567890', 1, undefined, success)
  // @ts-expect-error An undefined PerPage and a single callback form the error-only legacy invocation.
  callbackService.getPaymentHistory('1234567890', '20260101', '20260131', 1, undefined, success)
  // @ts-expect-error An undefined Order and a single callback form the error-only legacy invocation.
  callbackService.getUseHistory('1234567890', '20260101', '20260131', 1, 500, undefined, success)
}

it('models unauthenticated requests without member authentication metadata', () => {
  expectTypeOf(checkLegacyCallbacks).toBeFunction()
  const checkId = { query: { ID: 'new-user' } } satisfies Spec.CommonCheckIdApiRequest
  const checkMember = { query: { CorpNum: '1234567890', LID: 'LINK' } } satisfies Spec.CommonCheckIsMemberApiRequest
  const join = {
    body: {
      ID: 'new-user',
      Password: 'password',
      LinkID: 'LINK',
      CorpNum: '1234567890',
      CEOName: '대표',
      CorpName: '회사',
      Addr: '주소',
      BizType: '업태',
      BizClass: '종목',
      ContactName: '담당자',
      ContactEmail: 'contact@example.com',
      ContactTEL: '01012345678',
    },
  } satisfies Spec.CommonJoinMemberApiRequest
  expectTypeOf(checkId).toMatchTypeOf<Spec.CommonCheckIdApiRequest>()
  expectTypeOf(checkMember).toMatchTypeOf<Spec.CommonCheckIsMemberApiRequest>()
  expectTypeOf(join).toMatchTypeOf<Spec.CommonJoinMemberApiRequest>()
  expectTypeOf<Spec.CommonUseHistoryApiModel['itemCode']>().toEqualTypeOf<number | undefined>()
  expectTypeOf<Spec.CommonUseHistoryApiModel['txType']>().toEqualTypeOf<number | undefined>()
})
