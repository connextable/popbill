# 홈택스 세금계산서 수집

[문서 목록](../README.md) · [실행 예제](../../examples/src/home-tax-tax-invoice/README.md) · [API 레퍼런스](../sdk/popbill/home-tax-tax-invoice/index.md)

`client.services.homeTaxTaxInvoice`에서 홈택스 세금계산서를 수집하고 검색·합계·상세를 조회합니다. [modern SDK 설정](../../packages/popbill/README.md)을 마친 뒤 `getAuthenticationRegistrationUrl`로 공동인증서를 등록하거나 `registerDepartmentUser`로 홈택스 부서사용자를 등록합니다. 정액제 신청과 상태 확인은 [API 레퍼런스](../sdk/popbill/home-tax-tax-invoice/index.md)를 확인합니다.

## 수집 흐름

1. `requestCollection`에 매출·매입·위수탁 구분과 검색 기준일자를 지정하고 `jobId`를 보관합니다.
2. `getCollectionState`로 상태를 확인합니다. 상태 3은 실패를 포함한 작업 완료이며, 결과코드가 성공을 뜻하는 1이어야 `isSearchable === true`입니다.
3. 성공한 작업 ID로 `searchTaxInvoices`, `getTaxInvoiceTotals`를 호출합니다.
4. 상세·XML·팝업·인쇄는 검색 결과의 `confirmationNumber`로 요청합니다.

다음 예제는 매출 세금계산서를 작성일자 기준으로 수집합니다. 상태가 아직 진행 중이면 같은 `jobId`로 나중에 다시 확인합니다.

```ts
const service = client.services.homeTaxTaxInvoice
const { jobId } = await service.requestCollection({
  businessNumber: '1234567890',
  startDate: '20260901',
  endDate: '20260930',
  invoiceDirection: 'SELL',
  searchDateType: 'W',
})
const state = await service.getCollectionState({ businessNumber: '1234567890', jobId })
if (state.isSearchable === true) {
  const result = await service.searchTaxInvoices({ businessNumber: '1234567890', jobId })
  console.log(result)
}
```

수집 기간은 최대 3개월이며 작업 ID는 요청 시점부터 1시간 동안 유효합니다. SDK는 자동 polling이나 실패·만료 작업의 자동 재요청을 수행하지 않습니다. 인증 실패는 인증정보를 수정한 뒤 새로 요청하고, 만료된 작업도 새 `jobId`를 보관합니다. 제공자의 기간·유효시간 조건은 [수집 계약](https://developers.popbill.com/api-reference/httaxinvoice/api/job)을 확인합니다.

## 조회 데이터와 인증 입력

- 작업 상태는 숫자와 숫자 문자열을 수용하며 새 코드와 `null`을 보존합니다. 성공 여부는 코드 자체의 참·거짓 대신 `isSearchable === true`로 확인합니다. 공통 처리 기준은 [2.0 이전 가이드](../migration/2.0.md#응답-코드와-미확정-값)에 있습니다.
- 검색·상세 금액은 문자열 그대로 유지합니다. 합계 API는 공식 계약에 따라 숫자로 반환합니다.
- XML API 응답은 JSON 객체입니다. modern은 `ResultCode`, `Message`, `retObject`를 `resultCode`, `resultMessage`, `xml`로 변환합니다.
- 부서사용자 `identityNumber`는 2차인증이 설정된 경우 대표자 주민번호 앞 7자리입니다. 해제된 경우 생략하거나 빈 문자열을 전달합니다.
- 검색 기본 페이지 크기는 500이며 상한은 서버가 검증합니다. 종사업장번호와 금액의 선행 0·부호를 보존합니다.

## 기존 코드 이전

compat `registDeptUser(CorpNum, DeptUserID, DeptUserPWD, UserID)`의 짧은 형식은 유지합니다. 2차인증 번호를 전달할 때에는 `registDeptUser(CorpNum, DeptUserID, DeptUserPWD, IdentityNum, UserID)` 전체 형식을 사용합니다. 다른 위치 인자는 [compat 레퍼런스](../sdk/popbill-compat/httaxinvoice/index.md)를 확인합니다.

## 공식 근거

- [Node.js API 목록](https://developers.popbill.com/reference/httaxinvoice/node/api)
- [수집 요청·상태](https://developers.popbill.com/api-reference/httaxinvoice/api/job)
- [검색·합계·상세·XML·보기](https://developers.popbill.com/api-reference/httaxinvoice/api/search)
- [인증 관리](https://developers.popbill.com/api-reference/httaxinvoice/api/cert)
- [정액제·과금](https://developers.popbill.com/api-reference/httaxinvoice/common-api/point)
