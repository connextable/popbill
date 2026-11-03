# 계좌 거래내역 조회

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#수집조회-예제) · [API 레퍼런스](../sdk/popbill/easy-fin-bank/index.md)

`client.services.easyFinBank`에서 계좌를 등록하고 거래내역을 수집·조회합니다. 먼저 [modern SDK 설정](../../packages/popbill/README.md)을 마칩니다. 수집할 계좌는 팝빌에 등록되어 있어야 하며, 실행 예제는 테스트 환경의 등록 계좌를 사용합니다. 계좌 등록·정액제 신청은 포인트 차감을 동반할 수 있습니다.

## 수집 흐름

1. `registerBankAccount` 또는 `getBankAccountManagementURL`로 조회할 계좌를 등록합니다. 등록 시 지정한 정액제 이용기간에 따라 포인트가 차감됩니다.
2. `requestCollection`에 은행코드·계좌번호·조회 시작일·종료일을 전달하고 `collectionId`를 보관합니다. 최대 1개월 범위로 요청할 수 있고, 조회일로부터 최대 3개월 이전 내역까지 수집할 수 있습니다.
3. `getCollectionStatus`로 상태를 확인합니다. `stateCode=3`은 실패를 포함한 작업 완료입니다. 결과코드도 성공을 뜻하는 1이어야 `isSuccessful === true`입니다.
4. 성공한 작업의 `collectionId`로 `searchTransactions`와 `summarizeTransactions`를 호출합니다. 검색 결과의 `transactionId`로 `saveTransactionMemo`를 호출할 수 있습니다.

작업 ID는 수집 요청 시점부터 1시간 동안 유효합니다. SDK는 자동 polling이나 실패·만료 작업의 자동 재요청을 수행하지 않습니다. 작업이 진행 중이면 상태를 다시 확인하고, 인증 실패는 계좌 정보를 수정한 뒤 새 작업을 요청합니다. 만료된 작업도 다시 요청해야 합니다.

## 계좌와 정액제

- `registerBankAccount`의 `subscriptionMonths`는 정액제 이용기간이며 기본값은 1개월입니다. 기간별 요금과 파트너 포인트 사용 조건은 [계좌 관리 계약](https://developers.popbill.com/api-reference/easyfinbank/api/manage)을 확인합니다.
- 등록 정보에는 계좌 비밀번호·실명번호와 은행별 조건부 인증 정보가 필요합니다. 국민은행은 인터넷뱅킹 ID, 아이엠뱅크·신한은행·신협중앙회는 조회전용 ID와 비밀번호를 요구합니다.
- `requestBankAccountClosure`는 현재 공식 문서의 일반해지를 요청합니다. 이용기간 만료 후 해지되며 `cancelBankAccountClosure`로 해지요청을 취소할 수 있습니다. compat의 `closeBankAccount`는 기존 `중도`·`일반` 인자를 유지하지만 현재 문서는 일반해지만 안내합니다.
- `deleteBankAccount`는 종량제 계좌에 사용합니다. 정액제 계좌에는 해지요청을 사용합니다.
- 계좌 관리·정액제 신청 URL은 유효기간이 짧으므로 사용할 때 새로 요청합니다.

## 거래 데이터와 검색

- 작업 상태는 숫자와 숫자 문자열을 수용하며 새 코드와 `null`을 보존합니다. 성공 여부는 코드 자체의 참·거짓 대신 `isSuccessful === true`로 확인합니다.
- 검색 결과의 입금액·출금액·잔액은 문자열 그대로 보존합니다. 합계 API의 금액과 건수는 공식 계약의 숫자 타입을 유지합니다.
- 은행별 비고 필드 네 개를 모두 보존합니다. 제공 내용은 은행 정책에 따라 달라질 수 있습니다.
- 검색 기본 페이지 크기는 500이며 상한은 서버가 검증합니다. `transactionTypes`의 `I`는 입금, `O`는 출금입니다. 필터를 생략하면 전체를 조회합니다.

## 기존 코드 이전

- compat `updateBankAccount`는 계좌정보 객체 형식과 은행코드·계좌번호를 별도 인자로 받는 형식을 모두 지원합니다. 입력 객체는 변경하지 않습니다.
- compat callback 호출에서 마지막 옵션인 `search`의 `Order` 또는 `summary`의 `SearchString`에 `undefined`를 전달하면 성공·오류 callback 두 슬롯을 모두 명시합니다. 오류 callback을 생략하려면 마지막에 `undefined`를 전달합니다. `undefined` 바로 뒤의 단일 callback은 레거시와 동일하게 오류 callback으로 해석됩니다.

전체 위치 인자는 [compat 레퍼런스](../sdk/popbill-compat/easyfinbank/index.md), 응답의 미확정 값 처리와 버전 차이는 [2.0 이전 가이드](../migration/2.0.md#응답-코드와-미확정-값)를 확인합니다. 실행 모드와 환경변수는 [실행 예제](../../examples/README.md#수집조회-예제)에 정리했습니다.

## 공식 근거

- [Node.js API 목록](https://developers.popbill.com/reference/easyfinbank/node/api)
- [계좌 관리](https://developers.popbill.com/api-reference/easyfinbank/api/manage)
- [수집 요청·상태](https://developers.popbill.com/api-reference/easyfinbank/api/job)
- [거래 검색·합계·메모](https://developers.popbill.com/api-reference/easyfinbank/api/search)
- [정액제·과금](https://developers.popbill.com/api-reference/easyfinbank/common-api/point)
