# 세금계산서

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#전자세금계산서-예제) · [API 레퍼런스](../sdk/popbill/tax-invoice/index.md)

`client.services.taxInvoice`에서 세금계산서를 등록·발행하고 상태·상세·국세청 처리 결과를 조회합니다. 먼저 [modern SDK 설정](../../packages/popbill/README.md)을 마치고 팝빌에 발행용 공동인증서를 등록합니다. 인증서 등록은 SDK가 제공하는 팝업 URL을 사용합니다.

## 발행과 상태 확인

문서관리번호를 발행 전에 저장하고 정발행·역발행·위수탁 흐름에 맞는 메서드를 선택합니다. 실행 가능한 문서 입력과 발행 예제는 [세금계산서 예제](../../examples/README.md#전자세금계산서-예제)에 있습니다. CLI의 조회·URL 시나리오도 필요한 문서를 먼저 발행할 수 있고 운영 모드를 허용하므로 실행할 시나리오의 준비 단계와 환경 설정을 확인합니다.

발행 응답을 받지 못하면 같은 관리번호로 먼저 조회합니다. 문서 발행과 국세청 전송·처리는 서로 다른 단계이므로 업무에 필요한 상태까지 확인한 뒤 후속 작업을 수행합니다. 다음은 이미 등록한 매출 문서의 조회 예제입니다.

```ts
const info = await client.services.taxInvoice.getInvoiceInfo({
  businessNumber: '1234567890',
  invoiceDocumentKeyType: 'SELL',
  invoiceManagementKey: 'EXISTING-INVOICE-001',
})
console.log(info)
```

응답의 코드·구분·플래그에는 새 값이나 `null`이 올 수 있습니다. 응답을 입력 타입으로 다시 가정하지 말고, 플래그는 `=== true`·`=== false`로 구분합니다. 전체 응답 타입과 이전 버전에서의 변경은 [2.0 이전 가이드](../migration/2.0.md)를 확인합니다.

## PDF와 인쇄

`downloadInvoicePDF`는 `{ fileData: Uint8Array }`로 PDF 원본 바이트를 반환합니다. JSON이나 base64 문자열로 해석하지 않습니다. 서버가 JSON 오류를 반환하면 일반 SDK 오류로 전달합니다.

```ts
const { fileData } = await client.services.taxInvoice.downloadInvoicePDF({
  businessNumber: '1234567890',
  invoiceDocumentKeyType: 'SELL',
  invoiceManagementKey: 'EXISTING-INVOICE-001',
  printCopy: 'supplier',
})
console.log(fileData.byteLength)
```

`printCopy`는 공급자용 `supplier` 또는 공급받는자용 `buyer`이며, 생략하면 두 사본을 모두 출력합니다. 매출 `SELL`·매입 `BUY`·위수탁 `TRUSTEE` 문서번호 유형을 받으며 실제 출력 권한은 서버가 판단합니다. 웹 인쇄용 URL은 목적별 URL 메서드를 사용합니다.

## 발행단가와 과금

`getUnitCost({ businessNumber })`는 `{ unitCost }`, `getChargeInfo`는 단가·과금방식·요금제를 반환합니다. 공식 단가 타입은 문자열이며, 소수점 표현을 보존하도록 숫자로 변환하지 않습니다. compat의 `getUnitCost`는 객체 대신 단가 필드를 바로 반환하고 `UserID` 인자를 받지 않습니다.

## 기존 코드 이전

compat는 기존 위치 인자와 callback·Promise 호출을 유지합니다. 다음 사항은 인자를 생략할 때 영향을 줍니다.

- 선택 인자 뒤에 `undefined`와 callback 하나를 전달하면 레거시 규칙상 오류 callback으로 해석될 수 있습니다. 성공 callback을 쓰려면 `(기본 인자..., undefined, successCallback, undefined)`처럼 두 callback 슬롯을 명시합니다.
- `send`의 선택 문자열 하나는 `UserID`입니다. 기본 사용자로 제목만 지정하려면 Promise에서 `send(corpNum, keyType, mgtKey, memo, emailSubject, undefined)`처럼 제목·사용자 슬롯을 모두 전달합니다.
- `register`의 `writeSpecification` 옵션과 `getPDF`의 출력 사본 옵션도 유지합니다. 전체 서명은 [compat 레퍼런스](../sdk/popbill-compat/taxinvoice/index.md)에서 확인합니다.

공개 문서에서 빠진 전송·승인·거부, 구형 인쇄, 이메일 공개키 조회도 공식 Node SDK의 요청 계약에 따라 제공합니다. 서버 지원 여부는 계정에서 확인해야 합니다. `getEmailPublicKeys`의 응답 스키마는 공개되어 있지 않아 modern은 `{ publicKeys: unknown }`으로 반환합니다. 사용하기 전에 응답 형태를 확인합니다.

공식 계약: [Node API](https://developers.popbill.com/reference/taxinvoice/node/api), [발행단가·과금](https://developers.popbill.com/reference/taxinvoice/node/common-api/point), [PDF](https://developers.popbill.com/en/api-reference/taxinvoice/api/info#GetPDF).
