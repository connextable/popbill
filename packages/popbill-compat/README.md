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

## Export Paths

- `@connextable/popbill-compat`: callback 호환 싱글톤 API
- `@connextable/popbill-compat/promise`: promise 호환 싱글톤 API
- `@connextable/popbill-compat/factory`: 명시적 factory API
- `@connextable/popbill-compat/errors`: 호환 에러 헬퍼

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 예제: [../../examples/README.md](../../examples/README.md)
- 생성 SDK 문서: [../../docs/sdk/README.md](../../docs/sdk/README.md)
