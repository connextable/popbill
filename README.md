# popbill

팝빌(POPBILL) API를 TypeScript에서 사용하기 위한 모노레포 SDK입니다.

## 1) 프로젝트 소개

- 언어/런타임: TypeScript, Node.js 20+
- 패키지 매니저: pnpm workspace
- 빌드/테스트 오케스트레이션: turbo
- 문서 생성: `pnpm docs:generate` (`docs/sdk` 산출)

## 2) 배포 패키지 정책

이 저장소에서 외부 배포 대상으로 관리하는 패키지는 아래 3개입니다.

- `@connextable/popbill`: modern SDK
- `@connextable/popbill-compat`: legacy 호환 SDK
- `@connextable/popbill-spec`: API 스펙 타입 패키지

## 3) 패키지 역할 비교

### `@connextable/popbill` (modern SDK)

신규 SDK 사용자 기준의 기본 선택지입니다.  
`createPopbillClient` 기반으로 `taxInvoice` 서비스를 입력 객체 중심 시그니처로 사용할 수 있습니다.

### `@connextable/popbill-compat` (legacy 호환 SDK)

기존 프로젝트의 레거시 시그니처를 최대한 유지하면서 TypeScript로 이전할 때 사용합니다.  
callback/promise/factory 형태를 지원해 단계적 마이그레이션에 적합합니다.

### `@connextable/popbill-spec` (스펙/타입 패키지)

Popbill API 요청/응답 타입과 상수를 제공합니다.  
SDK 내부 구현, 확장 개발, 타입 기반 검증이 필요한 경우에 사용합니다.

기능 범위(현재 코드 기준):

- modern tax-invoice: 46 methods
- compat taxinvoice: 55 methods

## 4) 빠른 시작(사용자용)

modern SDK 설치:

```sh
npm install @connextable/popbill
```

기본 사용 예시:

```ts
import { createPopbillClient } from '@connextable/popbill'

const client = createPopbillClient({
  linkId: process.env.POPBILL_LINK_ID!,
  secretKey: process.env.POPBILL_SECRET_KEY!,
  userId: process.env.POPBILL_USER_ID!,
  isTest: true,
})

const result = await client.services.taxInvoice.getTaxCertificateExpirationDate({
  businessNumber: process.env.POPBILL_CORP_NUM!,
})

console.log(result)
```

legacy 호환 SDK 설치:

```sh
npm install @connextable/popbill-compat
```

기존 callback 방식(기본 사용):

```ts
import { config, TaxinvoiceService } from '@connextable/popbill-compat'

config({
  LinkID: process.env.POPBILL_LINK_ID!,
  SecretKey: process.env.POPBILL_SECRET_KEY!,
  IsTest: true,
  UseLocalTimeYN: true,
})

const taxinvoice = TaxinvoiceService()
taxinvoice.getCertificateExpireDate(
  process.env.POPBILL_CORP_NUM!,
  process.env.POPBILL_USER_ID!,
  (expireDate) => {
    console.log(expireDate)
  },
  (error) => {
    console.error(error)
  }
)
```

추가로 promise 방식이 필요하면 `@connextable/popbill-compat/promise`를 사용할 수 있습니다:

```ts
import { config, TaxinvoiceService } from '@connextable/popbill-compat/promise'

config({
  LinkID: process.env.POPBILL_LINK_ID!,
  SecretKey: process.env.POPBILL_SECRET_KEY!,
  IsTest: true,
  UseLocalTimeYN: true,
})

const taxinvoice = TaxinvoiceService()
const expireDate = await taxinvoice.getCertificateExpireDate(process.env.POPBILL_CORP_NUM!, process.env.POPBILL_USER_ID!)

console.log(expireDate)
```

필수 환경변수:

- `POPBILL_LINK_ID`
- `POPBILL_SECRET_KEY`
- `POPBILL_CORP_NUM`
- `POPBILL_USER_ID`

## 5) 예제 실행

상세 실행 방법은 [examples/README.md](./examples/README.md)를 참고합니다.

빠른 실행 예시:

```sh
pnpm install
pnpm -C examples taxinvoice:all
pnpm -C examples taxinvoice:method:list
```

## 6) 개발 명령어(워크스페이스)

루트 기준 명령어:

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
pnpm docs:generate
pnpm clean
```

## 7) 환경변수

루트 `.env.example`에는 공통 기본키가 정의되어 있고, 예제 실행 전용 항목은 `examples/.env.example`에 추가로 정의되어 있습니다.

- 루트: 인증 기본키 + 실서버 smoke 토글(`POPBILL_RUN_INTEGRATION_TESTS`)
- 전자세금계산서 메서드별 실서버 테스트는 `POPBILL_RUN_TAXINVOICE_REAL_INTEGRATION_TESTS=true`가 아니면 skip됩니다. API 키 없는 검증은 별도 mock contract/unit 테스트가 담당합니다.
- examples: 예제 시나리오 실행에 필요한 발신/수신/명세서 관련 옵션

## 8) 문서 링크(예제/마이그레이션/SDK docs)

- 예제 실행 가이드: [examples/README.md](./examples/README.md)
- modern 마이그레이션 TODO: [docs/migration/popbill-modern.todo.md](./docs/migration/popbill-modern.todo.md)
- compat 마이그레이션 TODO: [docs/migration/popbill-compat.todo.md](./docs/migration/popbill-compat.todo.md)

SDK 상세 문서:

- [docs/sdk/README.md](./docs/sdk/README.md)

참고:

- `docs/sdk`는 생성 산출물이며 현재 `.gitignore`에 포함되어 있습니다.
- 로컬에서 최신 상태로 재생성하려면 `pnpm docs:generate`를 실행합니다.

## 9) 라이선스

[LICENSE.md](./LICENSE.md)
