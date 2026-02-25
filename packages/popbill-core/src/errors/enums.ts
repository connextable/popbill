export const PopbillErrorType = {
  InputValidation: 'input_validation',
  ApiResponse: 'api_response',
  Http: 'http',
  Network: 'network',
  Timeout: 'timeout',
  Unknown: 'unknown',
} as const

export const PopbillErrorStage = {
  ValidateInput: 'validate_input',
  IssueToken: 'issue_token',
  RequestApi: 'request_api',
  Unknown: 'unknown',
} as const

export type PopbillErrorType = typeof PopbillErrorType[keyof typeof PopbillErrorType]
export type PopbillErrorStage = typeof PopbillErrorStage[keyof typeof PopbillErrorStage]
