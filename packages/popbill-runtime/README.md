# @connextable/popbill-runtime

Popbill 및 Linkhub SDK 패키지에서 공유하는 런타임 클라이언트 패키지입니다.

인증·토큰 캐시·HTTP 전송을 조합해 SDK나 어댑터를 구현할 때 사용합니다. 애플리케이션의 Popbill 연동에는 `@connextable/popbill`, `@connextable/popbill-compat`, `@connextable/popbill-juso`를 사용합니다.

## 요구사항

- Node.js 20+

## 설치

```sh
npm install @connextable/popbill-runtime
```

## 사용 예시

다음은 테스트 환경에서 세금계산서 API 호출용 전송 클라이언트를 구성하는 예입니다. 연동 아이디·base64 비밀키는 환경변수에 설정합니다. API를 호출할 때 전달한 사업자등록번호로 토큰을 발급받아 캐시합니다.

```ts
import {
  createLinkhubAuthClient,
  createTokenProvider,
  createPopbillRequestClient,
  PopbillApiBaseUrls,
  PopbillAuthScopes,
  PopbillServiceIds,
} from '@connextable/popbill-runtime'

const authClient = createLinkhubAuthClient({
  linkId: process.env.POPBILL_LINK_ID!,
  secretKey: process.env.POPBILL_SECRET_KEY!,
})

const tokenProvider = createTokenProvider({
  authClient,
  serviceId: PopbillServiceIds.Test,
  scopes: [PopbillAuthScopes.Member, PopbillAuthScopes.TaxInvoice],
})

const requestClient = createPopbillRequestClient({
  apiBaseUrl: PopbillApiBaseUrls.Test,
  timeoutMs: 180_000,
  tokenProvider,
})
```

`requestClient.requestJson<T>(options)`는 JSON 응답을, `requestBinary(options)`는 `Uint8Array`를 반환합니다. `requestJson<T>`의 `T`는 타입 선언이며 응답의 런타임 스키마 검증을 수행하지 않습니다. 원본 계약은 `@connextable/popbill-spec`에서 확인하고, DTO 매핑과 서비스별 오류 처리는 상위 SDK 또는 직접 작성한 어댑터에서 담당합니다.

## 제공 기능

- `createLinkhubAuthClient`: Linkhub 인증과 토큰 발급
- `createTokenProvider`: 토큰 캐시·동시 발급 요청 공유·무효화
- `createLinkhubRequestClient`: Linkhub API 요청
- `createPopbillRequestClient`: Popbill 인증 헤더·HTTP 요청
- 서비스 ID·인증 범위·기본 URL 상수

## 관련 문서

- [저장소와 패키지 선택](../../README.md)
- [공개 함수와 타입 소스](./src/index.ts)
