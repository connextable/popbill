import type { EasyFinBankSearchResultApiModel, EasyFinBankSummaryApiModel } from '@connextable/popbill-spec'
import type { EasyFinBankCallbackService } from '@/services/easyfinbank'

/** Compile-time contract: an undefined final option needs both callback slots. */
export function verifyEasyFinBankCallbackTypes(service: EasyFinBankCallbackService): void {
  const searchSuccess = (_response: EasyFinBankSearchResultApiModel): void => {}
  const summarySuccess = (_response: EasyFinBankSummaryApiModel): void => {}
  service.search('1234567890', '202611030000000001', ['I'], '', 1, 500, undefined, searchSuccess, undefined)
  service.search('1234567890', '202611030000000001', ['I'], '', 1, 500, undefined, undefined, searchSuccess, undefined)
  service.summary('1234567890', '202611030000000001', ['I'], undefined, summarySuccess, undefined)
  service.summary('1234567890', '202611030000000001', ['I'], undefined, undefined, summarySuccess, undefined)
  // @ts-expect-error A single callback immediately after undefined is the error callback.
  service.search('1234567890', '202611030000000001', ['I'], '', 1, 500, undefined, searchSuccess)
  // @ts-expect-error A single callback immediately after undefined is the error callback.
  service.summary('1234567890', '202611030000000001', ['I'], undefined, summarySuccess)
}
