declare namespace NodeJS {
  export interface ProcessEnv {
    POPBILL_LINK_ID?: string
    POPBILL_SECRET_KEY?: string
    POPBILL_CORP_NUM?: string
    POPBILL_USER_ID?: string
    POPBILL_RUN_INTEGRATION_TESTS?: 'true' | 'false'
  }
}
