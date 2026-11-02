import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, required } from '../common'
import { createLegacyValidationError } from '@/internal/errors'

export async function requestSearch(context: KakaoRuntimeContext, ...args: KakaoMethodArguments['search']): Promise<KakaoMethodResults['search']> {
  const [corpNum, startDate, endDate, states, items, reserve, senderOnly, page, perPage, order, query, userId, channel, contentTypes] = args
  required(startDate, '시작일자가 입력되지 않았습니다.')
  required(endDate, '종료일자가 입력되지 않았습니다.')
  if (!/^\d{8}$/.test(startDate) || !/^\d{8}$/.test(endDate)) throw createLegacyValidationError('조회일자 유형이 올바르지 않습니다.')
  if (states !== undefined && (!Array.isArray(states) || states.length === 0)) throw createLegacyValidationError('전송상태가 입력되지 않았습니다.')
  const params: Record<string, unknown> = {
    SDate: startDate,
    EDate: endDate,
    State: states?.join(','),
    Item: items?.join(','),
    ReserveYN: reserve,
    SenderOnly: senderOnly ? '1' : '0',
    Page: page,
    PerPage: perPage,
    Order: order,
    QString: query,
    PlusFriendID: channel,
    ContentType: contentTypes?.join(','),
  }
  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => key + '=' + encodeURIComponent(String(value)))
    .join('&')
  return request(context, corpNum, '/KakaoTalk/Search?' + queryString, userId)
}
