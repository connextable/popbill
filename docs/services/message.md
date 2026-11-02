# 문자

[문서 목록](../README.md) · [실행 예제](../../examples/src/message/README.md)

클라이언트의 `services.message`에서 사용합니다. 발신번호는 팝빌에 등록되어 있어야 합니다.

`sendShortMessage`, `sendLongMessage`, `sendAutoLengthMessage`, `sendImageMessage`는 `recipients`로 단건·동보·대량 전송을 지원합니다. 공통 `body`·`subject`·발신자 정보와 수신자별 재정의 정보를 함께 전달할 수 있습니다. 최대 1,000건이며, 예약 일시는 yyyyMMddHHmmss 문자열입니다.

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
```

이미지는 `image: { filePath }` 또는 `image: { fileName, fileData: Buffer }`로 전달합니다. 제공자 기준은 JPG/JPEG 1장, 최대 300KB이며, 가로·세로 1,000px 이하를 권장합니다.

접수번호 또는 사전에 저장한 요청번호로 결과를 조회하고 예약을 취소할 수 있습니다. 수신번호를 지정하면 예약 일부만 취소합니다. 전송 직후 결과가 확정되지 않을 수 있으므로 조회 시점은 호출자가 결정합니다. 응답을 받지 못했을 때는 저장한 요청번호로 접수 여부를 확인합니다.

조회 API는 발신번호 등록·목록, 문자 내역 검색, 문자함 URL, 080 수신거부 목록·번호, 유형별 단가·과금정보를 제공합니다. 원시 상태·결과코드는 문자열로 보존하며 알 수 없는 값을 성공 상태로 바꾸지 않습니다.

여러 접수번호의 상태를 한 번에 조회하려면 `getMessageStatesByReceiptNumbers({ businessNumber, receiptNumbers })`를 사용합니다. compat의 `getStates`와 같은 `POST /Message/States` 계약이며 단일 접수번호의 상세 목록 조회와 구분됩니다. 현행 문서에 응답 스키마가 없어 반환값 전체를 `unknown`으로 보존합니다. 필요한 필드를 사용하기 전에 호출자가 응답 형태를 확인합니다. 이 레거시 API의 실서버 지원 여부는 별도로 확인해야 합니다.

compat는 레거시 이름과 위치 인자, callback·Promise를 유지합니다. MMS 바이너리 입력에는 `sendMMSBinary`·`sendMMSBinary_multi`가 추가됩니다. 현재 공식 목록에 없는 `getURL`·`sendMessage`·`sendMessage_MMS`·`getStates`도 compat에서 유지합니다. modern은 같은 기능의 호환 별칭을 만들지 않고 목적별 URL·전송·상태 조회 메서드로 제공합니다.

예약 부분취소의 본문은 현재 HTTP 계약의 `{ receiveNum }` 객체로 보냅니다. 레거시 SDK가 수신번호를 JSON 문자열로 보내던 부분을 수정했으며 공개 위치 인자는 유지합니다.

근거: [Node 문자 API](https://developers.popbill.com/reference/sms/node/api), [HTTP 문자전송](https://developers.popbill.com/api-reference/sms/api/send), [HTTP 전송결과](https://developers.popbill.com/api-reference/sms/api/info).
