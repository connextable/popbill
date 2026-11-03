# 현금영수증

[문서 목록](../README.md) · [실행 예제](../../examples/src/cashbill/README.md) · [API 레퍼런스](../sdk/popbill/cashbill/index.md)

`client.services.cashbill`에서 승인·취소거래를 발행하고 상태·상세·국세청 처리 결과를 조회합니다. 아래 예제는 [modern SDK 설정](../../packages/popbill/README.md)을 마친 클라이언트를 사용합니다. 사업자번호·구매자 식별번호는 테스트 환경 값으로 바꿉니다.

## 승인거래 발행

승인 발행 시 문서관리번호는 호출 전에 보관합니다. 통신 실패 시 같은 내용을 다시 발행하기 전에 관리번호로 상태를 확인합니다. 금액과 식별번호는 문자열로 전달하며, 문자열의 0과 선행 0을 SDK가 숫자로 변환하지 않습니다.

```ts
const result = await client.services.cashbill.issueCashbillImmediately({
  businessNumber: '1234567890',
  document: {
    managementKey: 'CASH-20261103-001',
    transactionType: '승인거래',
    usageType: '소득공제용',
    taxType: '과세',
    merchant: { businessNumber: '1234567890' },
    buyer: { identificationNumber: '0100001234' },
    payment: { totalAmount: '11000', supplyCostAmount: '10000', taxAmount: '1000', serviceFeeAmount: '0' },
    sendTextMessage: false,
  },
})
```

반환되는 `resultCode`·`resultMessage`로 처리 결과를 확인합니다. 이후 상태·상세 조회에는 발행 전에 저장한 `managementKey`를 사용합니다.

## 승인거래 취소

국세청 승인거래를 취소하려면 새 관리번호와 원본 거래의 승인번호·거래일자를 사용합니다. `cancelIssuedCashbill`은 레거시 발행취소 기능이며, 승인거래를 취소거래로 발행하는 `revokeCashbill`과 목적이 다릅니다. 다음은 앞서 발행한 거래의 일부 금액을 취소하는 예제입니다.

```ts
if (!result.confirmationNumber || !result.transactionDate) {
  throw new Error('원본 거래의 승인번호와 거래일자를 확인해야 합니다.')
}

await client.services.cashbill.revokeCashbill({
  businessNumber: '1234567890',
  managementKey: 'CASH-20261103-CANCEL-001',
  originalConfirmationNumber: result.confirmationNumber,
  originalTransactionDate: result.transactionDate,
  cancellationReason: 1,
  partialCancellation: true,
  payment: { totalAmount: '1100', supplyCostAmount: '1000', taxAmount: '100', serviceFeeAmount: '0' },
})
```

## 초대량 발행과 출력

초대량 발행은 제출아이디를 저장한 뒤 `submitCashbills`로 문서 배열을 접수합니다. 접수 성공은 각 문서 발행 성공을 뜻하지 않습니다. `getCashbillBulkResult`의 처리상태와 개별 `issueResults`를 확인합니다. 한 번에 접수할 수 있는 문서 수는 [공식 발행 계약](https://developers.popbill.com/api-reference/cashbill/api/issue)을 따르며 서버가 검증합니다.

`downloadCashbillPDF`는 PDF `Buffer`를 반환합니다. `getCashbillPDFURL`은 다운로드 URL을 반환합니다. 보기·인쇄 URL은 유효기간이 짧으므로 필요할 때 새로 요청합니다.

## 기존 코드 이전

compat의 `search`는 `TradeOpt`·`QString`을 생략한 과거 형식을 인자 개수로 구분합니다. 전체 형식에서 선택 필드를 비울 때는 마지막 `UserID` 위치까지 유지합니다. modern은 객체 인자를 사용합니다. 전체 위치 인자는 [compat 레퍼런스](../sdk/popbill-compat/cashbill/index.md), 응답의 미확정 코드·플래그는 [2.0 이전 가이드](../migration/2.0.md#응답-코드와-미확정-값)를 확인합니다.

- [공식 Node API](https://developers.popbill.com/reference/cashbill/node/api)
- [공식 HTTP 발행 계약](https://developers.popbill.com/api-reference/cashbill/api/issue)
- [공식 HTTP 조회 계약](https://developers.popbill.com/api-reference/cashbill/api/info)
- [공식 PDF 바이너리 계약](https://developers.popbill.com/en/api-reference/cashbill/api/info#GetPDF)
