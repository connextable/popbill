import type { PopbillErrorStage, PopbillErrorType } from './enums'

export interface PopbillApiError {
  code: number
  message: string
  type?: PopbillErrorType
  operation?: string
  stage?: PopbillErrorStage
  retriable?: boolean
  status?: number
  raw?: unknown
}
