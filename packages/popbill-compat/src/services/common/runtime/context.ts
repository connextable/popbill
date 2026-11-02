import { createLinkhubAuthClient, createTokenProvider, LinkhubAuthScope, PopbillServiceIds } from '@connextable/popbill-runtime'
import type { CompatConfig } from '@/config'
import { createCompatRequestClient, registerCompatTokenProvider } from '@/internal/request-client'

export function createCommonRuntimeContext(config: CompatConfig) {
  const authClient = createLinkhubAuthClient({
    linkId: config.LinkID,
    secretKey: config.SecretKey,
    useStaticIp: config.UseStaticIP ?? false,
    useGaIp: config.UseGAIP ?? false,
    useLocalTime: config.UseLocalTimeYN ?? true,
    timeoutMs: config.requestTimeoutMs ?? 180_000,
  })
  const tokenProvider = createTokenProvider({
    authClient,
    serviceId: config.IsTest ? PopbillServiceIds.Test : PopbillServiceIds.Production,
    scopes: [LinkhubAuthScope.Member],
    forwardedIp: config.IPRestrictOnOff === false ? '*' : undefined,
  })
  registerCompatTokenProvider(config, tokenProvider)
  return {
    requestClient: createCompatRequestClient(config, [LinkhubAuthScope.Member]),
    authClient,
    tokenProvider,
    linkId: config.LinkID,
    defaultErrorHandler: config.defaultErrorHandler,
  }
}
export type CommonRuntimeContext = ReturnType<typeof createCommonRuntimeContext>
