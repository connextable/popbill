# Popbill Modern SDK Migration TODO

## Status Legend
- `NOT_STARTED`
- `IN_PROGRESS`
- `DONE`
- `BLOCKED`

## Endpoint Checklist
| service | endpoint | status | owner | updated_at | notes |
|---|---|---|---|---|---|
| tax-invoice | getInfo | DONE | TBD | 2026-02-25 | Existing implementation moved into workspace package. |
| tax-invoice | getInfos | NOT_STARTED | TBD | 2026-02-25 | Placeholder for next endpoint migration. |

## Rules
- Every endpoint migration must update `status`, `updated_at`, and `notes` in the same commit.
- Raw API request/response types must be defined in `@connextable/popbill-spec`.
