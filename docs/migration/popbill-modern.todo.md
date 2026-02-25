# Popbill Modern SDK Migration TODO

## Status Legend
- `NOT_STARTED`
- `IN_PROGRESS`
- `DONE`
- `BLOCKED`

## Endpoint Checklist
| service | endpoint | status | owner | updated_at | notes |
|---|---|---|---|---|---|
| tax-invoice | getInfo | DONE | TBD | 2026-02-25 | Existing modern SDK endpoint implementation is active. |
| tax-invoice | getInfos | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getDetailInfo | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getXML | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getLogs | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | search | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | checkMgtKeyInUse | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | register | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | update | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | issue | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | cancelIssue | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | registRequest | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | request | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | cancelRequest | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | refuse | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | delete | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | sendToNTS | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | registIssue | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | bulkSubmit | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getBulkResult | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getPopUpURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getViewURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getPrintURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getPDFURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getMassPrintURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getEPrintURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getMailURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getSealURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | attachFile | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getFiles | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | deleteFile | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | sendEmail | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | sendSMS | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | sendFAX | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | attachStatement | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | detachStatement | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | assignMgtKey | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | listEmailConfig | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | updateEmailConfig | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getSendToNTSConfig | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getTaxCertURL | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getCertificateExpireDate | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | checkCertValidation | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |
| tax-invoice | getTaxCertInfo | NOT_STARTED | TBD | 2026-02-25 | Spec scaffold is ready in `@connextable/popbill-spec`. |

## Rules
- Every endpoint migration must update `status`, `updated_at`, and `notes` in the same commit.
- Raw API request/response types must be defined in `@connextable/popbill-spec`.
- Breaking change (2026-02-25): `@connextable/popbill-spec/tax-invoice/get-info` export is removed. Use `@connextable/popbill-spec/tax-invoice/shims`.
