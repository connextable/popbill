# Popbill Examples

`examples` 패키지는 `@connextable/popbill`의 tax-invoice API를 시나리오/메서드 단위로 실행해볼 수 있는 실행형 샘플 모음입니다.

## 1) 목적

- modern SDK 메서드를 실제 호출 흐름으로 빠르게 검증
- 유즈케이스 단위(`issue`, `inquiry`, `bulk` 등) 동작 확인
- 개별 메서드 단위 실행으로 입력/응답 포맷 점검

## 2) 사전 준비

루트에서 의존성 설치:

```sh
pnpm install
```

환경변수 파일 생성:

```sh
cp ./examples/.env.example ./examples/.env
```

필수값:

- `POPBILL_LINK_ID`
- `POPBILL_SECRET_KEY`
- `POPBILL_CORP_NUM`
- `POPBILL_USER_ID`

## 3) 환경변수 설정

기본 동작:

- 테스트 서버 기준: `POPBILL_IS_TEST=true`
- 로컬 시간 사용: `POPBILL_USE_LOCAL_TIME=true`
- 요청 타임아웃: `POPBILL_REQUEST_TIMEOUT_MS=30000`

추가 옵션:

- 메일/문자/팩스 재전송 시나리오: `POPBILL_RECEIVER_EMAIL`, `POPBILL_SENDER_PHONE`, `POPBILL_RECEIVER_PHONE`, `POPBILL_SENDER_FAX`, `POPBILL_RECEIVER_FAX`
- 전자명세서 연계: `POPBILL_STATEMENT_ITEM_CODE`, `POPBILL_STATEMENT_MGT_KEY`

참고:

- `attachInvoiceStatement` / `detachInvoiceStatement`는 `POPBILL_STATEMENT_MGT_KEY`가 비어 있으면 자동으로 skip됩니다.

## 4) 실행 명령

전체 유즈케이스:

```sh
pnpm -C examples taxinvoice:all
```

유즈케이스별:

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

선택 조합 실행:

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

메서드 목록/도움말:

```sh
pnpm -C examples taxinvoice:method:list
pnpm -C examples taxinvoice:method:list:verbose
```

## 5) 로그/문제 해결

실행 시 각 API 호출마다 아래 형식으로 출력됩니다.

- `REQUEST`: 호출 입력값
- `RESPONSE`: 주요 응답 요약 + `durationMs`
- `ERROR`: 오류 상세 + `durationMs`

문제 발생 시 확인 순서:

1. 필수 환경변수 누락 여부
2. 테스트/운영 서버 설정(`POPBILL_IS_TEST`)
3. 메서드 이름 오타 여부 (`taxinvoice:method:list`로 재확인)

## 6) 관련 문서

- 루트 프로젝트 가이드: [../README.md](../README.md)
- modern 마이그레이션 TODO: [../docs/migration/popbill-modern.todo.md](../docs/migration/popbill-modern.todo.md)
- compat 마이그레이션 TODO: [../docs/migration/popbill-compat.todo.md](../docs/migration/popbill-compat.todo.md)
- SDK 상세 문서(생성 산출물): [../docs/sdk/README.md](../docs/sdk/README.md)
