# 홈택스 세금계산서 수집 예제

[공통 준비](../../README.md#공통-준비)를 마치고 `examples/.env`에 `POPBILL_RUN_HTTAXINVOICE_EXAMPLES=true`를 설정합니다. 공동인증서 또는 부서사용자 등록과 정액제 계약이 필요합니다. 모든 명령은 저장소 루트에서 실행합니다.

```sh
pnpm -C examples hometax:taxinvoice -- --help
```

1. `POPBILL_HTTAXINVOICE_DIRECTION=BUY`(또는 `SELL`, `TRUSTEE`), `POPBILL_HTTAXINVOICE_START_DATE`, `POPBILL_HTTAXINVOICE_END_DATE`를 설정하고 `request` 모드로 수집을 요청합니다. 날짜는 `yyyyMMdd` 형식이며, 예제는 전송일자 기준으로 요청합니다. 허용 기간은 [서비스 가이드](../../../docs/services/home-tax-tax-invoice.md)를 확인합니다.
2. 출력된 작업 ID를 `POPBILL_HTTAXINVOICE_JOB_ID`에 저장하고 `state` 모드로 상태를 확인합니다.
3. 상태 3과 결과코드 1을 모두 확인한 뒤 `search` 또는 `summary` 모드를 실행합니다. 두 모드는 상태를 한 번 확인한 뒤 조회합니다.

```sh
pnpm -C examples hometax:taxinvoice -- request
# 출력된 작업 ID를 POPBILL_HTTAXINVOICE_JOB_ID에 저장한 뒤 실행
pnpm -C examples hometax:taxinvoice -- state
pnpm -C examples hometax:taxinvoice -- search
pnpm -C examples hometax:taxinvoice -- summary
```

작업 ID는 최초 요청으로부터 1시간 유효합니다. 대기·진행 상태는 나중에 다시 확인하고, 수집 실패는 오류 원인을 해결합니다. 만료된 작업은 `request`를 명시적으로 다시 실행합니다. 예제는 자동 폴링이나 자동 재요청을 하지 않습니다. `search`는 최대 100건의 첫 페이지만 조회하므로 나머지 페이지가 필요하면 직접 순회합니다.

인증·상태·금액·XML 계약은 [서비스 가이드](../../../docs/services/home-tax-tax-invoice.md)를 확인합니다.
