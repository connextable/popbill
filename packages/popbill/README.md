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
- `acceptEncoding`: 요청 `Accept-Encoding` 헤더입니다. 기본값은 `gzip`입니다.
- `acceptLanguage`: 요청 `Accept-Language` 헤더입니다.
- `requestTimeoutMs`: 요청 제한시간(ms)입니다. 기본값은 `180000`입니다.
- `onError`: SDK 에러 콜백입니다.

`acceptLanguage`는 HTTP 언어 우선순위 문자열을 전달합니다. Popbill 문서의 언어 예시는 `ko-KR`, `en-US`이며, 다른 값의 실제 지원 여부는 서버가 결정합니다.

## 서비스

`client.services`에서 다음 서비스를 이용합니다.

| 분류        | 서비스                                 | 기능                                                              |
| ----------- | -------------------------------------- | ----------------------------------------------------------------- |
| 공통        | `common`                               | 회원·담당자·기업정보, 포인트·결제·환불                            |
| 전자문서    | `taxInvoice`, `cashbill`, `statement`  | 세금계산서·현금영수증·전자명세서의 발행·조회·취소·부가기능        |
| 홈택스 수집 | `homeTaxTaxInvoice`, `homeTaxCashbill` | 인증·수집·상태·내역·집계                                          |
| 사업자 조회 | `closedown`, `bizInfoCheck`            | 휴폐업 상태 단건·다건, 기업정보                                   |
| 금융 조회   | `easyFinBank`, `accountCheck`          | 계좌 관리·거래내역 수집, 예금주 성명·실명                         |
| 메시징      | `kakao`, `message`, `fax`              | 알림톡·친구톡·브랜드 메시지, 문자·MMS, 팩스의 전송·예약·취소·결과 |

modern API는 객체 인자를 받으며 레거시 호환 별칭을 제공하지 않습니다. 정확한 메서드·요청·응답은 [생성 레퍼런스](../../docs/sdk/README.md), 사용 흐름과 레거시와의 차이는 [서비스 가이드](../../docs/README.md)를 확인합니다.

수집 API는 수집 요청으로 받은 작업 ID를 저장하고 상태를 조회한 뒤 내역을 조회합니다. 완료 상태와 성공 결과코드를 함께 확인합니다. SDK는 자동 재요청이나 폴링을 수행하지 않습니다.

## 전자명세서

문서유형 코드·등록·발행·조회·세금계산서 첨부는 [전자명세서 가이드](../../docs/services/statement.md)를 확인합니다. 실행 가능한 전체 흐름은 [전자명세서 예제](../../examples/README.md#전자명세서-예제)에 있습니다.

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 예제: [../../examples/README.md](../../examples/README.md)
- 생성 SDK 문서: [../../docs/sdk/README.md](../../docs/sdk/README.md)
