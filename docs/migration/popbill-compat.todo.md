# Popbill Compat SDK Migration TODO

## Guide

이 문서는 `@connextable/popbill-compat` 마이그레이션의 진행 이력입니다. 체크리스트의 개수·`DONE`·날짜는 당시 구현·로컬 검증 상태이며 이후 변경의 결과를 뜻하지 않습니다. 현재 지원 범위는 [계약 기록](./service-coverage.md), 현재 메서드 수·서명·분류·순서는 [생성 레퍼런스](../sdk/README.md)를 확인합니다.

- 목적: 서비스/메서드별 진행 추적
- 범위: legacy 호환 계층의 구현 상태 관리
- 비목적: 최종 사용자 API 사용 가이드 제공

최신 메서드/타입은 아래 경로를 우선 확인합니다.

- SDK 생성 문서: [`docs/sdk`](../sdk) (`pnpm docs:generate`로 재생성)
- 소스 코드: [`packages/popbill-compat/src/services`](../../packages/popbill-compat/src/services)
- 스펙 타입: [`packages/popbill-spec/src`](../../packages/popbill-spec/src)

관련 진입 문서:

- 루트 README: [`README.md`](../../README.md)
- 패키지 README: [`packages/popbill-compat/README.md`](../../packages/popbill-compat/README.md)
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

| service             | method_count | status | owner | updated_at | notes                                                                                                                                            |
| ------------------- | -----------: | ------ | ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| TaxinvoiceService   |           55 | DONE   | TBD   | 2026-11-03 | All 55 methods, legacy register flag, callback-overload fixes, decimal pricing and binary PDF implemented and locally reviewed.                  |
| StatementService    |           34 | DONE   | TBD   | 2026-11-02 | All 34 legacy methods implemented with typed callback/promise/factory APIs. Local tests, typecheck, and lint passed; live integration is opt-in. |
| CashbillService     |           33 | DONE   | TBD   | 2026-11-03 | Typed callback/promise/factory runtime, modern facade, local contract tests and independent review.                                              |
| MessageService      |           29 | DONE   | TBD   | 2026-11-03 | Legacy 27 methods plus 2 binary MMS methods. Current partial-cancellation and search contracts verified locally.                                 |
| KakaoService        |           53 | DONE   | TBD   | 2026-11-03 | Legacy 28 methods plus 25 brand-message APIs. Current document models, scopes and overloads reviewed.                                            |
| FaxService          |           17 | DONE   | TBD   | 2026-11-03 | File/binary sends, scheduling, cancellation, results and pricing. Legacy forwarding defects corrected.                                           |
| HTTaxinvoiceService |           19 | DONE   | TBD   | 2026-11-03 | Jobs, search, summaries, detail/XML, authentication and subscription APIs.                                                                       |
| HTCashbillService   |           15 | DONE   | TBD   | 2026-11-03 | Jobs, search, summaries, authentication and subscription APIs.                                                                                   |
| ClosedownService    |            4 | DONE   | TBD   | 2026-11-03 | Single/batch business status and pricing, nullable provider values preserved.                                                                    |
| BizInfoCheckService |            3 | DONE   | TBD   | 2026-11-03 | Company information and pricing APIs.                                                                                                            |
| EasyFinBankService  |           17 | DONE   | TBD   | 2026-11-03 | Account management, jobs, transactions and pricing. Duplicate legacy getChargeInfo counted once.                                                 |
| AccountCheckService |            4 | DONE   | TBD   | 2026-11-03 | Depositor name/identity and pricing APIs.                                                                                                        |
| CommonService       |           27 | DONE   | TBD   | 2026-11-03 | Member/contact/company, Linkhub points, payment/refund and URL APIs inherited by all published factories.                                        |

`DONE` records implementation, local contract validation and independent review at the listed date. Live server operations have not been executed. Current method counts are generated from source in the [SDK reference](../sdk/README.md); historical execution results are recorded separately in [validation history](./validation-history.md).

`LEGACY_ONLY` in the method checklist identifies an API whose contract comes from the legacy SDK rather than the current provider documentation. It does not mean the capability is exclusive to compat; modern now exposes those capabilities with object inputs. See [service coverage](./service-coverage.md) for the current mapping.

## TaxinvoiceService Method Checklist

| service           | method                   | scope       | status | owner | updated_at | notes                                                                                                         |
| ----------------- | ------------------------ | ----------- | ------ | ----- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| TaxinvoiceService | getChargeInfo            | DOC_BASED   | DONE   | TBD   | 2026-11-03 | Current charge-info object, preserving unitCost as a string.                                                  |
| TaxinvoiceService | getUnitCost              | DOC_BASED   | DONE   | TBD   | 2026-11-03 | Current decimal-string contract; no UserID parameter.                                                         |
| TaxinvoiceService | getCertificateExpireDate | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getTaxCertInfo           | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | checkMgtKeyInUse         | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | register                 | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | update                   | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | delete                   | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getInfo                  | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getInfos                 | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getDetailInfo            | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getXML                   | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getLogs                  | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | attachFileBinary         | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | attachFile               | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getFiles                 | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | deleteFile               | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | send                     | LEGACY_ONLY | DONE   | TBD   | 2026-11-03 | Official SDK SEND request; short/full legacy arguments preserved. Live support unverified.                    |
| TaxinvoiceService | cancelSend               | LEGACY_ONLY | DONE   | TBD   | 2026-11-03 | Official SDK CANCELSEND request. Live support unverified.                                                     |
| TaxinvoiceService | accept                   | LEGACY_ONLY | DONE   | TBD   | 2026-11-03 | Official SDK ACCEPT request. Live support unverified.                                                         |
| TaxinvoiceService | deny                     | LEGACY_ONLY | DONE   | TBD   | 2026-11-03 | Official SDK DENY request. Live support unverified.                                                           |
| TaxinvoiceService | issue                    | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented with legacy overload parsing (`ISSUE`).                                           |
| TaxinvoiceService | cancelIssue              | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`CANCELISSUE`).                                                                  |
| TaxinvoiceService | registRequest            | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | request                  | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | cancelRequest            | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | refuse                   | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | sendToNTS                | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getSendToNTSConfig       | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | sendEmail                | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | sendSMS                  | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | sendFAX                  | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getURL                   | LEGACY_ONLY | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`GET /Taxinvoice?TG={TOGO}`) with legacy overload parsing and `string` URL 반환. |
| TaxinvoiceService | getPopUpURL              | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=POPUP`), returns legacy `string` URL.                                       |
| TaxinvoiceService | getViewURL               | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=VIEW`), returns legacy `string` URL.                                        |
| TaxinvoiceService | getPrintURL              | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=PRINT`), returns legacy `string` URL.                                       |
| TaxinvoiceService | getPDFURL                | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=PDF`), returns legacy `string` URL.                                         |
| TaxinvoiceService | getOldPrintURL           | LEGACY_ONLY | DONE   | TBD   | 2026-11-03 | Official SDK PRINTOLD URL; live support unverified.                                                           |
| TaxinvoiceService | getMassPrintURL          | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`POST /Taxinvoice/{MgtKeyType}?Print`), returns legacy `string` URL.             |
| TaxinvoiceService | getEPrintURL             | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=EPRINT`), returns legacy `string` URL.                                      |
| TaxinvoiceService | getMailURL               | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented (`?TG=MAIL`), returns legacy `string` URL.                                        |
| TaxinvoiceService | getEmailPublicKeys       | LEGACY_ONLY | DONE   | TBD   | 2026-11-03 | Official SDK endpoint; undocumented response preserved as unknown.                                            |
| TaxinvoiceService | getPDF                   | DOC_BASED   | DONE   | TBD   | 2026-11-03 | Binary Buffer, optional supplier/buyer print-copy selection.                                                  |
| TaxinvoiceService | search                   | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | registIssue              | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | bulkSubmit               | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getBulkResult            | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | attachStatement          | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | detachStatement          | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | checkCertValidation      | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | assignMgtKey             | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | listEmailConfig          | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | updateEmailConfig        | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getSealURL               | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |
| TaxinvoiceService | getTaxCertURL            | DOC_BASED   | DONE   | TBD   | 2026-02-25 | Runtime mapping implemented.                                                                                  |

## StatementService Method Checklist

callback·promise·factory의 34개 메서드 모두 런타임 매핑을 구현했습니다. 문서유형 코드는 `121`~`126`입니다. `DONE`은 로컬 테스트·타입 검사·린트까지 확인한 상태이며, 실서버 통합 테스트는 환경변수 설정 시 별도로 실행합니다.

`DOC_BASED` 범위는 [공식 전자명세서 Node SDK 문서](https://developers.popbill.com/reference/statement/node/api/etc)를 기준으로 합니다. 파일경로·binary 첨부와 저장 없이 FAX 전송하는 `FAXSend`도 포함합니다.

| service          | method            | scope     | status | owner | updated_at | notes                                                              |
| ---------------- | ----------------- | --------- | ------ | ----- | ---------- | ------------------------------------------------------------------ |
| StatementService | getChargeInfo     | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/ChargeInfo/{ItemCode}`.                            |
| StatementService | getUnitCost       | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/{ItemCode}?cfg=UNITCOST` → string.                 |
| StatementService | checkMgtKeyInUse  | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/{ItemCode}/{MgtKey}` → boolean.                    |
| StatementService | register          | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement`.                                                 |
| StatementService | update            | DOC_BASED | DONE   | TBD   | 2026-11-02 | `PATCH /Statement/{ItemCode}/{MgtKey}`.                            |
| StatementService | issue             | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}/{MgtKey}` (`ISSUE`).                   |
| StatementService | cancel            | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}/{MgtKey}` (`CANCEL`).                  |
| StatementService | delete            | DOC_BASED | DONE   | TBD   | 2026-11-02 | `DELETE /Statement/{ItemCode}/{MgtKey}`.                           |
| StatementService | getURL            | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement?TG={TBOX\|SWBOX}` → string.                        |
| StatementService | sendEmail         | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}/{MgtKey}` (`EMAIL`).                   |
| StatementService | sendSMS           | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}/{MgtKey}` (`SMS`).                     |
| StatementService | sendFAX           | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}/{MgtKey}` (`FAX`).                     |
| StatementService | getDetailInfo     | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/{ItemCode}/{MgtKey}?Detail`.                       |
| StatementService | getInfo           | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/{ItemCode}/{MgtKey}`.                              |
| StatementService | getInfos          | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}`.                                      |
| StatementService | getLogs           | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/{ItemCode}/{MgtKey}/Logs`.                         |
| StatementService | getPopUpURL       | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET` document URL (`TG=POPUP`) → string.                          |
| StatementService | getViewURL        | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET` document URL (`TG=VIEW`) → string.                           |
| StatementService | getPrintURL       | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET` document URL (`TG=PRINT`) → string.                          |
| StatementService | getEPrintURL      | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET` document URL (`TG=EPRINT`) → string.                         |
| StatementService | getMailURL        | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET` document URL (`TG=MAIL`) → string.                           |
| StatementService | getMassPrintURL   | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}?Print` → string.                       |
| StatementService | attachFileBinary  | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST` multipart `/Statement/{ItemCode}/{MgtKey}/Files`.           |
| StatementService | attachFile        | DOC_BASED | DONE   | TBD   | 2026-11-02 | Read file path and delegate to binary upload.                      |
| StatementService | getFiles          | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/{ItemCode}/{MgtKey}/Files`.                        |
| StatementService | deleteFile        | DOC_BASED | DONE   | TBD   | 2026-11-02 | `DELETE /Statement/{ItemCode}/{MgtKey}/Files/{FileID}`.            |
| StatementService | FAXSend           | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement` (`FAX`).                                         |
| StatementService | registIssue       | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement` (`ISSUE`).                                       |
| StatementService | search            | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/Search` with search query.                         |
| StatementService | attachStatement   | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}/{MgtKey}/AttachStmt`.                  |
| StatementService | detachStatement   | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/{ItemCode}/{MgtKey}/DetachStmt`.                  |
| StatementService | getSealURL        | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Member?TG=SEAL` → string.                                    |
| StatementService | listEmailConfig   | DOC_BASED | DONE   | TBD   | 2026-11-02 | `GET /Statement/EmailSendConfig`.                                  |
| StatementService | updateEmailConfig | DOC_BASED | DONE   | TBD   | 2026-11-02 | `POST /Statement/EmailSendConfig` with query `EmailType`/`SendYN`. |

## Rules

- Add method-level rows under each service section as interfaces are defined.
- Keep callback and promise signatures aligned for migrated methods.

## Notes

- 2026-05-15: `TaxinvoiceService` method count를 `TAXINVOICE_METHODS` 기준 55개로 정정.
- 2026-11-02: `StatementService`의 실제 공개 메서드 34개를 모두 구현하고 callback·promise·factory 진입점을 연결. 공통 회원·포인트 API는 이번 전자명세서 범위에서 제외.
- 2026-11-02: 레거시·공식 문서 재대조로 검색의 생략된 페이지 인자와 명시적 `undefined` 콜백 타입을 보완. 파일명 따옴표·개행을 multipart 규칙대로 처리하고 Node 22 파싱을 막는 끝 세미콜론을 제거.
- 2026-11-03: legacy 메서드 이름·타입·인자 계약을 유지하면서 `runtime/methods`의 API별 요청과 `runtime/parsers`로 분리. factory도 기존 세금계산서의 runtime 연결 방식에 맞춤.
- 2026-11-03: 추가 10개 서비스와 공통 27개를 구현. 문자 바이너리 2개·카카오 브랜드 25개를 포함해 compat 전체 310개 메서드를 문서 생성에 연결. 공통 API의 이전 제외 결정은 이번 전체 확장 범위로 대체.
- 2026-11-03: 세금계산서 55개 원형·콜백을 재대조해 오류 전용 콜백 전달과 register의 writeSpecification 인자를 복구. 입력 객체는 수정하지 않으며, 과거에 잘못 허용한 모호한 콜백 타입은 실제 레거시 arity에 맞춤.
