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
import type { PopbillApiRequestHeaders, StatementSpec, TaxInvoiceSpec } from '@connextable/popbill-spec'
```

전자명세서 원본 모델을 직접 작성할 때는 전용 진입점을 사용합니다. `StatementItemCodes`는 거래명세서·청구서·견적서·발주서·입금표·영수증의 코드(`121`~`126`)를 제공합니다.

```ts
import { StatementItemCodes, type StatementGetInfoApiRequest } from '@connextable/popbill-spec/statement'

const request: StatementGetInfoApiRequest = {
  corpNum: process.env.POPBILL_CORP_NUM!,
  path: {
    ItemCode: StatementItemCodes.TradeStatement,
    MgtKey: 'EXISTING-STATEMENT-001',
  },
}
```

`StatementSpec`은 타입 namespace이며 원본 요청·응답 타입을 담습니다. 이 패키지는 HTTP 요청을 실행하지 않습니다.

## Export Paths

- `@connextable/popbill-spec`: 공통 인증·헤더·요청·오류 코드와 전체 서비스의 원본 타입
- `@connextable/popbill-spec/common`: 회원·담당자·포인트·결제·환불
- `@connextable/popbill-spec/tax-invoice`: 전자세금계산서 요청/응답 모델
- `@connextable/popbill-spec/tax-invoice/shims`: 호환 shim 타입
- `@connextable/popbill-spec/cashbill`: 현금영수증
- `@connextable/popbill-spec/statement`: 전자명세서 요청/응답 모델과 문서유형·상태 코드
- `@connextable/popbill-spec/home-tax-tax-invoice`: 홈택스 세금계산서 수집
- `@connextable/popbill-spec/home-tax-cashbill`: 홈택스 현금영수증 수집
- `@connextable/popbill-spec/closedown`: 휴폐업 조회
- `@connextable/popbill-spec/biz-info-check`: 기업정보 조회
- `@connextable/popbill-spec/easy-fin-bank`: 계좌 거래내역 조회
- `@connextable/popbill-spec/account-check`: 예금주 조회
- `@connextable/popbill-spec/kakao`: 카카오톡
- `@connextable/popbill-spec/message`: 문자
- `@connextable/popbill-spec/fax`: 팩스

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 생성 SDK 문서: [../../docs/sdk/README.md](../../docs/sdk/README.md)
