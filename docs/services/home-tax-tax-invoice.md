# 홈택스 세금계산서 수집

[문서 목록](../README.md) · [실행 예제](../../examples/src/home-tax-tax-invoice/README.md)

`client.services.homeTaxTaxInvoice`는 인증서·부서사용자 관리, 수집 작업 요청, 상태·목록 확인, 검색·합계·상세·XML, 팝업·인쇄와 정액제 과금 정보를 제공합니다. compat의 `HTTaxinvoiceService`는 기존 이름과 callback 및 위치 인자 Promise 호출을 유지합니다. modern에는 레거시 이름의 별칭이 없습니다.

## 수집 흐름

1. 공동인증서 또는 홈택스 전자세금계산서 부서사용자를 등록합니다.
2. `requestCollection`으로 최대 3개월 범위의 수집을 요청하고 `jobId`를 보관합니다.
3. `getCollectionState`로 상태를 확인합니다. 상태 3은 작업 완료를 뜻하며, 결과코드도 1이어야 `isSearchable`이 true입니다.
4. 성공한 작업 ID로 `searchTaxInvoices`, `getTaxInvoiceTotals`를 호출합니다.
5. 상세·XML·팝업·인쇄는 검색 결과의 `confirmationNumber`로 요청합니다.

작업 ID는 요청 시점부터 1시간 동안 유효합니다. SDK는 자동 polling이나 실패·만료 작업의 자동 재요청을 수행하지 않습니다. 인증 실패·수집 실패·작업 만료는 호출자가 구분해 처리합니다.

## 계약 차이

- HTTP 문서는 `jobState`를 숫자, Node.js 문서는 문자열로 표시합니다. compat는 받은 값을 유지합니다. modern은 십진 정수 문자열을 안전한 정수로 표현할 수 있을 때만 `stateCode`의 숫자로 변환합니다. 빈 문자열·알 수 없는 문자열·`null`·안전 범위를 벗어난 정수 문자열은 보존하며 성공으로 판정하지 않습니다.
- 검색·상세 금액은 문자열 그대로 유지합니다. 합계 API는 공식 계약에 따라 숫자로 반환합니다.
- XML API 응답은 JSON 객체입니다. modern은 `ResultCode`, `Message`, `retObject`를 `resultCode`, `resultMessage`, `xml`로 변환합니다.
- 부서사용자 `identityNumber`는 2차인증이 설정된 경우 대표자 주민번호 앞 7자리입니다. 해제된 경우 생략하거나 빈 문자열을 전달합니다.
- compat `registDeptUser(CorpNum, DeptUserID, DeptUserPWD, UserID)`의 짧은 형식은 유지합니다. 2차인증 번호를 전달할 때에는 `registDeptUser(CorpNum, DeptUserID, DeptUserPWD, IdentityNum, UserID)` 전체 형식을 사용합니다.
- 검색 기본 페이지 크기는 500이며 최대 1,000입니다. 종사업장번호와 금액의 선행 0·부호를 보존합니다.

## 공식 근거

- [Node.js API 목록](https://developers.popbill.com/reference/httaxinvoice/node/api)
- [수집 요청·상태](https://developers.popbill.com/api-reference/httaxinvoice/api/job)
- [검색·합계·상세·XML·보기](https://developers.popbill.com/api-reference/httaxinvoice/api/search)
- [인증 관리](https://developers.popbill.com/api-reference/httaxinvoice/api/cert)
- [정액제·과금](https://developers.popbill.com/api-reference/httaxinvoice/common-api/point)

로컬 검증은 HTTP mock 기반입니다. 실제 홈택스 수집과 인증서·부서사용자 등록은 실행하지 않습니다.
