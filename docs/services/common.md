# 회원·포인트 API

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#회원포인트-예제) · [API 레퍼런스](../sdk/popbill/common/index.md)

`client.services.common`에서 회원·담당자·회사정보와 포인트 조회·결제·환불 API를 제공합니다. [modern SDK 설정](../../packages/popbill/README.md)의 기본 사용자 ID와 별개로, 신규회원·담당자·ID 중복조회 대상은 각 요청에 지정합니다.

## 회원 확인과 포인트 조회

다음 예제는 이미 생성한 클라이언트로 회원 여부를 확인하고, 가입된 사업자의 잔액을 조회합니다. 사업자번호는 조회할 회원의 값으로 바꿉니다.

```ts
const input = { businessNumber: '1234567890' }
const membership = await client.services.common.checkMemberRegistration(input)
if (membership.isMember === true) {
  const balance = await client.services.common.getMemberPointBalance(input)
  console.log(balance.remainingPoints)
}
```

`isMember`는 회원 여부의 판정값이고 `resultCode`는 원본 코드입니다. 숫자 `1`과 숫자 문자열 `"1"`은 같은 성공으로 판단하지만, 알 수 없는 값은 성공으로 추측하지 않습니다.

금액과 포인트는 문자열을 유지합니다. 내역 조회 날짜는 `yyyyMMdd` 형식이며 기본 페이지는 1, 기본 페이지 크기는 500입니다. 페이지 크기의 상한은 팝빌 서버가 검증합니다.

## 결제·환불 신청과 처리 확인

`requestPointPayment`는 무통장 입금 신청을 접수하고 `settlementCode`를 반환합니다. 입금 승인 여부는 `getPointPaymentInfo`에서 확인합니다. `requestPointRefund`는 환불 신청을 접수하고 `refundCode`를 반환하며, 처리 상태는 `getPointRefundInfo`에서 조회합니다. 신청 성공은 입금 승인이나 환불 완료를 뜻하지 않습니다.

신청 응답에서 받은 식별코드를 보관하고 해당 코드로 처리 상태를 조회합니다. 입금·환불은 계정별 권한과 실제 결제 절차를 동반하므로 [포인트 예제](../../examples/README.md#회원포인트-예제)의 설정과 실행 조건을 확인합니다.

## 기존 코드 이전

compat는 BaseService의 기존 메서드와 위치 인자를 유지합니다. `getPopbillURL`은 레거시에만 제공하며 modern에서는 `getLoginURL`과 목적별 포인트 URL을 사용합니다. compat의 `getRefundableBalance`는 레거시 코드처럼 `{ refundableBalance }` 응답을 유지하고, modern은 `{ refundablePoints }`로 반환합니다.

환불 요청의 compat 필드는 레거시 표기를 유지합니다. modern은 객체 DTO를 사용하므로 두 SDK의 입력 객체를 그대로 공유하지 않습니다. 전체 서명은 [compat 레퍼런스](../sdk/popbill-compat/common/index.md), 응답 코드·오류의 처리 기준은 [2.0 이전 가이드](../migration/2.0.md#응답-코드와-미확정-값)를 확인합니다.

- [공식 회원 API](https://developers.popbill.com/api-reference/taxinvoice/common-api/member)
- [공식 포인트 HTTP API](https://developers.popbill.com/api-reference/taxinvoice/common-api/point)
- [공식 Node 포인트 API](https://developers.popbill.com/reference/taxinvoice/node/common-api/point)
