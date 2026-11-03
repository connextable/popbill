# @connextable/popbill-compat

기존 Popbill JavaScript 인터페이스에서 TypeScript로 이전하기 위한 호환 SDK입니다.

기존 코드가 callback 스타일 서비스 팩토리에 의존하거나, `@connextable/popbill`로 한 번에 전환하기보다 단계적으로 이전해야 할 때 사용합니다.

1.1에서 업그레이드할 때는 [2.0 이전 가이드](../../docs/migration/2.0.md)의 미구현 서비스 구현과 반환 타입 변경을 확인합니다.

## 요구사항

- Node.js: [package.json](./package.json)의 `engines.node` 지원 범위
- ESM·CommonJS 진입점 지원

## 설치

```sh
npm install @connextable/popbill-compat
```

## Callback API

Popbill 연동 아이디·base64 비밀키·회원 아이디·사업자등록번호를 각각 `POPBILL_LINK_ID`, `POPBILL_SECRET_KEY`, `POPBILL_USER_ID`, `POPBILL_CORP_NUM` 환경변수에 설정합니다. 아래 예제는 테스트 환경에 등록된 공동인증서의 만료일을 조회합니다.

callback 방식은 성공 콜백과 에러 콜백을 함께 전달합니다.

```ts
import { config, TaxinvoiceService } from '@connextable/popbill-compat'

config({
  LinkID: process.env.POPBILL_LINK_ID!,
  SecretKey: process.env.POPBILL_SECRET_KEY!,
  IsTest: true,
  UseLocalTimeYN: true,
})

const taxinvoice = TaxinvoiceService()

taxinvoice.getCertificateExpireDate(
  process.env.POPBILL_CORP_NUM!,
  process.env.POPBILL_USER_ID!,
  (expireDate) => {
    console.log(expireDate)
  },
  (error) => {
    console.error(error)
  }
)
```

## Promise API

```ts
import { config, TaxinvoiceService } from '@connextable/popbill-compat/promise'

config({
  LinkID: process.env.POPBILL_LINK_ID!,
  SecretKey: process.env.POPBILL_SECRET_KEY!,
  IsTest: true,
  UseLocalTimeYN: true,
})

const taxinvoice = TaxinvoiceService()

try {
  const expireDate = await taxinvoice.getCertificateExpireDate(process.env.POPBILL_CORP_NUM!, process.env.POPBILL_USER_ID!)

  console.log(expireDate)
} catch (error) {
  console.error(error)
}
```

## Factory API

싱글톤 설정 대신 독립적인 서비스 인스턴스가 필요하면 factory export를 사용합니다.

```ts
import { createTaxinvoicePromiseService } from '@connextable/popbill-compat/factory'

const taxinvoice = createTaxinvoicePromiseService({
  LinkID: process.env.POPBILL_LINK_ID!,
  SecretKey: process.env.POPBILL_SECRET_KEY!,
  IsTest: true,
  UseLocalTimeYN: true,
})
```

## 지원 서비스

- 공통: 각 서비스의 회원·담당자·기업정보·포인트·결제·환불 메서드
- 전자문서: `TaxinvoiceService`, `CashbillService`, `StatementService`
- 홈택스 수집: `HTTaxinvoiceService`, `HTCashbillService`
- 사업자 조회: `ClosedownService`, `BizInfoCheckService`
- 금융 조회: `EasyFinBankService`, `AccountCheckService`
- 메시징: `KakaoService`, `MessageService`, `FaxService`

도메인 서비스는 callback·`/promise`·`/factory` 진입점을 제공합니다. factory 함수는 `createCashbillService`, `createCashbillPromiseService`처럼 기존 서비스명에 대응합니다. 공개 서비스 인스턴스에는 회원·포인트 등 공통 메서드도 연결되어 있습니다. 공통 메서드만 필요하면 `/factory`의 `createCommonService` 또는 `createCommonPromiseService`를 사용합니다.

선택 인자 자리에 `undefined`를 전달하는 callback 호출은 성공·오류 두 슬롯을 명시합니다. 예: `service.getCorpInfo(corpNum, undefined, success, undefined)`. 인자 조합별 정확한 서명은 설치한 패키지의 타입 선언이나 [로컬 SDK 레퍼런스](../../docs/sdk/README.md)를 확인합니다. SDK 레퍼런스는 [문서 생성](../../docs/development.md#sdk-레퍼런스-생성) 후 로컬에서 열람합니다.

서비스 사용 흐름과 원본 SDK와의 계약 차이는 [서비스 가이드](../../docs/README.md)를 확인합니다.

## 응답과 오류 처리

compat는 레거시 필드 이름을 유지하며 대부분 원본 응답이나 필요한 필드를 그대로 반환합니다. TypeScript의 응답 타입이 모든 서버 값의 런타임 검증을 뜻하지는 않습니다. 새로운 상태 코드·`null`·누락의 처리 기준은 [2.0 이전 가이드](../../docs/migration/2.0.md#응답-코드와-미확정-값)를 확인합니다.

callback 호출은 오류 콜백으로, Promise 호출은 거절된 Promise로 오류를 전달합니다. `code`·`message`를 확인하고, 정규화된 `PopbillApiError`에는 추가로 `stage`·`retriable`이 있습니다. 일부 레거시 입력 검증 오류는 `code`를 가진 `Error`로 전달됩니다. 전송·발행 요청의 시간초과는 처리 여부가 미확정일 수 있으므로 관리번호나 요청번호로 먼저 조회합니다.

## 전자명세서

전자세금계산서와 같은 callback, promise, factory 진입점을 제공합니다. 문서유형 코드와 발행 흐름은 [전자명세서 가이드](../../docs/services/statement.md)를 확인합니다.

다음은 독립적인 promise 서비스로 저장된 거래명세서를 조회하는 예입니다. `managementKey`는 등록된 문서의 관리번호로 바꿉니다.

```ts
import { createStatementPromiseService } from '@connextable/popbill-compat/factory'

const statement = createStatementPromiseService({
  LinkID: process.env.POPBILL_LINK_ID!,
  SecretKey: process.env.POPBILL_SECRET_KEY!,
  IsTest: true,
  UseLocalTimeYN: true,
})

const managementKey = 'EXISTING-STATEMENT-001'

try {
  const info = await statement.getInfo(process.env.POPBILL_CORP_NUM!, 121, managementKey, process.env.POPBILL_USER_ID!)
  console.log(info)
} catch (error) {
  console.error(error)
}
```

싱글톤 방식은 callback 진입점 또는 `/promise` 진입점에서 `StatementService`를 import하고 `config` 호출 후 `StatementService()`로 생성합니다. callback factory는 `/factory`의 `createStatementService`입니다.

`register`로 임시저장하고, `registIssue`로 즉시발행합니다. 발행 요청의 응답을 받지 못하면 같은 문서유형·관리번호로 `getInfo`를 호출해 발행 여부를 먼저 확인합니다.

`search`의 중간 선택값을 생략하는 방법은 [전자명세서 가이드](../../docs/services/statement.md)를 확인합니다. 위치 인자를 옮기지 않고 `undefined`로 생략해야 합니다.

## Export Paths

- `@connextable/popbill-compat`: callback 호환 싱글톤 API
- `@connextable/popbill-compat/promise`: promise 호환 싱글톤 API
- `@connextable/popbill-compat/factory`: 명시적 factory API
- `@connextable/popbill-compat/errors`: 호환 에러 헬퍼

## 관련 문서

- [문서 안내와 서비스 가이드](../../docs/README.md)
- [예제 실행](../../examples/README.md)
- [생성 SDK 레퍼런스](../../docs/sdk/README.md)
