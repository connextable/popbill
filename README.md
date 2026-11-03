# popbill

Popbill 전자문서·메시징·사업자 및 금융 조회와 JusoLink 주소검색용 TypeScript SDK.

## 빠른 시작

- 실행 환경: Node.js 20+ · ESM
- 사전 준비: Popbill 연동 아이디·비밀키와 테스트 회원 계정. 아래 예제는 공동인증서가 등록된 사업자로 실행합니다.

```sh
npm install @connextable/popbill
```

### 환경변수

실행 환경에 다음 값을 설정합니다. 예제의 `!`는 TypeScript 표시이며 환경변수를 채워주지 않습니다.

- `POPBILL_LINK_ID`: 연동 아이디
- `POPBILL_SECRET_KEY`: 연동 비밀키(base64)
- `POPBILL_USER_ID`: 팝빌 회원 아이디
- `POPBILL_CORP_NUM`: 사업자등록번호

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
| [@connextable/popbill](./packages/popbill/README.md)                 | 신규 연동 · 객체 기반 Popbill API         |
| [@connextable/popbill-compat](./packages/popbill-compat/README.md)   | 기존 연동 · callback/promise/factory 호환 |
| [@connextable/popbill-juso](./packages/popbill-juso/README.md)       | 주소검색                                  |
| [@connextable/popbill-spec](./packages/popbill-spec/README.md)       | 원본 API 요청·응답 타입                   |
| [@connextable/popbill-runtime](./packages/popbill-runtime/README.md) | 인증·토큰·HTTP 전송                       |
| [@connextable/popbill-utils](./packages/popbill-utils/README.md)     | 공통 유틸리티                             |

## 지원 서비스

전자세금계산서·현금영수증·전자명세서, 홈택스 세금계산서·현금영수증 수집, 휴폐업·기업정보·계좌 거래내역·예금주 조회, 카카오톡(알림톡·친구톡·브랜드 메시지)·문자·팩스를 제공합니다. 회원·담당자·포인트·결제·환불은 `client.services.common`에서 이용합니다.

서비스별 공개 위치와 사용법은 [modern SDK](./packages/popbill/README.md#서비스), [레거시 호환 SDK](./packages/popbill-compat/README.md#지원-서비스)를 확인합니다. 서비스 흐름·계약 차이·API 레퍼런스는 [문서 안내](./docs/README.md)에서 찾을 수 있습니다.

## 웹훅

`@connextable/popbill/webhook`으로 8개 상품의 이벤트를 수신합니다. API 호출용 인증과 별도로 Basic/API Key를 검증하고, 단건·배치 본문을 타입이 있는 이벤트 배열로 파싱합니다. [수신 가이드](./docs/webhook.md)에서 설정·응답·중복 처리와 실행 예제를 확인합니다.

## 전자명세서

거래명세서·청구서·견적서·발주서·입금표·영수증은 [전자명세서 가이드](./docs/services/statement.md)에서 문서유형 선택과 발행 흐름을 확인합니다.

## 문서

- [서비스 가이드·API 레퍼런스·개발 문서](./docs/README.md)
- [예제 실행과 환경변수 설정](./examples/README.md)
- [구현 범위와 계약 차이](./docs/migration/service-coverage.md)
- [1.1 → 2.0 이전 가이드](./docs/migration/2.0.md)

SDK 레퍼런스는 [문서 생성](./docs/development.md#sdk-레퍼런스-생성) 후 로컬에서 열람합니다.

## 개발

[개발 환경·검증 명령·문서 생성](./docs/development.md) · [실서버 테스트 활성화 설정](./.env.example) · [릴리스·복구](./docs/release.md)

## 라이선스

[MIT](./LICENSE.md)
