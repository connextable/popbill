# popbill

Popbill 전자세금계산서·JusoLink 주소검색용 TypeScript SDK.

## 빠른 시작

- 실행 환경: Node.js 20+ · ESM
- 사전 준비: Popbill 테스트 계정 · 사업자 공동인증서 등록

```sh
npm install @connextable/popbill
```

### 환경변수

| 변수                 | 값                  |
| -------------------- | ------------------- |
| `POPBILL_LINK_ID`    | 연동 아이디         |
| `POPBILL_SECRET_KEY` | 연동 비밀키(base64) |
| `POPBILL_USER_ID`    | 팝빌 회원 아이디    |
| `POPBILL_CORP_NUM`   | 사업자등록번호      |

### 호출

```ts
import { createPopbillClient } from '@connextable/popbill'

const client = createPopbillClient({
  linkId: process.env.POPBILL_LINK_ID!,
  secretKey: process.env.POPBILL_SECRET_KEY!,
  userId: process.env.POPBILL_USER_ID!,
  isTest: true,
})

try {
  const { expirationDateTime } = await client.services.taxInvoice.getTaxCertificateExpirationDate({
    businessNumber: process.env.POPBILL_CORP_NUM!,
  })
  console.log('인증서 만료:', expirationDateTime)
} catch (error) {
  console.error(error)
}
```

## 패키지

| 패키지                                                               | 용도                                      |
| -------------------------------------------------------------------- | ----------------------------------------- |
| [@connextable/popbill](./packages/popbill/README.md)                 | 신규 연동 · 객체 기반 전자세금계산서 API  |
| [@connextable/popbill-compat](./packages/popbill-compat/README.md)   | 기존 연동 · callback/promise/factory 호환 |
| [@connextable/popbill-juso](./packages/popbill-juso/README.md)       | 주소검색                                  |
| [@connextable/popbill-spec](./packages/popbill-spec/README.md)       | 원본 API 요청·응답 타입                   |
| [@connextable/popbill-runtime](./packages/popbill-runtime/README.md) | 인증·토큰·HTTP 전송                       |
| [@connextable/popbill-utils](./packages/popbill-utils/README.md)     | 공통 유틸리티                             |

## Legacy 호환 SDK

[Callback·Promise·Factory 사용법](./packages/popbill-compat/README.md)

## 예제

[실행 가이드](./examples/README.md) · [환경변수](./examples/.env.example)

## 개발

| 항목           | 도구·버전                       |
| -------------- | ------------------------------- |
| Node.js        | 22.x ≥22.18 / 24.x ≥24.11 / ≥26 |
| 패키지 관리    | pnpm 12                         |
| 언어·타입 검사 | TypeScript 7 · `tsc`            |
| 빌드           | tsdown · Turborepo              |
| 린트·포맷      | Oxlint · Oxfmt                  |
| 테스트         | Vitest 5                        |
| 문서 생성 API  | `@typescript/typescript6`       |
| Node 타입      | SDK 20 / 개발 도구 22           |

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm docs:generate
```

실서버 통합 테스트: 기본 skip · [활성화 설정](./.env.example)

## 문서

- SDK 레퍼런스: `pnpm docs:generate` → `docs/sdk/README.md`
- [릴리스·Trusted Publishing](./docs/release.md)
- 마이그레이션: [modern](./docs/migration/popbill-modern.todo.md) · [compat](./docs/migration/popbill-compat.todo.md)

## 라이선스

[MIT](./LICENSE.md)
