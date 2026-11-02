# 회원·포인트 API

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#추가-서비스-예제)

`client.services.common`에서 회원·담당자·회사정보와 포인트 조회·결제·환불 API를 제공합니다. 사용자 ID와 링크 아이디는 client 설정에서 가져옵니다.

```ts
const input = { businessNumber: '1234567890' }
const membership = await client.services.common.checkMemberRegistration(input)
if (membership.isMember) {
  const balance = await client.services.common.getMemberPointBalance(input)
  console.log(balance.remainingPoints)
}
```

금액과 포인트는 문자열을 유지합니다. 날짜는 `yyyyMMdd` 형식이며, 내역 조회의 기본 페이지는 1, 기본 페이지 크기는 500, 최대 크기는 1,000입니다.

`requestPointPayment`는 무통장 입금 신청을 접수하고 `settlementCode`를 반환합니다. 입금 승인 여부는 `getPointPaymentInfo`에서 확인합니다. `requestPointRefund`는 환불 신청을 접수하고 `refundCode`를 반환하며, 처리 상태는 `getPointRefundInfo`에서 조회합니다. 신청 성공은 입금 승인이나 환불 완료를 뜻하지 않습니다.

포인트 잔액 및 파트너 충전 URL은 Linkhub 인증 서버를 호출합니다. 나머지 API는 설정한 팝빌 테스트·운영 서버를 사용합니다. 회원·아이디 조회와 회원가입은 인증 토큰 없이 호출합니다.

compat는 BaseService의 기존 메서드와 위치 인자를 유지합니다. `getPopbillURL`은 레거시에만 제공하며 modern에서는 `getLoginURL`과 목적별 포인트 URL을 사용합니다. compat의 `getRefundableBalance`는 레거시 코드처럼 `{ refundableBalance }` 응답을 유지하고, modern은 `{ refundablePoints }`로 반환합니다.

환불 요청 필드명은 공식 Node 문서의 PascalCase와 HTTP 문서의 소문자 표기가 다릅니다. compat는 레거시 입력을 변경 없이 전송하고 modern은 HTTP 문서의 필드명을 사용합니다. 실제 환불 요청은 로컬 계약 테스트에서 실행하지 않습니다.

- [공식 회원 API](https://developers.popbill.com/api-reference/taxinvoice/common-api/member)
- [공식 포인트 HTTP API](https://developers.popbill.com/api-reference/taxinvoice/common-api/point)
- [공식 Node 포인트 API](https://developers.popbill.com/reference/taxinvoice/node/common-api/point)
