import type { ClosedownApiRequest, ClosedownRequireRequestFields } from '../common'
import type { ClosedownBusinessStatusApiModel } from '../models'

/** GET /CloseDown. @see https://developers.popbill.com/api-reference/closedown/api/check#CheckCorpNum */
export interface ClosedownCheckCorpNumApiRequestQuery {
  CN: string
}
export type ClosedownCheckCorpNumApiRequest = ClosedownRequireRequestFields<ClosedownApiRequest<ClosedownCheckCorpNumApiRequestQuery>, 'query'>
export type ClosedownCheckCorpNumApiResponse = ClosedownBusinessStatusApiModel
