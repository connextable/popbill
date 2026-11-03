# 팩스

[문서 목록](../README.md) · [실행 예제](../../examples/src/fax/README.md) · [API 레퍼런스](../sdk/popbill/fax/index.md)

`client.services.fax`에서 파일을 전송하고 결과를 조회합니다. [modern SDK 설정](../../packages/popbill/README.md)을 마치고 팝빌에 발신번호를 등록합니다. 아래 예제의 사업자번호·전화번호·파일 경로는 테스트 환경 값으로 바꿉니다.

## 파일 전송과 접수 확인

요청번호는 전송 전에 저장합니다. 로컬 파일 경로는 `sendFaxFromPaths`, 파일명과 `Buffer`는 `sendFaxFromBinary`로 전달합니다. 한 요청의 파일 수는 1~30개이며 파일 배열의 순서대로 전송합니다.

```ts
const receipt = await client.services.fax.sendFaxFromPaths({
  businessNumber: '1234567890',
  requestNumber: 'FAX-ORDER-001',
  senderPhoneNumber: '07012345678',
  recipients: [{ phoneNumber: '0212345678', partnerReferenceKey: 'ORDER-001' }],
  filePaths: ['/path/to/document.pdf'],
})

const results = await client.services.fax.getFaxResultsByReceipt({
  businessNumber: '1234567890',
  receiptNumber: receipt.receiptNumber,
})
console.log(results)
```

접수번호는 요청이 접수됐음을 뜻합니다. 위 결과 조회 시점에는 전송이 진행 중일 수 있으므로 최종 결과가 될 때까지 호출자가 다시 조회합니다. 응답이 유실되면 저장한 요청번호로 `getFaxResultsByRequest`를 호출한 뒤 재시도 여부를 결정합니다.

## 예약·취소와 재전송

예약일시는 `scheduledAt`에 `yyyyMMddHHmmss` 형식으로 전달합니다. 취소는 접수번호 또는 요청번호에 맞는 예약취소 메서드를 사용합니다.

`resendFaxByReceipt`와 `resendFaxByRequest`는 기존 파일을 다시 전송합니다. 수신자 목록을 생략하면 원래 수신자를 유지하며, 수신자·발신자·예약일시를 바꿀 수도 있습니다. 재전송도 새 요청이므로 `newRequestNumber`를 저장하고 접수 결과를 확인합니다.

## 기존 코드 이전

compat는 레거시 이름과 위치 인자·옵션 객체를 유지합니다. 전체 호출 형식은 [compat 레퍼런스](../sdk/popbill-compat/fax/index.md)를 확인합니다. modern은 객체 인자와 목적별 URL 메서드를 사용합니다. 원본 SDK와의 차이는 [지원 범위](../migration/service-coverage.md)에 정리했습니다.

계약 근거: [팩스 전송](https://developers.popbill.com/api-reference/fax/api/send), [결과 조회](https://developers.popbill.com/api-reference/fax/api/info), [Node SDK](https://developers.popbill.com/reference/fax/node/api).
