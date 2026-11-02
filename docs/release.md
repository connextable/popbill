# 패키지 릴리스

```sh
pnpm release minor
```

`develop` 작업 → 로컬 검증 → `main` 병합·푸시 → Releaseway npm 발행 → GitHub Packages 미러.

## 최초 설정

### npm Trusted Publisher

공개 패키지 6개에 각각 설정:

- `@connextable/popbill-spec`
- `@connextable/popbill-utils`
- `@connextable/popbill-runtime`
- `@connextable/popbill-juso`
- `@connextable/popbill-compat`
- `@connextable/popbill`

| 항목              | 설정                                                                               |
| ----------------- | ---------------------------------------------------------------------------------- |
| 패키지            | npm에 등록된 기존 패키지                                                           |
| GitHub 소유자     | `connextable`                                                                      |
| 저장소            | `popbill`                                                                          |
| 워크플로 파일     | `release.yml`                                                                      |
| Environment       | 빈 값                                                                              |
| Allow npm publish | 활성화                                                                             |
| 발행 정책         | [`.github/npm/packages.yml`](../.github/npm/packages.yml)의 `publish.mode: direct` |
| npm 인증          | GitHub 호스팅 러너 · OIDC · `id-token: write`                                      |
| `NPM_TOKEN`       | 불필요                                                                             |

[npm Trusted Publishing 설정](https://docs.npmjs.com/trusted-publishers)

### GitHub 권한

- 실행자: `origin`의 `develop`·`main` 직접 푸시 권한
- 브랜치 보호: 직접 병합·푸시 허용
- GitHub Packages: `GITHUB_TOKEN` · `packages: write` · 패키지별 저장소 Actions 쓰기 허용

## 릴리스 실행

실행 조건: `develop` · 커밋 완료 · 깨끗한 작업트리 · `origin` 쓰기 권한.

```sh
pnpm release minor
```

1. manifest 검증 · `origin/develop`·`origin/main` 최신 상태 확인
2. 루트·공개 패키지 6개 버전 변경·커밋
3. `origin/main` → 로컬 `develop` 병합
4. 공개 npm 대상 버전 미발행 확인 · 빌드·타입·린트·테스트 검증
5. 동일 커밋을 `origin/develop`·`origin/main`에 atomic push
6. `Release` Actions 재검증·pack → npm 발행 → 같은 tarball의 GitHub Packages 발행

| 항목                    | 동작                                      |
| ----------------------- | ----------------------------------------- |
| 기본 작업 브랜치        | `develop` · 릴리스 후 유지                |
| 버전                    | 루트·공개 패키지 6개 동시 변경            |
| 저장소 선택             | `origin` 기준                             |
| 원격 반영               | 두 브랜치 함께 성공·실패 · 강제 푸시 없음 |
| 발행 트리거             | `main` push                               |
| Git 태그·GitHub Release | 생성 없음                                 |

### 버전·검증 명령

| 명령                           | 용도                                          |
| ------------------------------ | --------------------------------------------- |
| `pnpm release minor --dry-run` | 변경·커밋·푸시 없이 조건·버전 확인            |
| `pnpm release patch` / `major` | 명시적 버전 증가                              |
| `pnpm release 1.1.0`           | 정확한 버전 지정 · 현재 버전과 동일한 값 허용 |
| `pnpm release auto`            | `origin/main` 이후 커밋으로 증가 폭 계산      |
| `pnpm release verify`          | 로컬 manifest·빌드·현재 버전 발행 여부 확인   |

명시적 버전 지정: 자동 추론보다 우선. 로컬 검증·푸시 실패 후 재시도: 현재 버전의 정확한 값 사용.

## 검증한 tarball 발행

- `prepare-release`: 빌드·타입·린트·테스트 → pack 1회
- `pnpm release verify-tarballs`: 이름·버전·파일·공개 import/require 검증
- `--artifacts-manifest`: SHA-512 SRI·원본 저장소·실제 checkout 커밋을 `artifacts.json`에 기록
- tarball·manifest: 같은 GitHub artifact · 생성 단계의 정확한 artifact ID로 다운로드
- npm: [Releaseway npm Actions v0.8.0](https://github.com/releaseway/npm-actions/releases/tag/v0.8.0) · `artifacts-manifest` 기반 발행·digest 검사
- 발행 대상·순서: 최종 tarball의 의존성 기준
- GitHub Packages: npm과 동일한 artifact·tarball 사용

## 실패 후 재실행

| 실패 지점                 | 복구                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| 로컬 병합 충돌            | `develop`에서 충돌 해결·커밋 → 현재 버전으로 재실행                                        |
| 로컬 검증·푸시            | 원인 해결·커밋 → `pnpm release x.y.z`로 현재 버전 재시도                                   |
| 대상 버전 이미 발행       | 새 버전 선택 또는 기존 실패 실행의 원본 artifact로 재개                                    |
| `main` 커밋 변화 없음     | 새 push 이벤트 없음 · 기존 `Release` 실행의 실패 작업 재실행                               |
| npm 일부 발행             | 원래 실행의 실패 작업 재실행 · 원본 artifact 재사용 · 기존 버전 digest 대조 후 나머지 발행 |
| GitHub Packages 일부 발행 | 발행 상태 재확인을 위한 원래 실행의 모든 작업 재실행                                       |

- npm 진단: `npm-publication-<run_id>-<run_attempt>` artifact의 보고서·진단·tarball 검증 결과
- 결과 `unknown`: 레지스트리 실제 상태·원본 digest 확인 후 재시도
- artifact·보고서 보관: 7일 · 부분 발행 복구 전 원본 manifest·tarball 별도 보관
- 부분 발행 버전: 내용 변경 금지 · 원본 artifact 유지
- 실제 발행 전제: npm Trusted Publisher·GitHub Packages 권한 설정
