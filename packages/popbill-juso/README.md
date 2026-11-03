# @connextable/popbill-juso

주소링크(JusoLink) 주소검색 API를 TypeScript에서 사용하기 위한 SDK입니다.

## 요구사항

- Node.js 20+
- ESM 호환 TypeScript 도구

## 설치

```sh
npm install @connextable/popbill-juso
```

## 빠른 시작

주소링크 연동 아이디·base64 비밀키를 `JUSO_LINK_ID`, `JUSO_SECRET_KEY` 환경변수에 설정합니다. `JUSO_ACCESS_ID`에는 클라이언트 내 토큰 캐시를 구분할 식별자를 지정합니다. Popbill 회원 아이디와 별도입니다.

```ts
import { createJusoLinkClient } from '@connextable/popbill-juso'

const client = createJusoLinkClient({
  linkId: process.env.JUSO_LINK_ID!,
  secretKey: process.env.JUSO_SECRET_KEY!,
  accessId: process.env.JUSO_ACCESS_ID!,
})

try {
  const result = await client.services.juso.searchAddresses({
    searchKeyword: '서울 강남구 테헤란로',
    pageSize: 5,
  })
  console.log('총 검색 건수:', result.totalResultCount)
  console.log(result.addresses)
} catch (error) {
  console.error(error)
}
```

`addresses`에는 현재 페이지의 도로명·지번 주소와 우편번호가 있습니다. 다음 페이지는 같은 검색어와 `pageNumber`를 전달해 조회합니다.

## 클라이언트 설정

필수 필드:

- `linkId`: 주소링크 연동 아이디
- `secretKey`: base64 비밀키
- `accessId`: 클라이언트 내 토큰 캐시 식별자

`accessId`는 클라이언트 내 토큰 캐시 식별자입니다. 주소링크 인증 요청에는 `access_id`를 전송하지 않습니다.

주요 옵션:

- `apiBaseUrl`: 주소링크 API 기본 URL입니다. 기본값은 `https://juso.linkhub.co.kr`입니다.
- `authBaseUrl`: Linkhub 인증 API 기본 URL입니다. 기본값은 `https://auth.linkhub.co.kr`입니다.
- `forwardedIpAddress`: 토큰 발급 시 사용할 제한 IP 값입니다.
- `useLocalTime`: 인증 시 로컬 UTC 시간을 사용할지 결정합니다. 기본값은 `true`입니다.
- `requestTimeoutMilliseconds`: 요청 제한시간(ms)입니다. 기본값은 `180000`입니다.
- `acceptLanguage`: 요청 `Accept-Language` 헤더입니다.
- `onError`: SDK 에러 관찰 콜백입니다. 콜백을 설정해도 호출의 Promise는 실패하므로 호출부에서 오류를 처리합니다.

## 서비스

- `client.services.juso.searchAddresses(input)`: 검색어로 주소를 조회하고 페이지 정보, 시도별 검색 건수, 정규화된 주소 목록을 반환합니다.

`provinceResultCountMap`은 서버가 반환한 시도 코드를 그대로 키로 보존합니다. SDK에 아직 정의되지 않은 코드도 제거하지 않습니다.

## 관련 문서

- [저장소와 패키지 선택](../../README.md)
- [예제 실행](../../examples/README.md)
