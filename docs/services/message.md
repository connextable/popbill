# 문자

[문서 목록](../README.md) · [실행 예제](../../examples/src/message/README.md) · [API 레퍼런스](../sdk/popbill/message/index.md)

`client.services.message`에서 문자를 전송합니다. [modern SDK 설정](../../packages/popbill/README.md)을 마치고 팝빌에 발신번호를 등록합니다. 아래의 사업자번호·발신번호·수신번호는 테스트 환경 값으로 바꿉니다.

## 문자 보내기

단문은 `sendShortMessage`, 장문은 `sendLongMessage`, 길이에 따른 자동 구분은 `sendAutoLengthMessage`, 이미지 문자는 `sendImageMessage`를 사용합니다. `recipients` 배열로 단건·동보·대량 전송을 지원하며 공통 본문과 수신자별 재정의를 함께 전달할 수 있습니다. 건수·이미지 제한은 [공식 문자전송 계약](https://developers.popbill.com/api-reference/sms/api/send)을 따릅니다.

전송 전에 `requestNumber`를 저장합니다. 다음 예제는 단문을 접수하고 접수번호로 결과를 조회합니다. 결과 조회 시점에는 전송이 진행 중일 수 있습니다.

```ts
const receipt = await client.services.message.sendShortMessage({
  businessNumber: '1234567890',
  requestNumber: 'DELIVERY-1',
  senderNumber: '07012345678',
  recipients: [{ receiverNumber: '01012345678', referenceKey: 'ORDER-1' }],
  body: '배송 안내',
})
const result = await client.services.message.getMessagesByReceiptNumber({
  businessNumber: '1234567890',
  receiptNumber: receipt.receiptNumber,
})
console.log(result)
```

이미지는 `image: { filePath }` 또는 `image: { fileName, fileData: Buffer }`로 전달합니다. 이미지 규격과 크기는 전송 전에 공식 계약을 확인합니다.

## 결과 확인과 예약 취소

접수번호 또는 사전에 저장한 요청번호로 결과를 조회하고 예약을 취소할 수 있습니다. 예약일시는 `reservedAt`에 `yyyyMMddHHmmss` 형식으로 전달하며, 수신번호를 지정하면 예약 일부만 취소합니다. 전송 직후 결과가 확정되지 않을 수 있으므로 조회 시점은 호출자가 결정합니다. 응답을 받지 못했을 때는 저장한 요청번호로 접수 여부를 확인합니다.

숫자 상태·결과코드는 문자열로 정규화하며 문자열의 선행 0과 새 코드는 유지합니다. `null`과 누락도 보존하므로 알려진 완료·성공 코드만 명시적으로 판단합니다. 발신번호 관리·문자 내역 검색·문자함 URL·080 수신거부·과금 조회는 [API 레퍼런스](../sdk/popbill/message/index.md)를 확인합니다.

여러 접수번호의 상태를 한 번에 조회하려면 `getMessageStatesByReceiptNumbers`에 `receiptNumbers` 배열을 전달합니다. 단일 접수번호의 상세 목록 조회와는 다른 레거시 API입니다. 공개 응답 스키마가 없어 반환값 전체가 `unknown`이므로 사용 전에 응답 형태를 확인합니다. 실제 계정의 지원 여부도 별도로 확인해야 합니다.

## 기존 코드 이전

compat는 레거시 이름과 위치 인자, callback·Promise를 유지합니다. MMS 바이너리 입력도 제공합니다. modern은 같은 기능의 호환 별칭을 만들지 않고 객체 인자와 목적별 메서드를 사용합니다. 전체 위치 인자는 [compat 레퍼런스](../sdk/popbill-compat/message/index.md)를 확인합니다.

원본 SDK와 의도적으로 다른 HTTP 요청·응답 처리와 호환 범위는 [지원 범위](../migration/service-coverage.md)에 정리했습니다.

근거: [Node 문자 API](https://developers.popbill.com/reference/sms/node/api), [HTTP 문자전송](https://developers.popbill.com/api-reference/sms/api/send), [HTTP 전송결과](https://developers.popbill.com/api-reference/sms/api/info).
