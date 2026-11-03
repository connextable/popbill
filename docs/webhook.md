# 웹훅 수신

팝빌에서 보낸 이벤트를 `@connextable/popbill/webhook`으로 인증·파싱합니다. API 호출용 클라이언트나 LinkID·SecretKey는 필요하지 않습니다. 수신 URL, 회원별 권한 확인, 영속 저장·중복 처리와 업무 반영은 애플리케이션에서 담당합니다.

## 처음 수신하기

팝빌에 등록한 웹훅 API Key를 `POPBILL_WEBHOOK_API_KEY`에 설정합니다. 아래 `inbox`는 애플리케이션이 제공하는 영속 저장소이며, 같은 전송이 반복되어도 안전하게 저장해야 합니다.

```ts
import { createPopbillWebhookReceiver } from '@connextable/popbill/webhook'

const receiver = createPopbillWebhookReceiver({
  authentication: { type: 'apiKey', apiKey: process.env.POPBILL_WEBHOOK_API_KEY! },
})

export async function POST(request: Request) {
  const message = receiver.parse({
    headers: request.headers,
    body: await request.text(),
  })

  await inbox.save(message)
  const acknowledgement = receiver.createSuccessResponse()
  return new Response(acknowledgement.body, acknowledgement)
}
```

`parse`는 동기 함수입니다. 인증과 JSON·배치 구조를 확인한 뒤 `PopbillWebhookMessage`를 반환하며, HTTP 응답이나 데이터 저장은 실행하지 않습니다. 위 예제의 파싱 예외는 서버의 오류 처리기로 전달됩니다. 오류별 응답 예시는 아래를 참고합니다.

실행 가능한 Node HTTP 예제는 `pnpm -C examples webhook -- --help`에서 확인합니다. [예제 실행](../examples/README.md#웹훅-수신-예제)

## 팝빌 설정

수신할 상품마다 Callback URL을 등록합니다. 회원 URL은 팝빌 사이트의 상품별 관리 → Webhook 설정에서 등록하고, 여러 회원을 받는 파트너 URL은 팝빌에 등록을 요청합니다. 테스트·운영 설정은 각각 등록합니다.

콜백 포트는 현재 공식 규약의 `80`, `443`, `9854`를 따릅니다. 방화벽 Source IP와 등록 절차는 [공식 웹훅 개요](https://developers.popbill.com/api-reference/taxinvoice/webhook/introduction)를 확인합니다. SDK는 웹훅 등록용 API를 제공하지 않습니다.

## 인증 선택

`authentication`은 필수 설정입니다. 빈 인증정보는 receiver 생성 시 오류입니다. API 호출용 HMAC·Bearer 인증과 웹훅 인증은 별개입니다.

```ts
// 팝빌에 등록한 X-Api-Key 값
createPopbillWebhookReceiver({ authentication: { type: 'apiKey', apiKey: 'configured-key' } })

// 팝빌에 등록한 HTTP Basic 인증정보
createPopbillWebhookReceiver({
  authentication: { type: 'basic', username: 'configured-user', password: 'configured-password' },
})

// 팝빌에서 웹훅 인증을 사용하지 않도록 설정한 경우 명시적으로 선택
createPopbillWebhookReceiver({ authentication: { type: 'none' } })
```

인증정보는 생성 시 복사됩니다. 설정 객체를 나중에 바꿔도 기존 receiver의 인증값은 바뀌지 않습니다. 헤더 이름은 대소문자를 구분하지 않습니다. API Key 값은 공백을 포함해 그대로 비교하며, Basic 사용자명에는 콜론을 사용할 수 없습니다. 비밀번호의 콜론은 허용합니다.

## 입력과 반환값

`headers`에는 표준 `Headers` 또는 Node의 `request.headers`를 전달합니다. Node 헤더의 단일 항목 배열은 지원하지만 여러 값이나 대소문자만 다른 중복 키는 거절합니다. `Pb-Webhook-Type`, `Pb-Webhook-MID`, `Pb-Webhook-Corpnum`은 필수입니다. Content-Type이 있으면 `application/json`이어야 하며 charset 등 매개변수는 허용합니다.

`body`는 JSON 문자열, UTF-8 `Uint8Array`/`Buffer`, 이미 파싱된 객체 또는 배치 배열을 지원합니다. HTTP 본문 크기 제한은 애플리케이션 서버에서 설정합니다.

| 메시지 필드       | 의미                                        |
| ----------------- | ------------------------------------------- |
| `messageId`       | HTTP 헤더의 `Pb-Webhook-MID`                |
| `businessNumber`  | HTTP 헤더의 수신 회원 사업자번호            |
| `webhookType`     | HTTP 헤더의 웹훅 유형                       |
| `headerEventType` | 선택 HTTP 헤더의 이벤트 유형 원문           |
| `events`          | 단건도 배열로 반환하는 이벤트 목록          |
| `rawBody`         | 파싱된 원본 본문. 인증 헤더는 포함하지 않음 |

각 이벤트에는 `kind`, `data`, `raw`, `webhookType`, `businessNumber`, `index`가 있습니다. 원본에 해석할 수 있는 문자열이 있으면 `eventType`, `occurredAt`도 읽을 수 있고, 배치에서는 `batchHeader`를 보존합니다. 본문 사업자번호는 해당 DTO의 `data.businessNumber` 등으로 별도 보존합니다. 수신 회원과 문서 당사자가 같다고 가정하지 않습니다.

단건 객체는 이벤트 하나로 변환합니다. 대량 `{ header, body }[]`에서는 항목별 `TYPE`, `CORPNUM`, `QMNum` 등의 메타데이터와 입력 순서를 보존합니다. 항목에 `TYPE`·`CORPNUM`이 없으면 HTTP 헤더를 사용합니다. 빈 배치는 `events: []`이며, 잘못된 항목이 있으면 부분 결과 대신 전체 파싱이 실패합니다.

## 상품별 이벤트

| 상품·공식 계약                                                                                       | `kind`                                  | 원본 이벤트                                                                              |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| [전자세금계산서](https://developers.popbill.com/api-reference/taxinvoice/webhook/webhook-event)      | `taxInvoice.state`                      | `Issue`, `CancelIssue`, `CLOSEDOWN`, `NTS`, `OPEN`, `Request`, `CancelRequest`, `Refuse` |
| 전자세금계산서                                                                                       | `taxInvoice.bulkResult`                 | `BULK.RESULT`                                                                            |
| 전자세금계산서                                                                                       | `taxInvoice.certificate`                | `REGIST`, `DELETE`                                                                       |
| [현금영수증](https://developers.popbill.com/api-reference/cashbill/webhook/webhook-event)            | `cashbill.state`, `cashbill.bulkResult` | `Issue`, `NTS`, `BULK.RESULT`                                                            |
| [전자명세서](https://developers.popbill.com/api-reference/statement/webhook/webhook-event)           | `statement.state`                       | `Issue`, `Cancel`, `OPEN`                                                                |
| [홈택스 세금계산서](https://developers.popbill.com/api-reference/httaxinvoice/webhook/webhook-event) | `homeTaxTaxInvoice.collected`           | `HT.TAXINVOICEXML`                                                                       |
| [홈택스 현금영수증](https://developers.popbill.com/api-reference/htcashbill/webhook/webhook-event)   | `homeTaxCashbill.collected`             | `HT.CASHBILL`                                                                            |
| [카카오톡](https://developers.popbill.com/api-reference/kakaotalk/webhook/webhook-event)             | `kakao.result`                          | `RESULT`                                                                                 |
| [문자](https://developers.popbill.com/api-reference/sms/webhook/webhook-event)                       | `message.result`                        | `RESULT`                                                                                 |
| [팩스](https://developers.popbill.com/api-reference/fax/webhook/webhook-event)                       | `fax.result`                            | `RESULT`                                                                                 |

문서·메시징 수동 재실행의 `MANUAL`은 원문을 유지합니다. 문서 배치 결과는 본문 구조로 구분하며, 원래 이벤트가 `Issue` 또는 `NTS`였다고 추측하지 않습니다. 홈택스는 수집된 문서의 본문을 전달하므로 존재하지 않는 `eventType`·이벤트 실행시각·작업 완료 상태를 만들어내지 않습니다.

`kind`를 검사하면 `data`가 해당 도메인 DTO로 좁혀집니다. 기존 조회 API와 같은 매퍼·필드명·정규화 함수를 사용합니다. 세금계산서 상태 웹훅의 `itemKey`는 필수이며, 전체 문서 조회에서만 제공하는 거래처 상세 필드 등은 선택값입니다.

```ts
for (const event of message.events) {
  if (event.kind === 'taxInvoice.state') {
    console.log(event.data.itemKey, event.data.stateCode)
  } else if (event.kind === 'message.result') {
    console.log(event.data.receiptNumber, event.data.resultCode)
  } else if (event.kind === 'unknown') {
    await pendingEvents.save(event.raw)
  }
}
```

알 수 없는 웹훅/이벤트는 `kind: 'unknown'`, `data: unknown`과 원문으로 반환합니다. 추가 필드는 `raw`·`rawBody`에 남으며 DTO에 자동 복사하지 않습니다. 날짜·금액·식별번호는 문자열을 유지합니다. 코드·플래그의 새 값과 `null`은 [기존 응답 처리 기준](./migration/service-coverage.md#외부-api-계약-검증)을 따릅니다. 인증서 정책 식별자는 예제의 `oid`와 표의 `OID`를 지원하며 둘 다 있으면 `oid`를 사용합니다.

## 오류·성공 응답과 재전송

| `PopbillWebhookError.code` | 발생 시점                            | 애플리케이션 처리 예       |
| -------------------------- | ------------------------------------ | -------------------------- |
| `INVALID_CONFIGURATION`    | receiver 생성                        | 설정을 수정한 뒤 서버 시작 |
| `AUTHENTICATION_FAILED`    | 인증 누락·불일치                     | HTTP 401                   |
| `INVALID_HEADERS`          | 필수 메타 누락·중복·형식 오류        | HTTP 400                   |
| `INVALID_PAYLOAD`          | 깨진 JSON·필수 식별값·배치 구조 오류 | HTTP 400                   |

이 오류는 외부 API 호출의 `PopbillApiError`와 별도입니다. 저장소·큐 장애는 애플리케이션 오류로 처리하며 성공 응답을 보내지 않습니다. 팝빌은 실패 응답도 재전송 대상으로 처리합니다.

`createSuccessResponse()`는 HTTP 200, JSON 본문 `{"result":"OK"}`와 Content-Type을 반환합니다. 파싱만 끝난 시점이 아니라 전체 메시지를 영속 저장하거나 업무 처리를 완료한 뒤 전송합니다. 이미 저장된 중복도 안전하게 확인한 뒤 같은 성공 응답을 반환합니다.

팝빌 재전송·수동 재실행으로 중복이 올 수 있습니다. 회원·환경과 메시지/문서 식별자를 함께 고려해 저장 전략을 정하고, 같은 식별자에 다른 내용이 오면 덮어쓰지 않습니다. SDK는 MID가 모든 재전송에서 유지된다는 보장, 한 번만 처리되는 효과, 이벤트 도착 순서를 보장하지 않습니다. 메시지 저장과 후속 큐 등록은 애플리케이션의 트랜잭션 경계로 묶습니다.

Express에서는 `receiver.parse({ headers: req.headers, body: req.body })`를 사용합니다. 저장 후 `const ack = receiver.createSuccessResponse()`를 만들고 `res.status(ack.status).set(ack.headers).send(ack.body)`로 응답합니다. `PopbillWebhookError`는 `instanceof`와 `code`로 분기해 위 표에 맞춰 처리합니다.

## 원본 계약과 검증 범위

원본 타입과 유형 상수는 `@connextable/popbill-spec/webhook`에서 가져옵니다. 각 도메인의 원본 모델에도 웹훅 본문 타입을 제공합니다. [생성 SDK 레퍼런스](./sdk/popbill/webhook/index.md)는 `pnpm docs:generate`로 생성합니다.

공식 예제 26건은 출처·확인일과 함께 테스트 fixture로 고정했습니다. 로컬 fixture·HTTP 예제·설치 tarball 검증은 실제 팝빌 계정의 콜백 등록·외부 네트워크·실제 재전송을 검증하는 것과 구분합니다.
