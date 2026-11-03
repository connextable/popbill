# 조회 서비스 예제

[공통 준비](../../README.md#공통-준비)를 마치고 `examples/.env`에 `POPBILL_RUN_LOOKUP_EXAMPLES=true`를 설정합니다. 조회 시 포인트가 차감될 수 있습니다. 모든 명령은 저장소 루트에서 실행합니다.

```sh
pnpm -C examples lookup -- --help
```

사업자등록상태 및 기업정보 조회는 `POPBILL_LOOKUP_TARGET_CORP_NUM`에 조회 대상 사업자번호를 설정합니다.

```sh
pnpm -C examples lookup -- status
pnpm -C examples lookup -- company
```

예금주 성명조회는 `POPBILL_LOOKUP_BANK_CODE`에 기관코드 네 자리, `POPBILL_LOOKUP_ACCOUNT_NUMBER`에 계좌번호를 문자열로 설정합니다. 기관코드의 선행 0을 유지합니다.

```sh
pnpm -C examples lookup -- account
```

사업자등록상태의 상태코드와 과세유형은 문자열 또는 `null`로 반환하며, 변경일자가 없을 때도 `null`일 수 있습니다. 기업정보와 예금주 조회의 결과코드는 API 오류와 별개입니다. 반환된 `resultCode`·`resultMessage`를 확인합니다. 예금주 결과 해석은 [계좌 조회 레퍼런스](../../../docs/sdk/popbill/account-check/index.md)를 참고합니다.
