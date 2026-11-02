# 홈택스 현금영수증 수집

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#추가-서비스-예제)

`client.services.homeTaxCashbill`은 매입·매출 현금영수증 수집, 작업 상태, 검색·집계, 홈택스 인증 및 정액제 관리를 제공합니다. 사용자 ID는 클라이언트 설정을 사용합니다.

```ts
const service = client.services.homeTaxCashbill
const { jobId } = await service.requestCollection({
  businessNumber: '1234567890',
  receiptDirection: 'SELL',
  startDate: '20260901',
  endDate: '20260930',
})

const state = await service.getCollectionJobState({ businessNumber: '1234567890', jobId })
if (state.collectionSucceeded) {
  const result = await service.searchCashbills({ businessNumber: '1234567890', jobId, pageNumber: 1, pageSize: 500 })
  console.log(result.receipts)
}
```

한 번에 최대 3개월을 요청할 수 있습니다. JobID는 요청 시점부터 1시간 동안 유효하며, SDK가 자동으로 폴링하거나 수집을 다시 요청하지 않습니다. `stateCode=3`만으로 성공을 판정하지 않습니다. `resultCode=1`까지 충족한 `collectionSucceeded=true` 상태에서 검색·집계를 호출합니다. 수집 실패는 작업 상태의 결과코드·사유에, 만료되거나 존재하지 않는 JobID는 API 오류에 나타납니다. 새 수집을 요청하면 새 JobID를 보관해야 합니다.

인증정보 등록은 `getAuthenticationRegistrationUrl`, 부서사용자 관리는 `registerDepartmentUser`·`checkDepartmentUserRegistration`·`validateDepartmentUser`·`deleteDepartmentUser`로 수행합니다. 홈택스 2차인증이 설정된 경우 `representativeIdentityPrefix`에 대표자 주민번호 앞 7자리를 전달합니다. 인증·정액제 신청 팝업 URL은 발급 후 30초 동안 유효합니다.

금액과 마스킹된 식별번호는 원본 문자열을 보존합니다. 합계는 공식 응답의 숫자 자료형을 유지합니다. Node 문서와 HTTP 문서의 자료형이 다른 작업 상태코드·구분코드는 raw spec에서 양쪽을 허용합니다. modern은 십진 정수 문자열을 안전한 정수로 표현할 수 있을 때만 숫자로 변환합니다. 빈 문자열·알 수 없는 문자열·`null`·안전 범위를 벗어난 정수 문자열은 보존하며 성공 상태로 판정하지 않습니다. 인증서 만료값은 HTTP 응답의 14자리 일시를 잘라내지 않고 `expiresAt`으로 반환합니다.

공식 계약: [수집 요청 및 상태](https://developers.popbill.com/api-reference/htcashbill/api/job), [검색·집계](https://developers.popbill.com/api-reference/htcashbill/api/search), [홈택스 인증](https://developers.popbill.com/api-reference/htcashbill/api/cert), [정액제·과금](https://developers.popbill.com/api-reference/htcashbill/common-api/point).
