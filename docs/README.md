# 문서 안내

처음 연동할 때는 [modern SDK](../packages/popbill/README.md), 기존 Popbill 코드를 이전할 때는 [compat SDK](../packages/popbill-compat/README.md)에서 시작합니다. 실행 가능한 시나리오는 [예제 가이드](../examples/README.md)에 있습니다.

## 서비스 사용 흐름과 계약 차이

아래 가이드는 여러 API를 연결하는 흐름과 공식 HTTP·Node 문서·레거시 사이의 차이를 설명합니다. API 이름·인자·DTO의 전체 목록은 설치한 패키지의 타입 선언에서 확인합니다.

[SDK 레퍼런스](./sdk/README.md)는 저장소 루트에서 `pnpm docs:generate`를 실행한 뒤 로컬에서 열람합니다. 생성 산출물은 Git에 포함되지 않습니다. 준비 방법은 [문서 생성](./development.md#sdk-레퍼런스-생성)을 확인합니다.

- 공통: [회원·담당자·기업정보·포인트·결제·환불](./services/common.md)
- 전자문서: [세금계산서](./services/tax-invoice.md), [현금영수증](./services/cashbill.md), [전자명세서](./services/statement.md)
- 홈택스 수집: [세금계산서](./services/home-tax-tax-invoice.md), [현금영수증](./services/home-tax-cashbill.md)
- 사업자 조회: [휴폐업·기업정보 예제](../examples/src/lookup/README.md)
- 금융 조회: [계좌 거래내역](./services/easy-fin-bank.md), [예금주 조회 예제](../examples/src/lookup/README.md)
- 메시징: [카카오톡](./services/kakao.md), [문자](./services/message.md), [팩스](./services/fax.md)

## 개발과 운영

- [개발 환경·검증·문서 생성](./development.md)
- [패키지 릴리스·복구](./release.md)

## 마이그레이션 기록

[1.1 → 2.0 이전 가이드](./migration/2.0.md)는 응답 타입 변경과 호출부 수정 방법을 설명합니다.

[구현 범위와 의도적인 계약 차이](./migration/service-coverage.md)는 공개 범위와 제한을 설명합니다. [modern 구현 이력](./migration/popbill-modern.todo.md)과 [compat 구현 이력](./migration/popbill-compat.todo.md)은 진행 이력이며 사용 가이드가 아닙니다. 완료 당시의 검사 결과는 [검증 기록](./migration/validation-history.md)에 보관합니다.
