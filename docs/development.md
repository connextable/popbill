# 개발과 검증

저장소 루트에서 다음 명령을 실행합니다. 패키지 소비자의 Node.js 요구사항은 각 패키지 `package.json`의 `engines.node`를 따릅니다.

## 개발 환경

| 항목           | 도구                      |
| -------------- | ------------------------- |
| 실행 환경      | Node.js                   |
| 패키지 관리    | pnpm                      |
| 언어·타입 검사 | TypeScript · `tsc`        |
| 빌드           | tsdown · Turborepo        |
| 린트·포맷      | Oxlint · Oxfmt            |
| 테스트         | Vitest                    |
| 문서 생성 API  | `@typescript/typescript6` |
| Node 타입      | `@types/node`             |

개발용 Node.js 지원 범위는 [루트 package.json](../package.json)의 `engines.node`, pnpm 버전은 `packageManager`를 따릅니다. 도구 의존성은 각 `package.json`과 [pnpm-lock.yaml](../pnpm-lock.yaml)을 기준으로 설치합니다.

```sh
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check`는 CI와 릴리스 검증의 공통 명령입니다. 빌드·타입 검사·린트·테스트·포맷 검사 후 `pnpm check:packages`로 임시 pack한 SDK의 진입점·선언 파일·소비자 타입을 확인합니다. 각 검사는 `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm fmt:check`로 따로 실행할 수 있습니다.

`pnpm test`는 패키지 발행 검사·문서 생성기·패키지 테스트를 포함합니다. `pnpm test:release`는 tarball 검사와 GitHub Packages 미러 로직을 검증합니다. 실서버 테스트는 기본적으로 건너뜁니다. 실행 조건과 플래그는 [루트 환경변수 예시](../.env.example)에 있습니다. 로컬 HTTP mock 통과와 실제 서비스 계정·권한·발행·발송 검증은 구분합니다.

## SDK 레퍼런스 생성

```sh
pnpm docs:generate
pnpm test:docs
```

`scripts/generate-sdk-docs.ts`가 `methods.ts`, 공개 서비스 서명과 DTO에서 [SDK 레퍼런스](./sdk/README.md) 및 JSON 메타데이터를 생성합니다. `docs/sdk`는 생성 산출물이므로 직접 편집하지 않습니다. 메서드의 순서·분류는 각 서비스의 `methods.ts`, 필드 순서는 DTO 선언을 수정한 뒤 재생성합니다. JSON 스키마는 문서 조회용 메타데이터이며 외부 응답을 런타임에 검증하는 스키마가 아닙니다. 자동 추출할 수 없는 외부·조건부 타입은 미해결 상태로 남깁니다.

사용·개발·릴리스 문서에는 현재·다음 패키지 버전이나 도구 버전을 중복 기재하지 않고 설정 파일과 릴리스 결과를 참조합니다. 마이그레이션 대상과 과거 검증 환경처럼 이력을 설명하는 버전은 해당 기록에 남깁니다.

서비스는 공통 → 전자문서 → 홈택스 수집 → 사업자 조회 → 금융 조회 → 메시징 순으로 탐색하고, 독립 웹훅 진입점은 서비스 목록 뒤에 둡니다. 웹훅 DTO는 공통 타입 다음에 같은 상품의 상태·대량 결과·인증서 타입을 모읍니다. 웹훅 레퍼런스는 생성 → 파싱 → 성공 응답 순서로 안내합니다. 위치 인자가 있는 compat 계약은 이름을 정리하기 위해 순서를 바꾸지 않습니다.

## 예제와 릴리스

[예제 가이드](../examples/README.md)에서 환경변수와 실행 모드를 확인합니다. `--help` 검사는 실제 API 실행을 대신하지 않습니다. 발행·발송·결제·실계좌 조회 등의 실제 실행 여부는 검증 결과에 별도로 기록합니다.

릴리스는 `main`의 `Release` Actions를 수동 실행합니다. Releaseway가 버전·태그·npm 발행을 맡습니다. 로컬 tarball 검사와 실행·복구 절차는 [패키지 릴리스](./release.md)를 확인합니다.
