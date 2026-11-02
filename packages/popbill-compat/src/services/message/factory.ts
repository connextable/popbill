import type { CompatConfig } from '@/config'
import { createMessageRuntimeMethods } from './runtime'
import type { MessageCallbackService, MessagePromiseService } from './types'
export function createMessageService(config: CompatConfig): MessageCallbackService {
  return createMessageRuntimeMethods(config).callback
}
export function createMessagePromiseService(config: CompatConfig): MessagePromiseService {
  return createMessageRuntimeMethods(config).promise
}
