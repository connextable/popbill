# 현금영수증

[문서 목록](../README.md) · [실행 예제](../../examples/src/cashbill/README.md)

현재 공식 문서의 승인·취소발행, 초대량 접수, 상태·상세·목록, URL·인쇄, 메일·문자·팩스, 문서번호 할당, 메일 설정과 과금 API를 지원합니다. 레거시 임시저장·수정·저장문서 발행·발행취소·취소문서 임시저장·로그·수신자 인쇄·PDF 다운로드도 유지합니다.

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

국세청 승인거래를 취소하려면 새 관리번호와 원본 응답의 승인번호·거래일자를 사용합니다. `cancelIssuedCashbill`은 레거시 발행취소 기능이며, 승인거래를 취소거래로 발행하는 `revokeCashbill`과 목적이 다릅니다.

```ts
await client.services.cashbill.revokeCashbill({
  businessNumber: '1234567890',
  managementKey: 'CASH-20261103-CANCEL-001',
  originalConfirmationNumber: result.confirmationNumber!,
  originalTransactionDate: result.transactionDate!,
  cancellationReason: 1,
  partialCancellation: true,
  payment: { totalAmount: '1100', supplyCostAmount: '1000', taxAmount: '100', serviceFeeAmount: '0' },
})
```

초대량 접수는 제출아이디와 1~100개의 문서를 전달합니다. 접수 성공은 각 문서 발행 성공을 뜻하지 않습니다. `getCashbillBulkResult`의 처리상태와 개별 `issueResults`를 확인합니다. 서버에서 반환한 접수·처리·발행 시각을 그대로 보존하며, 레거시 SDK가 추가하던 현재 로컬 시각의 최상위 `issueDT`는 생성하지 않습니다. `registIssue` 역시 서버가 반환한 `tradeDT`를 삭제하지 않습니다.

`downloadCashbillPDF`는 PDF `Buffer`를 반환합니다. `getCashbillPDFURL`은 다운로드 URL을 반환합니다. 보기·인쇄 URL은 공식 계약상 30초 동안 유효하므로 필요할 때 새로 요청합니다.

Legacy `search`는 TradeOpt·QString을 생략한 과거 형식을 인자 개수로 구분합니다. modern은 항상 전체 인자 위치를 사용합니다. 전체 형식에서 선택 필드를 비울 때 compat 호출은 마지막 UserID 위치까지 유지해야 합니다.

- [공식 Node API](https://developers.popbill.com/reference/cashbill/node/api)
- [공식 HTTP 발행 계약](https://developers.popbill.com/api-reference/cashbill/api/issue)
- [공식 HTTP 조회 계약](https://developers.popbill.com/api-reference/cashbill/api/info)
- [공식 PDF 바이너리 계약](https://developers.popbill.com/en/api-reference/cashbill/api/info#GetPDF)
