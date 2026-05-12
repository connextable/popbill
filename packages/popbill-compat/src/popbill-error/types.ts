import type { PopbillErrorCategory } from './code-catalog'
import type { PopbillErrorDomain, PopbillErrorStage, PopbillErrorType } from './enums'

interface PopbillApiErrorBase {
  code: number
  message: string
  userMessage: string
  domain: PopbillErrorDomain
  type: PopbillErrorType
  operation?: string
  stage: PopbillErrorStage
  retriable: boolean
  status?: number
  raw?: unknown
}

export interface PopbillKnownApiError extends PopbillApiErrorBase {
  knownCode: true
  category: PopbillErrorCategory
  canonicalMessage: string
}

export interface PopbillUnknownApiError extends PopbillApiErrorBase {
  knownCode: false
  category?: undefined
  canonicalMessage?: undefined
}

export type PopbillApiError = PopbillKnownApiError | PopbillUnknownApiError

export interface PopbillApiErrorInput {
  code: number
  message: string
  knownCode?: boolean
  category?: PopbillErrorCategory
  canonicalMessage?: string
  userMessage?: string
  domain?: PopbillErrorDomain
  type?: PopbillErrorType
  operation?: string
  stage?: PopbillErrorStage
  retriable?: boolean
  status?: number
  raw?: unknown
}
