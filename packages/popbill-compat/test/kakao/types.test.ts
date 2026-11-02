import type { KakaoCallbackService, KakaoPromiseService } from '@/services/kakao/types'
import type { KakaoNotificationTemplateApiModel } from '@connextable/popbill-spec'

function verifyOverloads(callback: KakaoCallbackService, promise: KakaoPromiseService): void {
  const success = (response: KakaoNotificationTemplateApiModel): void => {
    void response.templateCode
  }
  const failure = (_error: unknown): void => undefined
  callback.getATSTemplate('1234567890', 'TPL', success, failure)
  callback.getATSTemplate('1234567890', 'TPL', undefined, success, undefined)
  callback.getATSTemplate('1234567890', 'TPL', undefined, failure)
  // @ts-expect-error One function after undefined is the error callback, not a template success callback.
  callback.getATSTemplate('1234567890', 'TPL', undefined, success)
  void promise.sendATS_one('1234567890', 'TPL', '16008536', '본문', '대체본문', 'A', '20261104120000', '01012345678', '수신자')
  void promise.sendATS_one(
    '1234567890',
    'TPL',
    '16008536',
    '본문',
    '대체제목',
    '대체본문',
    'A',
    '20261104120000',
    '01012345678',
    '수신자',
    undefined,
    undefined,
    undefined
  )
  // @ts-expect-error The altSubject form must keep all slots to distinguish it from legacy shorter overloads.
  void promise.sendATS_one('1234567890', 'TPL', '16008536', '본문', '대체제목', '대체본문', 'A', '20261104120000', '01012345678', '수신자')
  // @ts-expect-error Unit-cost lookup requires the message type.
  callback.getUnitCost('1234567890', (_value: string) => undefined)
}

it('keeps positional overload checks available to TypeScript', () => {
  expect(verifyOverloads).toBeTypeOf('function')
})
