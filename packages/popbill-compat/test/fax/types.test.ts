import type { FaxCallbackService, FaxPromiseService } from '@/services/fax'

// Compile-time coverage for optional positional slots; never sends a request.
function verifyOverloads(callback: FaxCallbackService, promise: FaxPromiseService): void {
  // An undefined trailing request argument plus one callback is error-only at runtime.
  // @ts-expect-error The explicit undefined user slot needs both callback slots.
  callback.getSenderNumberList('1234567890', undefined, (_value: { number: string }[]) => undefined)
  // @ts-expect-error An undefined ReserveDT also needs an explicit error slot.
  callback.sendFaxBinary('1234567890', '0211111111', '0222222222', '고객', [], undefined, (_value: string) => undefined)
  callback.getUnitCost('1234567890', (value: string) => {
    void value
  })
  callback.getUnitCost(
    '1234567890',
    undefined,
    undefined,
    (value: string) => {
      void value
    },
    undefined
  )
  callback.search(
    '1234567890',
    '20261101',
    '20261103',
    undefined,
    false,
    false,
    undefined,
    undefined,
    undefined,
    (value) => {
      void value.list
    },
    undefined
  )
  callback.search(
    '1234567890',
    '20261101',
    '20261103',
    undefined,
    undefined,
    undefined,
    'D',
    1,
    500,
    undefined,
    undefined,
    (value) => {
      void value.pageNum
    },
    undefined
  )
  callback.sendFaxBinary(
    '1234567890',
    { SenderNum: '0211111111', Receiver: '0222222222', BinaryFiles: [{ fileName: 'a.pdf', fileData: Buffer.from('a') }] },
    (value: string) => {
      void value
    },
    undefined
  )
  void promise.search('1234567890', '20261101', '20261103', undefined, undefined, undefined, undefined, undefined, undefined)
}

test('legacy overload types preserve omitted and explicit undefined slots', () => {
  expectTypeOf(verifyOverloads).toBeFunction()
})
