import type { JusoRuntimeConfig } from './types.ts'
import { parseBooleanValue, parsePositiveIntegerValue, readEnvironmentString } from '../shared/environment.ts'

const REQUIRED_ENVIRONMENT_NAME_LIST = ['JUSO_LINK_ID', 'JUSO_SECRET_KEY', 'JUSO_ACCESS_ID'] as const

export function loadJusoRuntimeConfig(): JusoRuntimeConfig {
  const environmentValueMap = {
    JUSO_LINK_ID: readEnvironmentString('JUSO_LINK_ID', ''),
    JUSO_SECRET_KEY: readEnvironmentString('JUSO_SECRET_KEY', ''),
    JUSO_ACCESS_ID: readEnvironmentString('JUSO_ACCESS_ID', ''),
  }

  const missingNames = REQUIRED_ENVIRONMENT_NAME_LIST.filter((name) => environmentValueMap[name].length === 0)

  return {
    linkId: environmentValueMap.JUSO_LINK_ID,
    secretKey: environmentValueMap.JUSO_SECRET_KEY,
    accessId: environmentValueMap.JUSO_ACCESS_ID,
    apiBaseUrl: readEnvironmentString('JUSO_API_BASE_URL', '') || undefined,
    authBaseUrl: readEnvironmentString('JUSO_AUTH_BASE_URL', '') || undefined,
    useLocalTime: parseBooleanValue(readEnvironmentString('JUSO_USE_LOCAL_TIME', 'true'), true),
    requestTimeoutMilliseconds: parsePositiveIntegerValue(readEnvironmentString('JUSO_REQUEST_TIMEOUT_MS', '30000'), 30_000),
    acceptLanguage: readEnvironmentString('JUSO_ACCEPT_LANGUAGE', '') || undefined,
    forwardedIpAddress: readEnvironmentString('JUSO_FORWARDED_IP_ADDRESS', '') || undefined,
    defaultSearchKeyword: readEnvironmentString('JUSO_SEARCH_KEYWORD', '') || undefined,
    missingNames,
  }
}
