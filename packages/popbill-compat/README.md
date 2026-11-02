# @connextable/popbill-compat

기존 Popbill JavaScript 인터페이스에서 TypeScript로 이전하기 위한 호환 SDK입니다.

기존 코드가 callback 스타일 서비스 팩토리에 의존하거나, `@connextable/popbill`로 한 번에 전환하기보다 단계적으로 이전해야 할 때 사용합니다.

## 요구사항

- Node.js 20+

## 설치

```sh
npm install @connextable/popbill-compat
```

## Callback API

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

| 서비스 생성자                                                | 기능                                  |
| ------------------------------------------------------------ | ------------------------------------- |
| 공통 factory 및 각 서비스의 상속 메서드                      | 회원·담당자·기업정보·포인트·결제·환불 |
| `TaxinvoiceService` / `CashbillService` / `StatementService` | 전자세금계산서·현금영수증·전자명세서  |
| `HTTaxinvoiceService` / `HTCashbillService`                  | 홈택스 수집                           |
| `ClosedownService` / `BizInfoCheckService`                   | 휴폐업·기업정보 조회                  |
| `EasyFinBankService` / `AccountCheckService`                 | 계좌 거래내역·예금주 조회             |
| `KakaoService` / `MessageService` / `FaxService`             | 카카오톡·문자·팩스                    |

도메인 서비스는 callback·`/promise`·`/factory` 진입점을 제공합니다. factory 함수는 `createCashbillService`, `createCashbillPromiseService`처럼 기존 서비스명에 대응합니다. 공개 서비스 인스턴스에는 회원·포인트 등 공통 메서드도 연결되어 있습니다. 공통 메서드만 필요하면 `/factory`의 `createCommonService` 또는 `createCommonPromiseService`를 사용합니다.

선택 인자 자리에 `undefined`를 전달하는 callback 호출은 성공·오류 두 슬롯을 명시합니다. 예: `service.getCorpInfo(corpNum, undefined, success, undefined)`. 인자 조합별 정확한 서명은 [생성 문서](../../docs/sdk/README.md)를 확인합니다.

서비스 사용 흐름과 원본 SDK와의 계약 차이는 [서비스 가이드](../../docs/README.md)를 확인합니다.

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

`search`에서 중간 선택값을 생략할 때는 `undefined`로 뒤 인자 위치를 유지합니다. 검색어를 받는 전체형에서 `Order`를 생략하려면 `QString, Order, Page, PerPage, UserID` 다섯 자리를 모두 전달합니다. 예를 들어 마지막 인자들은 `'검색어', undefined, undefined, 10, undefined`로 지정합니다. 검색어 없는 단축형은 `'D', undefined, 10`처럼 페이지 번호만 생략할 수 있습니다.

## Export Paths

- `@connextable/popbill-compat`: callback 호환 싱글톤 API
- `@connextable/popbill-compat/promise`: promise 호환 싱글톤 API
- `@connextable/popbill-compat/factory`: 명시적 factory API
- `@connextable/popbill-compat/errors`: 호환 에러 헬퍼

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 예제: [../../examples/README.md](../../examples/README.md)
- 생성 SDK 문서: [../../docs/sdk/README.md](../../docs/sdk/README.md)
