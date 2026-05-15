# @connextable/popbill-juso

주소링크(JusoLink) 주소검색 API를 TypeScript에서 사용하기 위한 SDK입니다.

## 요구사항

- Node.js 20+

## 설치

```sh
npm install @connextable/popbill-juso
```

## 빠른 시작

```ts
import { createJusoLinkClient } from '@connextable/popbill-juso'

const client = createJusoLinkClient({
  linkId: process.env.JUSO_LINK_ID!,
  secretKey: process.env.JUSO_SECRET_KEY!,
  accessId: process.env.JUSO_ACCESS_ID!,
})

const result = await client.services.juso.searchAddresses({
  searchKeyword: '서울 강남구 테헤란로',
  pageSize: 5,
})

console.log(result.addresses)
```

## 클라이언트 설정

필수 필드:

- `linkId`
- `secretKey`
- `accessId`

주요 옵션:

- `apiBaseUrl`: 주소링크 API 기본 URL입니다. 기본값은 `https://jusolink.linkhub.co.kr`입니다.
- `authBaseUrl`: Linkhub 인증 API 기본 URL입니다. 기본값은 `https://auth.linkhub.co.kr`입니다.
- `forwardedIpAddress`: 토큰 발급 시 사용할 제한 IP 값입니다.
- `useLocalTime`: 인증 시 로컬 UTC 시간을 사용할지 결정합니다. 기본값은 `true`입니다.
- `requestTimeoutMilliseconds`: 요청 제한시간(ms)입니다. 기본값은 `180000`입니다.
- `acceptLanguage`: 요청 `Accept-Language` 헤더입니다.
- `onError`: SDK 에러 콜백입니다.

## 서비스

- `client.services.juso.searchAddresses(input)`: 검색어로 주소를 조회하고 페이지 정보, 시도별 검색 건수, 정규화된 주소 목록을 반환합니다.

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 예제: [../../examples/README.md](../../examples/README.md)
