# @connextable/popbill

Popbill API를 TypeScript에서 사용하기 위한 modern SDK입니다.

신규 프로젝트에서는 이 패키지를 기본 선택지로 사용합니다. `createPopbillClient`로 클라이언트를 만들고, 객체 기반 입력과 타입이 지정된 응답으로 API를 호출합니다.

1.1에서 업그레이드할 때는 [2.0 이전 가이드](../../docs/migration/2.0.md)의 응답 코드·플래그 타입 변경을 확인합니다.

## 요구사항

- Node.js 20+
- ESM 호환 TypeScript 도구

## 설치

```sh
npm install @connextable/popbill
```

## 빠른 시작

Popbill 연동 아이디·base64 비밀키·회원 아이디·사업자등록번호를 각각 `POPBILL_LINK_ID`, `POPBILL_SECRET_KEY`, `POPBILL_USER_ID`, `POPBILL_CORP_NUM` 환경변수에 설정합니다. 아래 예제는 테스트 환경에 등록된 공동인증서의 만료일을 조회합니다.

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

다른 서비스의 가입·인증서·발신번호 등 준비사항은 [서비스 가이드](../../docs/README.md)에서 확인합니다.

## 클라이언트 설정

필수 필드:

- `linkId`: 연동 아이디
- `secretKey`: base64 비밀키
- `userId`: 팝빌 회원 아이디

주요 옵션:

- `isTest`: Popbill 테스트 환경 사용 여부입니다. 기본값은 `false`입니다.
- `useLocalTime`: 인증 시 로컬 UTC 시간을 사용할지 결정합니다. 기본값은 `true`입니다.
- `acceptEncoding`: 요청 `Accept-Encoding` 헤더입니다. 기본값은 `gzip`입니다.
- `acceptLanguage`: 요청 `Accept-Language` 헤더입니다. 생략하면 해당 헤더를 보내지 않습니다.
- `requestTimeoutMs`: 요청 제한시간(ms)입니다. 기본값은 `180000`입니다.
- `onError`: SDK 에러 관찰 콜백입니다. 콜백을 설정해도 호출의 Promise는 실패하므로 호출부에서 오류를 처리합니다.

`acceptLanguage`는 HTTP 언어 우선순위 문자열을 전달합니다. Popbill 문서의 언어 예시는 `ko-KR`, `en-US`이며, 다른 값의 실제 지원 여부는 서버가 결정합니다.

네트워크 옵션 `useStaticIp`, `useGaIp`의 기본값은 `false`, `ipRestrictOnOff`의 기본값은 `true`입니다. 전체 설정 타입은 패키지가 내보내는 `PopbillClientConfig`에서 확인합니다.

## 서비스

`client.services`에서 다음 서비스를 이용합니다.

- 공통 `common`: 회원·담당자·기업정보, 포인트·결제·환불
- 전자문서 `taxInvoice`, `cashbill`, `statement`: 세금계산서·현금영수증·전자명세서의 발행·조회·취소
- 홈택스 수집 `homeTaxTaxInvoice`, `homeTaxCashbill`: 인증·수집·상태·내역·집계
- 사업자 조회 `closedown`, `bizInfoCheck`: 휴폐업 상태 단건·다건, 기업정보
- 금융 조회 `easyFinBank`, `accountCheck`: 계좌 관리·거래내역 수집, 예금주 성명·실명
- 메시징 `kakao`, `message`, `fax`: 알림톡·친구톡·브랜드 메시지, 문자·MMS, 팩스

modern API는 객체 인자를 받으며 레거시 호환 별칭을 제공하지 않습니다. 정확한 메서드·요청·응답은 설치한 패키지의 타입 선언이나 [로컬 SDK 레퍼런스](../../docs/sdk/README.md), 사용 흐름과 레거시와의 차이는 [서비스 가이드](../../docs/README.md)를 확인합니다. SDK 레퍼런스는 [문서 생성](../../docs/development.md#sdk-레퍼런스-생성) 후 로컬에서 열람합니다.

수집 API는 수집 요청으로 받은 작업 ID를 저장하고 상태를 조회한 뒤 내역을 조회합니다. 완료 상태와 성공 결과코드를 함께 확인합니다. SDK는 자동 재요청이나 폴링을 수행하지 않습니다.

## 웹훅 수신

`@connextable/popbill/webhook`의 `createPopbillWebhookReceiver`로 API 호출용 클라이언트와 별도로 수신기를 만듭니다. 전자문서 3종·홈택스 수집 2종·카카오톡·문자·팩스의 인증·단건/대량 파싱·타입이 있는 이벤트·성공 응답 구성을 제공합니다. 설정과 사용 예시는 [웹훅 수신 가이드](../../docs/webhook.md)를 확인합니다.

## 응답과 오류 처리

응답의 상태·분류 코드는 새로운 서버 값과 `null`·누락을 보존할 수 있습니다. 플래그도 미확정 값이 올 수 있으므로 `=== true`·`=== false`로 구분합니다. [응답 처리 기준](../../docs/migration/2.0.md#응답-코드와-미확정-값)에서 타입 변경과 호출 예제를 확인합니다.

실패한 호출은 `PopbillApiError` 형태로 거절됩니다. `code`·`message`는 오류 내용, `stage`는 입력·인증·API 호출 단계, `retriable`은 재시도 판단에 사용할 정보입니다. 전송·발행 요청이 시간초과되면 문서 관리번호나 요청번호로 처리 여부를 먼저 조회합니다.

## 전자명세서

문서유형 코드·등록·발행·조회·세금계산서 첨부는 [전자명세서 가이드](../../docs/services/statement.md)를 확인합니다. 실행 가능한 전체 흐름은 [전자명세서 예제](../../examples/README.md#전자명세서-예제)에 있습니다.

## 관련 문서

- [문서 안내와 서비스 가이드](../../docs/README.md)
- [예제 실행](../../examples/README.md)
- [생성 SDK 레퍼런스](../../docs/sdk/README.md)
