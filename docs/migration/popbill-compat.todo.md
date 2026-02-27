# Popbill Compat SDK Migration TODO

## Guide

이 문서는 `@connextable/popbill-compat` 마이그레이션 진행 상태를 추적하기 위한 관리용 TODO입니다.

- 목적: 서비스/메서드별 진행 추적
- 범위: legacy 호환 계층의 구현 상태 관리
- 비목적: 최종 사용자 API 사용 가이드 제공

최신 메서드/타입은 아래 경로를 우선 확인합니다.

- SDK 생성 문서: [`docs/sdk`](../sdk) (`pnpm docs:generate`로 재생성)
- 소스 코드: [`packages/popbill-compat/src/services/taxinvoice`](../../packages/popbill-compat/src/services/taxinvoice)
- 스펙 타입: [`packages/popbill-spec/src/tax-invoice`](../../packages/popbill-spec/src/tax-invoice)

관련 진입 문서:

- 루트 README: [`README.md`](../../README.md)
- 예제 실행 가이드: [`examples/README.md`](../../examples/README.md)
- modern 추적 문서: [`docs/migration/popbill-modern.todo.md`](./popbill-modern.todo.md)

업데이트 원칙:

- 상태를 변경할 때 `status`, `updated_at`, `notes`를 같은 커밋에서 함께 갱신합니다.

## Status Legend

- `NOT_STARTED`
- `IN_PROGRESS`
- `DONE`
- `BLOCKED`

## Service Checklist

| service             | method_count | status      | owner | updated_at | notes                                                                                                                                                                                                                         |
| ------------------- | -----------: | ----------- | ----- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TaxinvoiceService   |           56 | IN_PROGRESS | TBD   | 2026-02-25 | Runtime implemented for all DOC_BASED required methods (46/46). Legacy-only extras remain stubbed (`getChargeInfo`, `getUnitCost`, `send`, `cancelSend`, `accept`, `deny`, `getOldPrintURL`, `getEmailPublicKeys`, `getPDF`). |
| StatementService    |           35 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| CashbillService     |           33 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| MessageService      |           27 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| KakaoService        |           28 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| FaxService          |           17 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| HTTaxinvoiceService |           19 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| HTCashbillService   |           15 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| ClosedownService    |            4 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| BizInfoCheckService |            3 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| EasyFinBankService  |           18 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |
| AccountCheckService |            4 | IN_PROGRESS | TBD   | 2026-02-25 | Service skeleton added with callback/promise stubs.                                                                                                                                                                           |

## TaxinvoiceService Method Checklist

| service           | method                   | scope       | status      | owner | updated_at | notes                                                                                                         |
| ----------------- | ------------------------ | ----------- | ----------- | ----- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| TaxinvoiceService | getChargeInfo            | LEGACY_ONLY | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | getUnitCost              | LEGACY_ONLY | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | getCertificateExpireDate | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getTaxCertInfo           | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | checkMgtKeyInUse         | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | register                 | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | update                   | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | delete                   | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getInfo                  | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getInfos                 | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getDetailInfo            | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getXML                   | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getLogs                  | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | attachFileBinary         | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | attachFile               | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getFiles                 | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | deleteFile               | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | send                     | DOC_BASED   | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | cancelSend               | DOC_BASED   | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | accept                   | LEGACY_ONLY | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | deny                     | LEGACY_ONLY | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | issue                    | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented with legacy overload parsing (`ISSUE`).                                           |
| TaxinvoiceService | cancelIssue              | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`CANCELISSUE`).                                                                  |
| TaxinvoiceService | registRequest            | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | request                  | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | cancelRequest            | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | refuse                   | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | sendToNTS                | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getSendToNTSConfig       | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | sendEmail                | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | sendSMS                  | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | sendFAX                  | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getURL                   | LEGACY_ONLY | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`GET /Taxinvoice?TG={TOGO}`) with legacy overload parsing and `string` URL 반환. |
| TaxinvoiceService | getPopUpURL              | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=POPUP`), returns legacy `string` URL.                                       |
| TaxinvoiceService | getViewURL               | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=VIEW`), returns legacy `string` URL.                                        |
| TaxinvoiceService | getPrintURL              | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=PRINT`), returns legacy `string` URL.                                       |
| TaxinvoiceService | getPDFURL                | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=PDF`), returns legacy `string` URL.                                         |
| TaxinvoiceService | getOldPrintURL           | LEGACY_ONLY | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | getMassPrintURL          | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`POST /Taxinvoice/{MgtKeyType}?Print`), returns legacy `string` URL.             |
| TaxinvoiceService | getEPrintURL             | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=EPRINT`), returns legacy `string` URL.                                      |
| TaxinvoiceService | getMailURL               | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=MAIL`), returns legacy `string` URL.                                        |
| TaxinvoiceService | getEmailPublicKeys       | LEGACY_ONLY | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | getPDF                   | LEGACY_ONLY | IN_PROGRESS | TBD   | 2026-02-25 | Typed scaffold only.                                                                                          |
| TaxinvoiceService | search                   | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | registIssue              | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | bulkSubmit               | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getBulkResult            | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | attachStatement          | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | detachStatement          | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | checkCertValidation      | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | assignMgtKey             | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | listEmailConfig          | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | updateEmailConfig        | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getSealURL               | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getTaxCertURL            | DOC_BASED   | DONE        | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |

## Rules

- Add method-level rows under each service section as interfaces are defined.
- Keep callback and promise signatures aligned for migrated methods.
