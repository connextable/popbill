# 팩스 예제

`run-fax.ts`는 요청번호로 상태 조회, 파일 전송, 예약 취소를 실행합니다.

```sh
pnpm -C examples fax -- --help
```

공통 환경변수는 `POPBILL_LINK_ID`, `POPBILL_SECRET_KEY`, `POPBILL_CORP_NUM`, `POPBILL_USER_ID`입니다. `POPBILL_IS_TEST=true`, `POPBILL_RUN_FAX_EXAMPLES=true`로 실행을 켭니다.

| 모드     | 추가 환경변수                                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status` | `POPBILL_FAX_REQUEST_NUMBER`                                                                                                                      |
| `send`   | `POPBILL_ALLOW_FAX_SEND=true`, `POPBILL_FAX_REQUEST_NUMBER`, `POPBILL_FAX_SENDER_NUMBER`, `POPBILL_FAX_RECIPIENT_NUMBER`, `POPBILL_FAX_FILE_PATH` |
| `cancel` | `POPBILL_FAX_REQUEST_NUMBER`                                                                                                                      |

예약 전송은 `POPBILL_FAX_SCHEDULED_AT`에 `yyyyMMddHHmmss` 값을 설정합니다. 샌드박스에서도 실제 번호로 팩스가 전송될 수 있으므로 전송 모드는 별도 플래그를 요구합니다. 응답이 유실되면 같은 요청번호로 상태를 확인한 후 재시도 여부를 결정합니다.

접수·최종 결과의 차이와 레거시 호환 범위는 [팩스 가이드](../../../docs/services/fax.md)를 확인합니다.
