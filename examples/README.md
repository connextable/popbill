# Popbill Examples

`examples` 패키지는 도메인별 실행 예제를 제공합니다.

## 1) 디렉터리 구조

- `src/tax-invoice`: `@connextable/popbill` 기반 전자세금계산서 예제
- `src/juso`: `@connextable/popbill-juso` 기반 주소검색 예제

## 2) 공통 준비

의존성 설치:

```sh
pnpm install
pnpm build
```

환경변수 파일 생성:

```sh
cp ./examples/.env.example ./examples/.env
```

## 3) Tax Invoice 예제

필수 환경변수:

- `POPBILL_LINK_ID`
- `POPBILL_SECRET_KEY`
- `POPBILL_CORP_NUM`
- `POPBILL_USER_ID`

주요 옵션 환경변수:

- `POPBILL_IS_TEST=true`
- `POPBILL_USE_LOCAL_TIME=true`
- `POPBILL_REQUEST_TIMEOUT_MS=30000`
- `POPBILL_ACCEPT_ENCODING=gzip`

역발행 예제에서는 `POPBILL_CORP_NUM`을 공급받는자, `POPBILL_COUNTERPART_CORP_NUM`을 공급자로 사용합니다.
역발행 요청거부는 공급자 계정으로 실행하므로 `POPBILL_COUNTERPART_USER_ID`에 상대 사업자의 팝빌 아이디를 입력합니다. 비어 있으면 요청거부만 skip됩니다.

유즈케이스 전체 실행:

```sh
pnpm -C examples taxinvoice:all
```

유즈케이스별 실행:

```sh
pnpm -C examples taxinvoice:issue
pnpm -C examples taxinvoice:inquiry
pnpm -C examples taxinvoice:urls
pnpm -C examples taxinvoice:attachment
pnpm -C examples taxinvoice:notify
pnpm -C examples taxinvoice:reverse
pnpm -C examples taxinvoice:bulk
pnpm -C examples taxinvoice:search
pnpm -C examples taxinvoice:certificate
```

유즈케이스 선택 실행:

```sh
pnpm -C examples taxinvoice -- inquiry,urls,certificate
```

메서드 단위 실행:

```sh
pnpm -C examples taxinvoice:method -- issueInvoiceImmediately
pnpm -C examples taxinvoice:method -- getInvoiceDetailInfo
pnpm -C examples taxinvoice:method -- sendInvoiceToNTS
pnpm -C examples taxinvoice:method -- issueInvoice,getInvoicePDFURL
```

메서드 목록:

```sh
pnpm -C examples taxinvoice:method:list
pnpm -C examples taxinvoice:method:list:verbose
```

전자명세서 연계 참고:

- `POPBILL_STATEMENT_MGT_KEY`가 비어 있으면 `attachInvoiceStatement`, `detachInvoiceStatement`는 자동으로 skip됩니다.

문서번호 할당 참고:

- `assignInvoiceManagementKey`는 팝빌 사이트에서 발행한 매출 문서 중 문서번호가 없는 문서에만 실행할 수 있습니다. 해당 문서의 `itemKey`를 `POPBILL_ASSIGN_ITEM_KEY`에 입력합니다. 비어 있으면 이 단계만 skip됩니다.
- 할당에 성공한 문서는 같은 예제의 입력으로 다시 사용할 수 없습니다. 메서드 단위 실행과 `attachment` 시나리오 중 하나를 선택하고, 다음 실행에는 새 미할당 문서를 준비합니다. API로 등록한 임시저장 문서는 이 기능의 대상이 아닙니다. [공식 문서번호 할당 API](https://developers.popbill.com/api-reference/taxinvoice/api/etc#AssignMgtKey)를 참고합니다.

## 4) Juso 예제

필수 환경변수:

- `JUSO_LINK_ID`
- `JUSO_SECRET_KEY`
- `JUSO_ACCESS_ID`

주요 옵션 환경변수:

- `JUSO_SEARCH_KEYWORD`
- `JUSO_USE_LOCAL_TIME=true`
- `JUSO_REQUEST_TIMEOUT_MS=30000`
- `JUSO_API_BASE_URL`
- `JUSO_AUTH_BASE_URL`
- `JUSO_ACCEPT_LANGUAGE`
- `JUSO_FORWARDED_IP_ADDRESS`

기본 실행:

```sh
pnpm -C examples juso -- "서울 강남구 테헤란로"
pnpm -C examples juso -- --keyword "부산 해운대구 우동" --page-size 5
```

도움말:

```sh
pnpm -C examples juso -- --help
```

## 5) 문제 해결

확인 순서:

1. 필수 환경변수 누락 여부
2. 테스트/운영 관련 옵션(`POPBILL_IS_TEST`, `JUSO_API_BASE_URL`) 확인
3. 실행 명령 오타 여부 (`taxinvoice:method:list`, `juso -- --help`) 확인

## 6) 관련 문서

- 루트 프로젝트 가이드: [../README.md](../README.md)
- modern 마이그레이션 TODO: [../docs/migration/popbill-modern.todo.md](../docs/migration/popbill-modern.todo.md)
- compat 마이그레이션 TODO: [../docs/migration/popbill-compat.todo.md](../docs/migration/popbill-compat.todo.md)
- SDK 상세 문서(생성 산출물): [../docs/sdk/README.md](../docs/sdk/README.md)
