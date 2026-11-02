# 계좌 거래내역 조회

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#추가-서비스-예제)

`client.services.easyFinBank`는 계좌 등록·수정·삭제, 정액제 해지·해지취소, 거래내역 수집·상태·검색·합계·메모와 과금 정보를 제공합니다. compat의 `EasyFinBankService`는 기존 이름과 callback 및 위치 인자 Promise 호출을 유지합니다. modern에는 레거시 이름의 별칭이 없습니다.

## 수집 흐름

1. `registerBankAccount` 또는 `getBankAccountManagementURL`로 조회할 계좌를 등록합니다. 등록 시 지정한 정액제 이용기간에 따라 포인트가 차감됩니다.
2. `requestCollection`에 은행코드·계좌번호·조회 시작일·종료일을 전달하고 `collectionId`를 보관합니다. 최대 1개월 범위로 요청할 수 있고, 조회일로부터 최대 3개월 이전 내역까지 수집할 수 있습니다.
3. `getCollectionStatus`로 상태를 확인합니다. `stateCode=3`은 실패를 포함한 작업 완료입니다. `resultCode=1`도 충족해야 `isSuccessful=true`입니다.
4. 성공한 작업의 `collectionId`로 `searchTransactions`와 `summarizeTransactions`를 호출합니다. 검색 결과의 `transactionId`로 `saveTransactionMemo`를 호출할 수 있습니다.

작업 ID는 수집 요청 시점부터 1시간 동안 유효합니다. SDK는 자동 polling이나 실패·만료 작업의 자동 재요청을 수행하지 않습니다. 작업이 진행 중이면 상태를 다시 확인하고, 인증 실패는 계좌 정보를 수정한 뒤 새 작업을 요청합니다. 만료된 작업도 다시 요청해야 합니다.

## 계좌와 정액제

- `registerBankAccount`의 `subscriptionMonths`는 HTTP의 `UsePeriod` query로 전달됩니다. 기본값은 1개월이며 공식 지원 범위는 1~12개월입니다. 파트너 포인트 사용 시 입력과 관계없이 1개월 요금이 적용됩니다.
- 등록 정보에는 계좌 비밀번호·실명번호와 은행별 조건부 인증 정보가 필요합니다. 국민은행은 인터넷뱅킹 ID, 아이엠뱅크·신한은행·신협중앙회는 조회전용 ID와 비밀번호를 요구합니다.
- `requestBankAccountClosure`는 현재 공식 문서의 일반해지를 요청합니다. 이용기간 만료 후 해지되며 `cancelBankAccountClosure`로 해지요청을 취소할 수 있습니다. compat의 `closeBankAccount`는 기존 `중도`·`일반` 인자를 유지하지만 현재 문서는 일반해지만 안내합니다.
- `deleteBankAccount`는 종량제 계좌에 사용합니다. 정액제 계좌에는 해지요청을 사용합니다.
- 계좌 관리·정액제 신청 URL은 발급 후 30초 동안 사용할 수 있습니다.

## 계약과 데이터

- HTTP 문서는 `jobState`를 숫자, Node.js 문서는 문자열로 표시합니다. compat는 받은 값을 유지합니다. modern은 십진 정수 문자열을 안전한 정수로 표현할 수 있을 때만 `stateCode`의 숫자로 변환합니다. 빈 문자열·알 수 없는 문자열·`null`·안전 범위를 벗어난 정수 문자열은 보존하며 성공으로 판정하지 않습니다.
- 검색 결과의 입금액·출금액·잔액은 문자열 그대로 보존합니다. 합계 API의 금액과 건수는 공식 계약의 숫자 타입을 유지합니다.
- 은행별 비고 필드 네 개를 모두 보존합니다. 제공 내용은 은행 정책에 따라 달라질 수 있습니다.
- 검색 기본 페이지 크기는 500이며 최대 1,000입니다. `transactionTypes`의 `I`는 입금, `O`는 출금입니다. 필터를 생략하면 전체를 조회합니다.
- compat `updateBankAccount`는 계좌정보 객체 형식과 은행코드·계좌번호를 별도 인자로 받는 형식을 모두 지원합니다. 입력 객체는 변경하지 않습니다.
- compat callback 호출에서 마지막 옵션인 `search`의 `Order` 또는 `summary`의 `SearchString`에 `undefined`를 전달하면 성공·오류 callback 두 슬롯을 모두 명시합니다. 오류 callback을 생략하려면 마지막에 `undefined`를 전달합니다. `undefined` 바로 뒤의 단일 callback은 레거시와 동일하게 오류 callback으로 해석됩니다.
- 레거시 계좌 등록 구현에서 누락되던 `UsePeriod` query 전달을 공식 HTTP 계약에 맞게 수정했습니다.

## 예제와 검증

`examples/src/easy-fin-bank/run-easy-fin-bank.ts`의 `request`, `state`, `search`, `summary`를 순서에 맞게 실행합니다. `--help`로 환경변수를 확인할 수 있습니다. 실행하려면 `POPBILL_RUN_EASYFINBANK_EXAMPLES=true`, `POPBILL_IS_TEST=true`와 등록된 테스트 계좌가 필요합니다. 검색 예제는 거래 원문 대신 결과 건수만 출력합니다.

로컬 테스트는 HTTP mock으로 인증 scope, callback·Promise, 계좌 관리·수집·거래·정액제의 요청·응답을 검증합니다. 실제 계좌 등록·정액제 결제·은행 조회는 실행하지 않았습니다.

## 공식 근거

- [Node.js API 목록](https://developers.popbill.com/reference/easyfinbank/node/api)
- [계좌 관리](https://developers.popbill.com/api-reference/easyfinbank/api/manage)
- [수집 요청·상태](https://developers.popbill.com/api-reference/easyfinbank/api/job)
- [거래 검색·합계·메모](https://developers.popbill.com/api-reference/easyfinbank/api/search)
- [정액제·과금](https://developers.popbill.com/api-reference/easyfinbank/common-api/point)
