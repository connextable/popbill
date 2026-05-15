# popbill

팝빌(Popbill)과 주소링크(JusoLink) API를 TypeScript에서 사용하기 위한 모노레포 SDK입니다.

## 프로젝트 개요

- 런타임: Node.js 20+
- 언어: TypeScript
- 패키지 매니저: pnpm workspace
- 태스크 러너: turbo
- 생성 문서: `pnpm docs:generate`

## 패키지

| 패키지                         | 역할                                       | README                                                                     |
| ------------------------------ | ------------------------------------------ | -------------------------------------------------------------------------- |
| `@connextable/popbill`         | 신규 프로젝트용 modern Popbill SDK         | [packages/popbill/README.md](./packages/popbill/README.md)                 |
| `@connextable/popbill-compat`  | legacy callback, promise, factory 호환 SDK | [packages/popbill-compat/README.md](./packages/popbill-compat/README.md)   |
| `@connextable/popbill-juso`    | 주소링크 주소검색 SDK                      | [packages/popbill-juso/README.md](./packages/popbill-juso/README.md)       |
| `@connextable/popbill-spec`    | Popbill API 원본 요청/응답 타입            | [packages/popbill-spec/README.md](./packages/popbill-spec/README.md)       |
| `@connextable/popbill-runtime` | 인증, 토큰, 요청 전송 공통 런타임          | [packages/popbill-runtime/README.md](./packages/popbill-runtime/README.md) |
| `@connextable/popbill-utils`   | SDK 공통 유틸리티                          | [packages/popbill-utils/README.md](./packages/popbill-utils/README.md)     |

애플리케이션에서 새로 연동한다면 `@connextable/popbill`부터 시작합니다. 기존 Popbill 스타일 서비스 팩토리에 의존하는 코드라면 `@connextable/popbill-compat`를 사용합니다.

## 빠른 시작

modern SDK 설치:

```sh
npm install @connextable/popbill
```

클라이언트 생성:

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

위 예시에 필요한 환경변수:

- `POPBILL_LINK_ID`
- `POPBILL_SECRET_KEY`
- `POPBILL_USER_ID`
- `POPBILL_CORP_NUM`

## Legacy 호환 SDK

호환 패키지 설치:

```sh
npm install @connextable/popbill-compat
```

callback 방식은 성공 콜백과 에러 콜백을 함께 전달합니다.

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

promise 방식은 `@connextable/popbill-compat/promise`에서 사용할 수 있습니다.

```ts
import { config, TaxinvoiceService } from '@connextable/popbill-compat/promise'

config({
  LinkID: process.env.POPBILL_LINK_ID!,
  SecretKey: process.env.POPBILL_SECRET_KEY!,
  IsTest: true,
  UseLocalTimeYN: true,
})

const taxinvoice = TaxinvoiceService()

try {
  const expireDate = await taxinvoice.getCertificateExpireDate(process.env.POPBILL_CORP_NUM!, process.env.POPBILL_USER_ID!)

  console.log(expireDate)
} catch (error) {
  console.error(error)
}
```

## 예제

`examples` 워크스페이스에는 전자세금계산서와 주소링크 실행 예제가 있습니다.

```sh
pnpm install
pnpm -C examples taxinvoice:all
pnpm -C examples taxinvoice:method:list
pnpm -C examples juso -- "서울 강남구 테헤란로"
```

환경변수와 시나리오별 명령어는 [examples/README.md](./examples/README.md)를 참고합니다.

## 개발

워크스페이스 명령어:

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
pnpm docs:generate
pnpm clean
```

패키지 단위 명령어는 `pnpm -C`를 사용합니다.

```sh
pnpm -C packages/popbill test
pnpm -C packages/popbill-compat typecheck
pnpm -C packages/popbill-juso build
```

## 환경변수

루트 `.env.example`에는 공통 Popbill 인증값과 통합 테스트 토글이 있습니다.

- `POPBILL_RUN_INTEGRATION_TESTS`: 일반 실서버 통합 테스트를 활성화합니다.
- `POPBILL_RUN_TAXINVOICE_REAL_INTEGRATION_TESTS`: 전자세금계산서 실서버 메서드 테스트를 활성화합니다.
- `examples/.env.example`: 전자세금계산서와 주소링크 예제 실행용 변수를 정의합니다.

실서버 인증값이 필요한 테스트는 해당 토글이 켜져 있지 않으면 skip됩니다.

## 문서

- 예제 실행 가이드: [examples/README.md](./examples/README.md)
- modern 마이그레이션 TODO: [docs/migration/popbill-modern.todo.md](./docs/migration/popbill-modern.todo.md)
- compat 마이그레이션 TODO: [docs/migration/popbill-compat.todo.md](./docs/migration/popbill-compat.todo.md)
- 생성 SDK 문서: [docs/sdk/README.md](./docs/sdk/README.md)

`docs/sdk`는 생성 산출물입니다. 최신 상태로 재생성하려면 아래 명령어를 실행합니다.

```sh
pnpm docs:generate
```

## 라이선스

[MIT](./LICENSE.md)
