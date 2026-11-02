# 문자 예제

```sh
pnpm -C examples exec dotenvx run -- jiti src/message/run-message.ts --help
```

`senders`는 발신번호 목록을 조회합니다. 공통 설정 `POPBILL_LINK_ID`, `POPBILL_SECRET_KEY`, `POPBILL_CORP_NUM`, `POPBILL_USER_ID`와 `POPBILL_RUN_MESSAGE_EXAMPLES=true`, `POPBILL_IS_TEST=true`가 필요합니다.

`send`는 단문을 접수하고 요청번호로 결과를 조회합니다. 추가로 `POPBILL_RUN_MESSAGE_SEND=true`, `POPBILL_MESSAGE_SENDER_NUMBER`, `POPBILL_MESSAGE_RECEIVER_NUMBER`를 설정합니다. 실행 전에 출력된 요청번호를 보관하면 응답 유실 시 해당 번호로 접수 여부를 조회할 수 있습니다. 접수 직후에는 최종 전송 결과가 아직 없을 수 있습니다.

샌드박스에서도 실제 번호로 문자가 전송될 수 있습니다. 이 예제의 실제 전송은 로컬 검증 과정에서 실행하지 않았습니다.

발송·조회 흐름과 레거시 계약 차이는 [문자 가이드](../../../docs/services/message.md)를 확인합니다.
