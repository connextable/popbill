# Popbill Modern SDK Migration TODO

## Guide

이 문서는 `@connextable/popbill` modern SDK 마이그레이션의 진행 이력입니다. 체크리스트의 개수·`DONE`·날짜는 당시 구현·로컬 검증 상태이며 이후 변경의 결과를 뜻하지 않습니다. 현재 지원 범위는 [계약 기록](./service-coverage.md), 현재 메서드 수·서명·분류·순서는 [생성 레퍼런스](../sdk/README.md)를 확인합니다.

- 목적: 진행 추적
- 범위: endpoint별 상태/메모 관리
- 비목적: 사용자 사용 가이드 제공

최신 메서드/타입은 아래 경로를 우선 확인합니다.

- SDK 생성 문서: [`docs/sdk`](../sdk) (`pnpm docs:generate`로 재생성)
- 소스 코드: [`packages/popbill/src/services`](../../packages/popbill/src/services)
- 스펙 타입: [`packages/popbill-spec/src`](../../packages/popbill-spec/src)

관련 진입 문서:

- 루트 README: [`README.md`](../../README.md)
- 패키지 README: [`packages/popbill/README.md`](../../packages/popbill/README.md)
- 예제 실행 가이드: [`examples/README.md`](../../examples/README.md)
- compat 추적 문서: [`docs/migration/popbill-compat.todo.md`](./popbill-compat.todo.md)

업데이트 원칙:

- 상태를 변경할 때 `status`, `updated_at`, `notes`를 같은 커밋에서 함께 갱신합니다.

## Status Legend

- `NOT_STARTED`
- `IN_PROGRESS`
- `DONE`
- `BLOCKED`

## TaxInvoice Method Checklist

| service     | method                              | status | owner | updated_at | notes                                      |
| ----------- | ----------------------------------- | ------ | ----- | ---------- | ------------------------------------------ |
| tax-invoice | issueInvoiceImmediately             | DONE   | TBD   | 2026-05-15 | Compat bridge: `registIssue`.              |
| tax-invoice | submitBulkIssue                     | DONE   | TBD   | 2026-05-15 | Compat bridge: `bulkSubmit`.               |
| tax-invoice | getBulkIssueSubmissionResult        | DONE   | TBD   | 2026-05-15 | Compat bridge: `getBulkResult`.            |
| tax-invoice | registerInvoice                     | DONE   | TBD   | 2026-05-15 | Compat bridge: `register`.                 |
| tax-invoice | updateInvoice                       | DONE   | TBD   | 2026-05-15 | Compat bridge: `update`.                   |
| tax-invoice | issueInvoice                        | DONE   | TBD   | 2026-05-15 | Compat bridge: `issue`.                    |
| tax-invoice | cancelIssuedInvoice                 | DONE   | TBD   | 2026-05-15 | Compat bridge: `cancelIssue`.              |
| tax-invoice | requestReverseIssueImmediately      | DONE   | TBD   | 2026-05-15 | Compat bridge: `registRequest`.            |
| tax-invoice | requestReverseIssue                 | DONE   | TBD   | 2026-05-15 | Compat bridge: `request`.                  |
| tax-invoice | cancelReverseIssueRequest           | DONE   | TBD   | 2026-05-15 | Compat bridge: `cancelRequest`.            |
| tax-invoice | refuseReverseIssueRequest           | DONE   | TBD   | 2026-05-15 | Compat bridge: `refuse`.                   |
| tax-invoice | deleteInvoice                       | DONE   | TBD   | 2026-05-15 | Compat bridge: `delete`.                   |
| tax-invoice | sendInvoiceToNTS                    | DONE   | TBD   | 2026-05-15 | Compat bridge: `sendToNTS`.                |
| tax-invoice | getInvoiceInfo                      | DONE   | TBD   | 2026-05-15 | Compat bridge: `getInfo`.                  |
| tax-invoice | getInvoicesInfo                     | DONE   | TBD   | 2026-05-15 | Compat bridge: `getInfos`.                 |
| tax-invoice | getInvoiceDetailInfo                | DONE   | TBD   | 2026-05-15 | Compat bridge: `getDetailInfo`.            |
| tax-invoice | checkInvoiceManagementKeyInUse      | DONE   | TBD   | 2026-05-15 | Compat bridge: `checkMgtKeyInUse`.         |
| tax-invoice | getInvoiceXML                       | DONE   | TBD   | 2026-05-15 | Compat bridge: `getXML`.                   |
| tax-invoice | searchInvoices                      | DONE   | TBD   | 2026-05-15 | Compat bridge: `search`.                   |
| tax-invoice | getInvoiceLogs                      | DONE   | TBD   | 2026-05-15 | Compat bridge: `getLogs`.                  |
| tax-invoice | getTaxInvoiceBoxURL                 | DONE   | TBD   | 2026-05-15 | Compat bridge: `getURL`.                   |
| tax-invoice | getInvoicePopupURL                  | DONE   | TBD   | 2026-05-15 | Compat bridge: `getPopUpURL`.              |
| tax-invoice | getInvoiceViewURL                   | DONE   | TBD   | 2026-05-15 | Compat bridge: `getViewURL`.               |
| tax-invoice | getSupplierInvoicePrintURL          | DONE   | TBD   | 2026-05-15 | Compat bridge: `getPrintURL`.              |
| tax-invoice | getBuyerInvoicePrintURL             | DONE   | TBD   | 2026-05-15 | Compat bridge: `getEPrintURL`.             |
| tax-invoice | getBulkInvoicePrintURL              | DONE   | TBD   | 2026-05-15 | Compat bridge: `getMassPrintURL`.          |
| tax-invoice | getInvoiceMailURL                   | DONE   | TBD   | 2026-05-15 | Compat bridge: `getMailURL`.               |
| tax-invoice | getInvoicePDFURL                    | DONE   | TBD   | 2026-05-15 | Compat bridge: `getPDFURL`.                |
| tax-invoice | getSealAndAttachmentRegistrationURL | DONE   | TBD   | 2026-05-15 | Compat bridge: `getSealURL`.               |
| tax-invoice | attachFileFromPath                  | DONE   | TBD   | 2026-05-15 | Compat bridge: `attachFile`.               |
| tax-invoice | attachFileFromBinary                | DONE   | TBD   | 2026-05-15 | Compat bridge: `attachFileBinary`.         |
| tax-invoice | deleteAttachedFile                  | DONE   | TBD   | 2026-05-15 | Compat bridge: `deleteFile`.               |
| tax-invoice | getAttachedFiles                    | DONE   | TBD   | 2026-05-15 | Compat bridge: `getFiles`.                 |
| tax-invoice | resendInvoiceEmail                  | DONE   | TBD   | 2026-05-15 | Compat bridge: `sendEmail`.                |
| tax-invoice | resendInvoiceSMS                    | DONE   | TBD   | 2026-05-15 | Compat bridge: `sendSMS`.                  |
| tax-invoice | resendInvoiceFAX                    | DONE   | TBD   | 2026-05-15 | Compat bridge: `sendFAX`.                  |
| tax-invoice | attachInvoiceStatement              | DONE   | TBD   | 2026-05-15 | Compat bridge: `attachStatement`.          |
| tax-invoice | detachInvoiceStatement              | DONE   | TBD   | 2026-05-15 | Compat bridge: `detachStatement`.          |
| tax-invoice | assignInvoiceManagementKey          | DONE   | TBD   | 2026-05-15 | Compat bridge: `assignMgtKey`.             |
| tax-invoice | getEmailSendSettings                | DONE   | TBD   | 2026-05-15 | Compat bridge: `listEmailConfig`.          |
| tax-invoice | updateEmailSendSettings             | DONE   | TBD   | 2026-05-15 | Compat bridge: `updateEmailConfig`.        |
| tax-invoice | getSendToNTSSettings                | DONE   | TBD   | 2026-05-15 | Compat bridge: `getSendToNTSConfig`.       |
| tax-invoice | getTaxCertificateRegistrationURL    | DONE   | TBD   | 2026-05-15 | Compat bridge: `getTaxCertURL`.            |
| tax-invoice | getTaxCertificateExpirationDate     | DONE   | TBD   | 2026-05-15 | Compat bridge: `getCertificateExpireDate`. |
| tax-invoice | checkTaxCertificateValidation       | DONE   | TBD   | 2026-05-15 | Compat bridge: `checkCertValidation`.      |
| tax-invoice | getTaxCertificateInfo               | DONE   | TBD   | 2026-05-15 | Compat bridge: `getTaxCertInfo`.           |

## Statement Method Checklist

`client.services.statement`의 공개 메서드 34개를 모두 구현했습니다. `documentTypeCode`는 6종 전자명세서 코드(`121`~`126`)를 받습니다. `DONE`은 로컬 unit·HTTP mock 테스트와 타입 검사·린트까지 확인한 상태이며, 실서버 통합 테스트는 환경변수 설정 시 별도로 실행합니다.

| service   | method                              | status | owner | updated_at | notes                               |
| --------- | ----------------------------------- | ------ | ----- | ---------- | ----------------------------------- |
| statement | issueStatementImmediately           | DONE   | TBD   | 2026-11-02 | Compat bridge: `registIssue`.       |
| statement | registerStatement                   | DONE   | TBD   | 2026-11-02 | Compat bridge: `register`.          |
| statement | updateStatement                     | DONE   | TBD   | 2026-11-02 | Compat bridge: `update`.            |
| statement | issueStatement                      | DONE   | TBD   | 2026-11-02 | Compat bridge: `issue`.             |
| statement | cancelIssuedStatement               | DONE   | TBD   | 2026-11-02 | Compat bridge: `cancel`.            |
| statement | deleteStatement                     | DONE   | TBD   | 2026-11-02 | Compat bridge: `delete`.            |
| statement | getStatementInfo                    | DONE   | TBD   | 2026-11-02 | Compat bridge: `getInfo`.           |
| statement | getStatementsInfo                   | DONE   | TBD   | 2026-11-02 | Compat bridge: `getInfos`.          |
| statement | getStatementDetailInfo              | DONE   | TBD   | 2026-11-02 | Compat bridge: `getDetailInfo`.     |
| statement | checkStatementManagementKeyInUse    | DONE   | TBD   | 2026-11-02 | Compat bridge: `checkMgtKeyInUse`.  |
| statement | searchStatements                    | DONE   | TBD   | 2026-11-02 | Compat bridge: `search`.            |
| statement | getStatementLogs                    | DONE   | TBD   | 2026-11-02 | Compat bridge: `getLogs`.           |
| statement | getStatementBoxURL                  | DONE   | TBD   | 2026-11-02 | Compat bridge: `getURL`.            |
| statement | getStatementPopupURL                | DONE   | TBD   | 2026-11-02 | Compat bridge: `getPopUpURL`.       |
| statement | getStatementViewURL                 | DONE   | TBD   | 2026-11-02 | Compat bridge: `getViewURL`.        |
| statement | getSenderStatementPrintURL          | DONE   | TBD   | 2026-11-02 | Compat bridge: `getPrintURL`.       |
| statement | getReceiverStatementPrintURL        | DONE   | TBD   | 2026-11-02 | Compat bridge: `getEPrintURL`.      |
| statement | getBulkStatementPrintURL            | DONE   | TBD   | 2026-11-02 | Compat bridge: `getMassPrintURL`.   |
| statement | getStatementMailURL                 | DONE   | TBD   | 2026-11-02 | Compat bridge: `getMailURL`.        |
| statement | getSealAndAttachmentRegistrationURL | DONE   | TBD   | 2026-11-02 | Compat bridge: `getSealURL`.        |
| statement | attachFileFromPath                  | DONE   | TBD   | 2026-11-02 | Compat bridge: `attachFile`.        |
| statement | attachFileFromBinary                | DONE   | TBD   | 2026-11-02 | Compat bridge: `attachFileBinary`.  |
| statement | deleteAttachedFile                  | DONE   | TBD   | 2026-11-02 | Compat bridge: `deleteFile`.        |
| statement | getAttachedFiles                    | DONE   | TBD   | 2026-11-02 | Compat bridge: `getFiles`.          |
| statement | resendStatementEmail                | DONE   | TBD   | 2026-11-02 | Compat bridge: `sendEmail`.         |
| statement | resendStatementSMS                  | DONE   | TBD   | 2026-11-02 | Compat bridge: `sendSMS`.           |
| statement | resendStatementFAX                  | DONE   | TBD   | 2026-11-02 | Compat bridge: `sendFAX`.           |
| statement | sendStatementFAX                    | DONE   | TBD   | 2026-11-02 | Compat bridge: `FAXSend`.           |
| statement | attachStatement                     | DONE   | TBD   | 2026-11-02 | Compat bridge: `attachStatement`.   |
| statement | detachStatement                     | DONE   | TBD   | 2026-11-02 | Compat bridge: `detachStatement`.   |
| statement | getEmailSendSettings                | DONE   | TBD   | 2026-11-02 | Compat bridge: `listEmailConfig`.   |
| statement | updateEmailSendSettings             | DONE   | TBD   | 2026-11-02 | Compat bridge: `updateEmailConfig`. |
| statement | getChargeInfo                       | DONE   | TBD   | 2026-11-02 | Compat bridge: `getChargeInfo`.     |
| statement | getUnitCost                         | DONE   | TBD   | 2026-11-02 | Compat bridge: `getUnitCost`.       |

## TaxInvoice Additional Method Checklist

| service     | method             | status | updated_at | notes                                                                     |
| ----------- | ------------------ | ------ | ---------- | ------------------------------------------------------------------------- |
| tax-invoice | getChargeInfo      | DONE   | 2026-11-03 | Compat `getChargeInfo`; decimal unit cost remains a string.               |
| tax-invoice | getUnitCost        | DONE   | 2026-11-03 | Compat `getUnitCost`; no legacy user-ID parameter.                        |
| tax-invoice | downloadInvoicePDF | DONE   | 2026-11-03 | Binary response; seller documents and optional supplier/buyer print copy. |

## Additional Service Checklist

| service           | method_count | status | updated_at | notes                                                               |
| ----------------- | -----------: | ------ | ---------- | ------------------------------------------------------------------- |
| common            |           26 | DONE   | 2026-11-03 | Member/contact/company, points, payments and refunds.               |
| cashbill          |           33 | DONE   | 2026-11-03 | Receipt lifecycle, queries, PDF, notifications and pricing.         |
| message           |           19 | DONE   | 2026-11-03 | Recipient arrays unify single/batch sends; no legacy aliases.       |
| fax               |           16 | DONE   | 2026-11-03 | File/binary send, scheduling, results and explicit screen URLs.     |
| kakao             |           46 | DONE   | 2026-11-03 | Current notification/brand channels, templates, images and results. |
| homeTaxTaxInvoice |           19 | DONE   | 2026-11-03 | Job/authentication/subscription and collected-document APIs.        |
| homeTaxCashbill   |           15 | DONE   | 2026-11-03 | Job/authentication/subscription and collected-receipt APIs.         |
| easyFinBank       |           17 | DONE   | 2026-11-03 | Account management and collected bank transactions.                 |
| closedown         |            4 | DONE   | 2026-11-03 | Single/batch business status and pricing.                           |
| bizInfoCheck      |            3 | DONE   | 2026-11-03 | Company information and pricing.                                    |
| accountCheck      |            4 | DONE   | 2026-11-03 | Depositor name/identity and pricing.                                |

TaxInvoice also adds `getChargeInfo`, `getUnitCost` and `downloadInvoicePDF`. `DONE` records local checks and independent contract review at the listed date; live server execution is separate. Current method counts and DTO/compat mappings are generated from source in the [SDK reference](../sdk/README.md). See [service coverage](./service-coverage.md) for accepted differences and [validation history](./validation-history.md) for past execution results.

## Rules

- Every endpoint migration must update `status`, `updated_at`, and `notes` in the same commit.
- Raw API request/response types must be defined in `@connextable/popbill-spec`.
- Breaking change (2026-02-25): `@connextable/popbill-spec/tax-invoice/get-info` export is removed. Use `@connextable/popbill-spec/tax-invoice/shims`.

## Notes

- 2026-02-26: `@connextable/popbill` TaxInvoice facade v2 초안 반영.
  - compat 기반 런타임 브리지(`@connextable/popbill-compat/factory`) 연결.
  - modern 공개 메서드 46개를 `input` 단일 시그니처로 정리.
  - 네이밍 규칙(`get*`, `check*`) 및 공개 메서드 집합 상수/테스트 추가.
- 2026-05-15: 체크리스트를 실제 `TaxInvoiceService` 공개 메서드 46개 기준으로 갱신.
- 2026-11-02: `client.services.statement`의 공개 메서드 34개와 compat 브리지를 구현. 6종 문서유형·객체 기반 요청·응답 모델을 공개하고 기존 `TaxInvoiceStatementItemCodes` 호환을 유지.
- 2026-11-02: 공식 계약에 맞춰 SMS `messageBody`를 필수화하고 `SWBOX`의 이름을 `StatementBoxScopes.IssuedDocumentBox`로 명시.
- 2026-11-03: modern API의 호환 별칭을 제거하고 명세서 요약 매퍼를 `mappers/statement-info.ts`로 분리해 기존 세금계산서 매퍼 구조에 맞춤.
- 2026-11-03: 공통과 나머지 10개 서비스 및 세금계산서 3개를 추가. 13개 그룹을 client·공개 타입·문서 생성·예제에 연결하고, 새 modern API에 호환 별칭을 추가하지 않음.
