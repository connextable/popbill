# Popbill Examples

루트 `examples` 디렉터리에서 `@connextable/popbill`을 `workspace:*`로 설치하고, TypeScript 코드로 실제 API를 유즈케이스별로 직접 호출해볼 수 있게 만든 예제야.

## 0) 구성

- `pnpm-workspace.yaml`에 `examples` 패키지 등록
- `examples/package.json`에서 `@connextable/popbill: workspace:*`
- 환경변수는 `dotenvx`로 로드
- 실행은 `jiti`로 `.ts` 파일을 그대로 런타임 실행
- 시나리오는 `examples/src/scenarios/*.ts`로 분리
- 공통 로직은 `examples/src/utils/*.ts`, `examples/src/workflows/*.ts`로 분리

## 1) 준비

### 환경변수 파일 생성

```sh
cp ./examples/.env.example ./examples/.env
```

`.env`에 최소 아래 4개는 반드시 넣어야 해.

- `POPBILL_LINK_ID`
- `POPBILL_SECRET_KEY`
- `POPBILL_CORP_NUM`
- `POPBILL_USER_ID`

루트 `.env`를 쓰고 싶으면 `dotenvx` env-file 옵션으로 경로를 명시해서 실행하면 돼.

## 2) 설치

루트에서 한 번 설치:

```sh
pnpm install
```

네트워크/레지스트리 이슈가 있으면 기존 `node_modules` 상태에 따라 설치가 실패할 수 있어.

## 3) 실행

### 전체 유즈케이스 실행

```sh
pnpm -C examples taxinvoice:all
```

### 유즈케이스별 실행

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

### 원하는 시나리오만 조합 실행

```sh
pnpm -C examples taxinvoice -- inquiry,urls,certificate
```

### 메서드 단건 실행

메서드 하나씩 직접 실행하려면:

```sh
pnpm -C examples taxinvoice:method -- issueInvoiceImmediately
pnpm -C examples taxinvoice:method -- getInvoiceDetailInfo
pnpm -C examples taxinvoice:method -- sendInvoiceToNTS
```

메서드 여러 개를 한 번에:

```sh
pnpm -C examples taxinvoice:method -- issueInvoice,getInvoicePDFURL
```

메서드 목록 확인:

```sh
pnpm -C examples taxinvoice:method:list
```

메서드 상세 설명까지 확인:

```sh
pnpm -C examples taxinvoice:method:list:verbose
```

`verbose`에서는 `methodName(compatMethodName): description` 형식으로 출력돼.

## 4) 로그 확인 포인트

스크립트는 각 API마다 다음을 출력해.

- `REQUEST`: 호출 입력값
- `RESPONSE`: 주요 응답값(summary) + 소요시간(`durationMs`)
- `ERROR`: 실패 시 에러 상세 + 소요시간(`durationMs`)

즉, 실행 중간에 값이 정상으로 내려오는지, 어디서 실패하는지 바로 확인할 수 있어.

## 5) 참고

- 기본값은 테스트 서버(`POPBILL_IS_TEST=true`) 기준.
- `attachInvoiceStatement` / `detachInvoiceStatement`는 `POPBILL_STATEMENT_MGT_KEY`가 비어 있으면 자동으로 skip.
