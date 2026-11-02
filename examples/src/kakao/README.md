# 카카오톡 예제

`runKakaoExample()`은 테스트 환경에서 채널·승인 템플릿을 조회합니다.
`POPBILL_RUN_KAKAO_EXAMPLES=true`와 공통 인증 환경 변수가 필요합니다.

실제 알림톡 접수는 `POPBILL_RUN_KAKAO_SEND=true`일 때만 실행합니다.
`POPBILL_KAKAO_TEMPLATE_CODE`, `POPBILL_KAKAO_RECEIVER_NUMBER`,
`POPBILL_KAKAO_MESSAGE_BODY`를 지정하고 승인 템플릿의 변수를 치환한 본문을 입력합니다.
요청번호를 저장하면 응답 유실 시 `getMessagesByRequestNumber`로 결과를 조회할 수 있습니다.

브랜드 메시지는 채널 등록 상태·전송대상·수신동의·수신거부 번호 요건을 먼저 확인합니다.
이미지형은 해당 유형의 `uploadBrand…FromPath/FromBinary` 결과 URL을 사용합니다.

알림톡·브랜드 메시지와 레거시 친구톡의 지원 차이는 [카카오톡 가이드](../../../docs/services/kakao.md)를 확인합니다.
