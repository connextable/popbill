# @connextable/popbill

객체 기반 입력과 타입이 지정된 응답을 제공하는 Popbill TypeScript SDK입니다. 신규 연동에 사용합니다.

- [빠른 시작](#빠른-시작)
- [설정](#클라이언트-설정)
- [전송 함수와 호출 취소](#전송-함수와-호출-취소)
- [서비스](#서비스)
- [오류 처리](#응답과-오류-처리)

## 요구사항

- Node.js: [package.json](./package.json)의 `engines.node` 지원 범위
- ESM 호환 TypeScript 도구

## 설치

```sh
npm install @connextable/popbill
```

## 빠른 시작

테스트 회원과 공동인증서가 등록된 사업자를 준비하고, 다음 환경변수를 설정합니다.

| 환경변수             | 값               |
| -------------------- | ---------------- |
| `POPBILL_LINK_ID`    | 연동 아이디      |
| `POPBILL_SECRET_KEY` | base64 비밀키    |
| `POPBILL_USER_ID`    | 팝빌 회원 아이디 |
| `POPBILL_CORP_NUM`   | 사업자등록번호   |

```ts
import { createPopbillClient } from '@connextable/popbill'

const config = {
  linkId: process.env.POPBILL_LINK_ID!,
  secretKey: process.env.POPBILL_SECRET_KEY!,
  userId: process.env.POPBILL_USER_ID!,
  isTest: true,
}

const client = createPopbillClient(config)

try {
  const { expirationDateTime } = await client.services.taxInvoice.getTaxCertificateExpirationDate({
    businessNumber: process.env.POPBILL_CORP_NUM!,
  })
  console.log('인증서 만료:', expirationDateTime)
} catch (error) {
  console.error(error)
}
```

서비스별 가입, 인증서, 발신번호 준비사항은 [서비스 가이드](../../docs/README.md)를 확인합니다.

## 클라이언트 설정

필수 값은 `linkId`, `secretKey`, `userId`입니다. 전체 타입은 `PopbillClientConfig`에서 확인합니다.

| 옵션               | 기본값       | 용도                                      |
| ------------------ | ------------ | ----------------------------------------- |
| `isTest`           | `false`      | 테스트 환경 사용                          |
| `useLocalTime`     | `true`       | 인증 시 로컬 UTC 시간 사용                |
| `requestTimeoutMs` | `180000`     | HTTP 한 건의 제한시간(ms), 본문 읽기 포함 |
| `fetch`            | 전역 `fetch` | 인증, 시간, 포인트, 업무, 파일 전송 함수  |
| `onError`          | 없음         | 실패한 호출의 최종 오류 관찰              |
| `acceptEncoding`   | `'gzip'`     | 요청 `Accept-Encoding` 헤더               |
| `acceptLanguage`   | 헤더 생략    | 요청 `Accept-Language` 헤더               |
| `useStaticIp`      | `false`      | 스태틱 IP 사용                            |
| `useGaIp`          | `false`      | GA IP 사용                                |
| `ipRestrictOnOff`  | `true`       | IP 제한 사용                              |

`acceptLanguage`에는 `ko-KR`, `en-US` 같은 HTTP 언어 우선순위 문자열을 지정합니다. 실제 지원 언어는 서버가 결정합니다.

## 전송 함수와 호출 취소

빠른 시작의 `config`를 재사용해 전송 함수를 지정하고, 호출 전체에 5초 기한을 적용하는 예입니다. `fetch` 함수 본문에 프록시, 서버 접근 제한, 관측 등 애플리케이션의 정책을 적용합니다.

```ts
const clientWithTransport = createPopbillClient({
  ...config,
  fetch: (input, init) => fetch(input, init),
})

try {
  const company = await clientWithTransport.services.common.getCompanyInfo(
    { businessNumber: process.env.POPBILL_CORP_NUM! },
    { signal: AbortSignal.timeout(5000) }
  )
  console.log(company.companyName)
} catch (error) {
  console.error(error)
}
```

모든 modern 서비스 메서드는 마지막 선택 인자로 `PopbillCallOptions`를 받습니다.

| 설정 또는 상황                                      | 동작                                                                 |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| `{ signal: controller.signal }`                     | `controller.abort(reason)`으로 인증 대기부터 응답 본문 읽기까지 중단 |
| 이미 취소된 `signal`                                | 새 HTTP 요청을 시작하지 않음                                         |
| 같은 인증을 기다리는 동시 호출                      | 취소를 호출별로 격리하며, 마지막 대기자가 취소되면 공유 인증도 중단  |
| `requestTimeoutMs`                                  | HTTP 한 건의 시작부터 본문 읽기 완료까지 적용                        |
| `AbortSignal.timeout(ms)`                           | 인증과 업무 요청을 포함한 호출 전체의 기한 지정                      |
| signal 취소와 SDK timeout 경합                      | 먼저 발생한 중단 원인 유지                                           |
| `useLocalTime: false`의 시간 조회 실패 또는 timeout | 로컬 UTC 시간으로 대체. 호출자 signal 취소는 대체 없이 전파          |

주입한 `fetch`는 전달된 `signal`과 응답 본문 취소를 지원해야 합니다. 이를 무시하면 SDK가 실제 네트워크 중단을 보장할 수 없습니다.

## 서비스

`client.services`에서 다음 서비스를 이용합니다.

| 구분        | 서비스                                 | 주요 기능                                             |
| ----------- | -------------------------------------- | ----------------------------------------------------- |
| 공통        | `common`                               | 회원, 담당자, 기업정보, 포인트, 결제, 환불            |
| 전자문서    | `taxInvoice`, `cashbill`, `statement`  | 세금계산서, 현금영수증, 전자명세서의 발행, 조회, 취소 |
| 홈택스 수집 | `homeTaxTaxInvoice`, `homeTaxCashbill` | 인증, 수집, 상태, 내역, 집계                          |
| 사업자 조회 | `closedown`, `bizInfoCheck`            | 휴폐업 상태와 기업정보                                |
| 금융 조회   | `easyFinBank`, `accountCheck`          | 계좌 관리, 거래내역 수집, 예금주 성명과 실명 조회     |
| 메시징      | `kakao`, `message`, `fax`              | 알림톡, 친구톡, 브랜드 메시지, 문자, MMS, 팩스        |

- **메서드, 요청 및 응답 타입:** 설치한 패키지의 타입 선언 또는 [로컬 SDK 레퍼런스](../../docs/sdk/README.md). 레퍼런스는 [문서 생성](../../docs/development.md#sdk-레퍼런스-생성) 후 열람합니다.
- **연동 흐름 및 레거시 차이:** [서비스 가이드](../../docs/README.md). modern API는 객체 인자를 받으며 레거시 호환 별칭을 제공하지 않습니다.
- **수집 API:** 작업 ID 저장 → 상태 조회 → 완료 상태와 성공 결과코드 확인 → 내역 조회 순서로 사용합니다. SDK는 자동 재요청이나 폴링을 하지 않습니다.

## 웹훅 수신

`@connextable/popbill/webhook`의 `createPopbillWebhookReceiver`로 별도 수신기를 만듭니다.

- **지원 상품:** 전자문서 3종, 홈택스 수집 2종, 카카오톡, 문자, 팩스
- **기능:** 인증, 단건 및 대량 파싱, 타입이 있는 이벤트, 성공 응답 구성
- **설정과 예제:** [웹훅 수신 가이드](../../docs/webhook.md)

## 응답과 오류 처리

- **응답:** 상태 및 분류 코드는 새로운 서버 값, `null`, 누락을 보존합니다. 미확정 플래그는 `=== true`, `=== false`로 구분합니다. [응답 처리 기준](../../docs/migration/2.0.md#응답-코드와-미확정-값)
- **실패:** Promise가 `PopbillApiError` 형태로 거절됩니다. `onError`에는 같은 최종 오류를 호출당 한 번 전달하며, 호출부에서도 오류를 처리해야 합니다.
- **재시도:** SDK는 자동 재시도하지 않습니다. 취소, SDK timeout, 본문 수신 실패는 `retriable: false`이며, `true`도 안전한 재전송을 보장하지 않습니다.

**HTTP 중단은 서버에 접수된 작업을 취소하지 않습니다.** 전송이나 발행이 중단되면 관리번호나 요청번호로 처리 여부를 먼저 조회합니다.

<details>
<summary>오류 필드와 분류 기준</summary>

| 필드                  | 의미                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `code`, `message`     | 오류 코드와 메시지                                                                            |
| `type`                | 입력 검증, 네트워크, timeout 등 오류 종류                                                     |
| `stage`               | `validate_input`(입력), `issue_token`(인증), `request_api`(업무 요청), `unknown`(단계 미확정) |
| `abort.source`        | `signal`(호출자 취소 또는 기한), `request_timeout`(SDK의 HTTP 제한시간)                       |
| `abort.reason`, `raw` | 원래 취소 원인. 전송 함수가 던진 원본 값도 `raw`에 보존                                       |

| 상황                                | 분류                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------- |
| 입력 검증 실패                      | `type: 'input_validation'`, `stage: 'validate_input'`                       |
| 호출 전 취소 또는 응답 매핑 중 예외 | `stage: 'unknown'`                                                          |
| 인증 또는 업무 요청 중 취소         | `issue_token` 또는 `request_api` 단계 유지                                  |
| 전송 함수의 코드 또는 설정 오류     | `type: 'unknown'`. 숫자 코드나 객체 모양을 원격 오류로 해석하지 않음        |
| SDK timeout                         | `type: 'timeout'`, 내부 코드 `-99999997`                                    |
| 본문 수신 중 연결 종료              | `type: 'network'`, 내부 코드 `-99999998`. 중첩된 socket 원인도 `raw`에 보존 |

</details>

## 전자명세서

- [전자명세서 가이드](../../docs/services/statement.md): 문서유형 코드, 등록, 발행, 조회, 세금계산서 첨부
- [실행 예제](../../examples/README.md#전자명세서-예제): 전체 연동 흐름

## 관련 문서

- [문서 안내와 서비스 가이드](../../docs/README.md)
- [예제 실행](../../examples/README.md)
- [생성 SDK 레퍼런스](../../docs/sdk/README.md)
- [1.1 → 2.0 이전 가이드](../../docs/migration/2.0.md): 응답 코드와 플래그 타입 변경
