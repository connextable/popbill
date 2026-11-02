# 조회 서비스 예제

SDK 빌드와 `.env` 설정 후 examples 디렉터리에서 실행합니다. 실제 API를 호출하려면 `POPBILL_RUN_LOOKUP_EXAMPLES=true`, `POPBILL_IS_TEST=true`와 기본 인증정보 `POPBILL_LINK_ID`, `POPBILL_SECRET_KEY`, `POPBILL_USER_ID`, `POPBILL_CORP_NUM`을 설정합니다. 조회 시 포인트가 차감될 수 있습니다.

```sh
pnpm exec dotenvx run -- jiti ./src/lookup/run-lookup.ts --help
```

사업자등록상태 및 기업정보 조회는 `POPBILL_LOOKUP_TARGET_CORP_NUM`에 조회 대상 사업자번호를 설정합니다.

```sh
pnpm exec dotenvx run -- jiti ./src/lookup/run-lookup.ts status
pnpm exec dotenvx run -- jiti ./src/lookup/run-lookup.ts company
```

예금주 성명조회는 `POPBILL_LOOKUP_BANK_CODE`에 기관코드 네 자리, `POPBILL_LOOKUP_ACCOUNT_NUMBER`에 계좌번호를 문자열로 설정합니다. 기관코드의 선행 0을 유지합니다.

```sh
pnpm exec dotenvx run -- jiti ./src/lookup/run-lookup.ts account
```

사업자등록상태의 상태코드와 과세유형은 문자열로, 변경일자가 없는 경우는 `null`로 반환합니다. 기업정보와 예금주 조회의 결과코드는 API 오류와 별개입니다. 반환된 `resultCode`·`resultMessage`를 확인합니다.
