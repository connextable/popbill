# 홈택스 세금계산서 수집 예제

프로젝트 SDK 빌드와 `.env` 설정 후 examples 디렉터리에서 실행합니다. 공동인증서 또는 부서사용자 등록과 정액제 계약이 필요합니다.

```sh
pnpm exec dotenvx run -- jiti ./src/home-tax-tax-invoice/collection.ts --help
```

실제 테스트 API 호출에는 `POPBILL_RUN_HTTAXINVOICE_EXAMPLES=true`, `POPBILL_IS_TEST=true`와 기본 `POPBILL_LINK_ID`, `POPBILL_SECRET_KEY`, `POPBILL_USER_ID`, `POPBILL_CORP_NUM` 설정이 필요합니다.

1. `POPBILL_HTTAXINVOICE_DIRECTION=BUY`(또는 `SELL`, `TRUSTEE`), `POPBILL_HTTAXINVOICE_START_DATE`, `POPBILL_HTTAXINVOICE_END_DATE`를 설정하고 `request` 모드로 최대 3개월 범위의 수집을 요청합니다. 날짜는 `yyyyMMdd` 형식입니다.
2. 출력된 작업 ID를 `POPBILL_HTTAXINVOICE_JOB_ID`에 저장하고 `state` 모드로 상태를 확인합니다.
3. 상태 3과 결과코드 1을 모두 확인한 뒤 `search` 또는 `summary` 모드를 실행합니다. 두 모드는 상태를 한 번 확인한 뒤 조회합니다.

```sh
pnpm exec dotenvx run -- jiti ./src/home-tax-tax-invoice/collection.ts request
pnpm exec dotenvx run -- jiti ./src/home-tax-tax-invoice/collection.ts state
pnpm exec dotenvx run -- jiti ./src/home-tax-tax-invoice/collection.ts search
pnpm exec dotenvx run -- jiti ./src/home-tax-tax-invoice/collection.ts summary
```

작업 ID는 최초 요청으로부터 1시간 유효합니다. 대기·진행 상태는 나중에 다시 확인하고, 수집 실패는 오류 원인을 해결합니다. 만료된 작업은 `request`를 명시적으로 다시 실행합니다. 예제는 자동 polling이나 자동 재요청을 하지 않습니다.

인증·상태·금액·XML 계약은 [서비스 가이드](../../../docs/services/home-tax-tax-invoice.md)를 확인합니다.
