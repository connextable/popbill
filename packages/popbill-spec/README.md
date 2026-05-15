# @connextable/popbill-spec

Popbill API 원본 요청/응답 타입 패키지입니다.

SDK 내부 구현, adapter, 또는 원본 API 모델을 직접 다루는 고급 사용자를 위한 패키지입니다. 일반 애플리케이션 코드는 보통 `@connextable/popbill` 또는 `@connextable/popbill-compat`부터 사용합니다.

## 요구사항

- Node.js 20+

## 설치

```sh
npm install @connextable/popbill-spec
```

## 사용 예시

```ts
import type { TaxInvoiceSpec } from '@connextable/popbill-spec'
import { PopbillRequestHeaders } from '@connextable/popbill-spec'
```

## Export Paths

- `@connextable/popbill-spec`: 공통 인증, 헤더, 요청, 에러 코드, 전자세금계산서 타입
- `@connextable/popbill-spec/tax-invoice`: 전자세금계산서 요청/응답 모델
- `@connextable/popbill-spec/tax-invoice/shims`: 호환 shim 타입

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 생성 SDK 문서: [../../docs/sdk/README.md](../../docs/sdk/README.md)
