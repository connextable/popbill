# 카카오톡 예제

[공통 준비](../../README.md#공통-준비)를 마치고 `examples/.env`에 `POPBILL_RUN_KAKAO_EXAMPLES=true`를 설정합니다. 이 예제는 클라이언트를 테스트 환경으로 고정합니다. 모든 명령은 저장소 루트에서 실행합니다.

먼저 등록 채널과 승인된 알림톡 템플릿을 조회합니다.

```sh
pnpm -C examples kakao -- --help
pnpm -C examples kakao -- list
```

알림톡을 발송하려면 `POPBILL_RUN_KAKAO_SEND=true`, `POPBILL_KAKAO_TEMPLATE_CODE`, `POPBILL_KAKAO_RECEIVER_NUMBER`, `POPBILL_KAKAO_MESSAGE_BODY`를 설정합니다. 본문에는 승인 템플릿의 변수를 치환한 내용을 입력하고, 수신번호에는 직접 관리하는 테스트 번호를 사용합니다.

```sh
pnpm -C examples kakao -- send
```

예제는 발송 전에 요청번호를 출력하고 접수 후 같은 번호로 결과를 조회합니다. 요청번호를 보관하면 응답 유실 시 `getMessagesByRequestNumber`로 접수 여부를 확인할 수 있습니다. 접수 직후 결과는 최종 전송 결과가 아닐 수 있습니다.

이 CLI는 알림톡만 발송합니다. 친구톡·브랜드 메시지 사용법과 지원 범위는 [카카오톡 가이드](../../../docs/services/kakao.md)를 확인합니다.
