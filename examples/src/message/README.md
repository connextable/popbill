# 문자 예제

[공통 준비](../../README.md#공통-준비)를 마치고 `examples/.env`에 `POPBILL_RUN_MESSAGE_EXAMPLES=true`를 설정합니다. 모든 명령은 저장소 루트에서 실행합니다.

발신번호 목록부터 조회합니다.

```sh
pnpm -C examples message -- --help
pnpm -C examples message -- senders
```

단문을 발송하려면 등록된 발신번호를 `POPBILL_MESSAGE_SENDER_NUMBER`, 수신번호를 `POPBILL_MESSAGE_RECEIVER_NUMBER`에 입력하고 `POPBILL_RUN_MESSAGE_SEND=true`를 설정합니다. 샌드박스에서도 실제 번호로 문자가 전송될 수 있습니다.

```sh
pnpm -C examples message -- send
```

예제는 발송 전에 요청번호를 출력하고 접수 후 같은 번호로 결과를 조회합니다. 요청번호를 보관하면 응답 유실 시 `getMessagesByRequestNumber`로 접수 여부를 확인할 수 있습니다. 접수 직후에는 최종 전송 결과가 아직 없을 수 있습니다.

발송·조회 흐름과 레거시 계약 차이는 [문자 가이드](../../../docs/services/message.md)를 확인합니다.
