# Popbill Modern SDK Migration TODO

## Guide

이 문서는 `@connextable/popbill` modern SDK 마이그레이션 진행 상태를 추적하기 위한 관리용 TODO입니다.

- 목적: 진행 추적
- 범위: endpoint별 상태/메모 관리
- 비목적: 사용자 사용 가이드 제공

최신 메서드/타입은 아래 경로를 우선 확인합니다.

- SDK 생성 문서: [`docs/sdk`](../sdk) (`pnpm docs:generate`로 재생성)
- 소스 코드: [`packages/popbill/src/services/tax-invoice`](../../packages/popbill/src/services/tax-invoice)
- 스펙 타입: [`packages/popbill-spec/src/tax-invoice`](../../packages/popbill-spec/src/tax-invoice)

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
