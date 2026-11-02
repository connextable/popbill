import type { ClosedownApiRequest, ClosedownRequireRequestFields } from '../common'
import type { ClosedownBusinessStatusApiModel } from '../models'

/** POST /CloseDown. 최대 1,000건. @see https://developers.popbill.com/api-reference/closedown/api/check#CheckCorpNums */
export type ClosedownCheckCorpNumsApiRequestBody = string[]
export type ClosedownCheckCorpNumsApiRequest = ClosedownRequireRequestFields<ClosedownApiRequest<never, ClosedownCheckCorpNumsApiRequestBody>, 'body'>
export type ClosedownCheckCorpNumsApiResponse = ClosedownBusinessStatusApiModel[]
