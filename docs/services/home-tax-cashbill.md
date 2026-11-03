# 홈택스 현금영수증 수집

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#수집조회-예제) · [API 레퍼런스](../sdk/popbill/home-tax-cashbill/index.md)

`client.services.homeTaxCashbill`에서 매입·매출 현금영수증을 수집하고 검색·집계합니다. [modern SDK 설정](../../packages/popbill/README.md)을 마친 뒤 `getAuthenticationRegistrationUrl`로 인증정보를 등록하거나 `registerDepartmentUser`로 홈택스 부서사용자를 등록합니다. 정액제 신청·상태도 [API 레퍼런스](../sdk/popbill/home-tax-cashbill/index.md)에서 확인합니다.

## 수집 요청과 결과 조회

다음 예제는 매출 현금영수증의 수집 작업을 요청하고 결과를 조회합니다. 상태가 아직 진행 중이면 같은 `jobId`로 나중에 다시 확인합니다.

```ts
const service = client.services.homeTaxCashbill
const { jobId } = await service.requestCollection({
  businessNumber: '1234567890',
  receiptDirection: 'SELL',
  startDate: '20260901',
  endDate: '20260930',
})

const state = await service.getCollectionJobState({ businessNumber: '1234567890', jobId })
if (state.collectionSucceeded === true) {
  const result = await service.searchCashbills({ businessNumber: '1234567890', jobId, pageNumber: 1, pageSize: 500 })
  console.log(result.receipts)
}
```

한 번에 최대 3개월을 요청할 수 있습니다. JobID는 요청 시점부터 1시간 동안 유효하며, SDK가 자동으로 폴링하거나 수집을 다시 요청하지 않습니다. `stateCode=3`만으로 성공을 판정하지 않습니다. `resultCode=1`까지 충족한 `collectionSucceeded=true` 상태에서 검색·집계를 호출합니다. 수집 실패는 작업 상태의 결과코드·사유에, 만료되거나 존재하지 않는 JobID는 API 오류에 나타납니다. 새 수집을 요청하면 새 JobID를 보관해야 합니다.

## 인증 입력과 조회 데이터

홈택스 2차인증이 설정된 경우 부서사용자 등록의 `representativeIdentityPrefix`에 대표자 주민번호 앞 7자리를 전달합니다. 인증·정액제 신청 팝업 URL은 유효기간이 짧으므로 사용할 때 새로 요청합니다.

금액과 마스킹된 식별번호는 원본 문자열을 보존합니다. 합계는 공식 응답의 숫자 자료형을 유지합니다. 작업 상태·구분코드는 숫자와 숫자 문자열을 수용하며 새 코드와 `null`을 보존합니다. 성공 여부는 `collectionSucceeded === true`로 확인합니다. 인증서 만료값은 14자리 일시를 잘라내지 않고 `expiresAt`으로 반환합니다.

응답의 미확정 값 처리 기준은 [2.0 이전 가이드](../migration/2.0.md#응답-코드와-미확정-값), 기존 위치 인자는 [compat 레퍼런스](../sdk/popbill-compat/htcashbill/index.md)를 확인합니다.

공식 계약: [수집 요청 및 상태](https://developers.popbill.com/api-reference/htcashbill/api/job), [검색·집계](https://developers.popbill.com/api-reference/htcashbill/api/search), [홈택스 인증](https://developers.popbill.com/api-reference/htcashbill/api/cert), [정액제·과금](https://developers.popbill.com/api-reference/htcashbill/common-api/point).
