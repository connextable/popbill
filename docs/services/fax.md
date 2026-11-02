# 팩스

[문서 목록](../README.md) · [실행 예제](../../examples/src/fax/README.md)

`client.services.fax`는 경로·바이너리 파일 전송, 재전송, 예약 취소, 접수번호·요청번호별 결과, 발신번호 관리와 과금을 제공합니다. 전송 전에 팝빌에 발신번호를 등록합니다.

요청번호는 전송 전에 저장합니다. 접수번호는 요청이 접수됐음을 뜻하며, 최종 결과는 `getFaxResultsByReceipt` 또는 `getFaxResultsByRequest`로 확인합니다. 응답이 유실되면 저장한 요청번호로 접수 여부를 조회한 뒤 재시도 여부를 결정합니다. 예약 일시는 `yyyyMMddHHmmss` 형식입니다.

compat는 레거시의 `sendFax`, `sendFaxBinary`, `resendFax`, `resendFaxRN` 이름과 위치 인자·옵션 객체를 유지합니다. 레거시의 바이너리 파일 검사, 단건 수신자 번호·이름, 재전송 수신자·예약일시 처리 오류는 공식 요청 계약에 맞게 수정했습니다. modern에는 목적별 URL 메서드를 제공하며 범용 `getURL` 별칭은 추가하지 않았습니다.

계약 근거: [팩스 전송](https://developers.popbill.com/api-reference/fax/api/send), [결과 조회](https://developers.popbill.com/api-reference/fax/api/info), [Node SDK](https://developers.popbill.com/reference/fax/node/api).
