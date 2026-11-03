# 팩스 예제

[공통 준비](../../README.md#공통-준비)를 마치고 `examples/.env`에 `POPBILL_RUN_FAX_EXAMPLES=true`를 설정합니다. 모든 명령은 저장소 루트에서 실행합니다.

`POPBILL_FAX_REQUEST_NUMBER`에 기존 전송의 요청번호를 입력하면 상태를 조회할 수 있습니다.

```sh
pnpm -C examples fax -- --help
pnpm -C examples fax -- status
```

파일을 발송하려면 새로운 요청번호와 함께 다음 값을 설정합니다.

- `POPBILL_ALLOW_FAX_SEND=true`: 발송 실행.
- `POPBILL_FAX_SENDER_NUMBER`: 발신번호.
- `POPBILL_FAX_RECIPIENT_NUMBER`: 수신번호.
- `POPBILL_FAX_FILE_PATH`: 전송할 파일 경로. 상대 경로는 `examples` 디렉터리를 기준으로 해석합니다.

예약 전송은 `POPBILL_FAX_SCHEDULED_AT`에 `yyyyMMddHHmmss` 값을 설정합니다. 샌드박스에서도 실제 번호로 팩스가 전송될 수 있습니다.

```sh
pnpm -C examples fax -- send
```

응답이 유실되면 같은 요청번호로 `status`를 실행해 접수 여부를 확인합니다. 예약을 취소하려면 해당 요청번호를 유지한 채 실행합니다.

```sh
pnpm -C examples fax -- cancel
```

접수·최종 결과의 차이와 레거시 호환 범위는 [팩스 가이드](../../../docs/services/fax.md)를 확인합니다.
