import type { CompatConfig } from '@/config'
import { createKakaoRuntimeMethods } from './runtime'
import type { KakaoCallbackService, KakaoPromiseService } from './types'
export function createKakaoService(config: CompatConfig): KakaoCallbackService {
  return createKakaoRuntimeMethods(config).callback
}
export function createKakaoPromiseService(config: CompatConfig): KakaoPromiseService {
  return createKakaoRuntimeMethods(config).promise
}
