# Popbill Compat SDK Migration TODO

## Status Legend
- `NOT_STARTED`
- `IN_PROGRESS`
- `DONE`
- `BLOCKED`

## Service Checklist
| service | method_count | status | owner | updated_at | notes |
|---|---:|---|---|---|---|
| TaxinvoiceService | 56 | IN_PROGRESS | TBD | 2026-02-25 | Callback/Promise typed scaffold connected to `@connextable/popbill-spec`, runtime remains NotImplemented. |
| StatementService | 35 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| CashbillService | 33 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| MessageService | 27 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| KakaoService | 28 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| FaxService | 17 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| HTTaxinvoiceService | 19 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| HTCashbillService | 15 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| ClosedownService | 4 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| BizInfoCheckService | 3 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| EasyFinBankService | 18 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |
| AccountCheckService | 4 | IN_PROGRESS | TBD | 2026-02-25 | Service skeleton added with callback/promise stubs. |

## TaxinvoiceService Method Checklist
| service | method | scope | status | owner | updated_at | notes |
|---|---|---|---|---|---|---|
| TaxinvoiceService | getChargeInfo | LEGACY_ONLY | IN_PROGRESS | TBD | 2026-02-25 | `@deprecated` typed scaffold only. |
| TaxinvoiceService | getUnitCost | LEGACY_ONLY | IN_PROGRESS | TBD | 2026-02-25 | `@deprecated` typed scaffold only. |
| TaxinvoiceService | getCertificateExpireDate | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getTaxCertInfo | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | checkMgtKeyInUse | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | register | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | update | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | delete | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getInfo | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getInfos | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getDetailInfo | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getXML | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getLogs | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | attachFileBinary | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | attachFile | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getFiles | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | deleteFile | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | send | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | cancelSend | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | accept | LEGACY_ONLY | IN_PROGRESS | TBD | 2026-02-25 | `@deprecated` typed scaffold only. |
| TaxinvoiceService | deny | LEGACY_ONLY | IN_PROGRESS | TBD | 2026-02-25 | `@deprecated` typed scaffold only. |
| TaxinvoiceService | issue | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | cancelIssue | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | registRequest | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | request | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | cancelRequest | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | refuse | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | sendToNTS | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getSendToNTSConfig | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | sendEmail | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | sendSMS | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | sendFAX | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getURL | LEGACY_ONLY | IN_PROGRESS | TBD | 2026-02-25 | `@deprecated` typed scaffold only. |
| TaxinvoiceService | getPopUpURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getViewURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getPrintURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getPDFURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getOldPrintURL | LEGACY_ONLY | IN_PROGRESS | TBD | 2026-02-25 | `@deprecated` typed scaffold only. |
| TaxinvoiceService | getMassPrintURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getEPrintURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getMailURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getEmailPublicKeys | LEGACY_ONLY | IN_PROGRESS | TBD | 2026-02-25 | `@deprecated` typed scaffold only. |
| TaxinvoiceService | getPDF | LEGACY_ONLY | IN_PROGRESS | TBD | 2026-02-25 | `@deprecated` typed scaffold only. |
| TaxinvoiceService | search | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | registIssue | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | bulkSubmit | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getBulkResult | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | attachStatement | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | detachStatement | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | checkCertValidation | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | assignMgtKey | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | listEmailConfig | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | updateEmailConfig | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getSealURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |
| TaxinvoiceService | getTaxCertURL | DOC_BASED | IN_PROGRESS | TBD | 2026-02-25 | Typed scaffold only. |

## Rules
- Add method-level rows under each service section as interfaces are defined.
- Keep callback and promise signatures aligned for migrated methods.
