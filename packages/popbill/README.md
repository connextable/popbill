# @connextable/popbill

Popbill API를 TypeScript에서 사용하기 위한 modern SDK입니다.

신규 프로젝트에서는 이 패키지를 기본 선택지로 사용합니다. `createPopbillClient`로 클라이언트를 만들고, 객체 기반 입력과 타입이 지정된 응답으로 API를 호출합니다.

## 요구사항

- Node.js 20+
- ESM 호환 TypeScript 도구

## 설치

```sh
npm install @connextable/popbill
```

## 빠른 시작

```ts
import { createPopbillClient } from '@connextable/popbill'

const client = createPopbillClient({
  linkId: process.env.POPBILL_LINK_ID!,
  secretKey: process.env.POPBILL_SECRET_KEY!,
  userId: process.env.POPBILL_USER_ID!,
  isTest: true,
})

const expiration = await client.services.taxInvoice.getTaxCertificateExpirationDate({
  businessNumber: process.env.POPBILL_CORP_NUM!,
})

console.log(expiration)
```

## 클라이언트 설정

필수 필드:

- `linkId`
- `secretKey`
- `userId`

주요 옵션:

- `isTest`: Popbill 테스트 환경 사용 여부입니다. 기본값은 `false`입니다.
- `useLocalTime`: 인증 시 로컬 UTC 시간을 사용할지 결정합니다. 기본값은 `true`입니다.
- `requestTimeoutMs`: 요청 제한시간(ms)입니다. 기본값은 `180000`입니다.
- `acceptEncoding`: 요청 `Accept-Encoding` 헤더입니다. 기본값은 `gzip`입니다.
- `acceptLanguage`: 요청 `Accept-Language` 헤더입니다.
- `onError`: SDK 에러 콜백입니다.

## 서비스

현재 공개 서비스 그룹:

- `client.services.taxInvoice`: 전자세금계산서 등록, 발행, 검색, 문서 URL, 첨부파일, 국세청 전송, 인증서, 설정 관련 메서드를 제공합니다.

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 예제: [../../examples/README.md](../../examples/README.md)
- 생성 SDK 문서: [../../docs/sdk/README.md](../../docs/sdk/README.md)
