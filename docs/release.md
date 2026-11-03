# 패키지 릴리스

`develop`의 커밋을 검증한 뒤 `main`에 푸시하면, `Release` Actions가 npm과 GitHub Packages에 같은 tarball을 발행한다. 로컬 명령 하나가 버전 변경·커밋·검증·원격 푸시까지 수행한다.

`2.0.0` 배포 전에는 [1.1 → 2.0 이전 가이드](./migration/2.0.md)의 공개 타입 변경과 [검증 기록](./migration/validation-history.md)의 미검증 범위를 확인한다.

## 최초 설정

### npm Trusted Publisher

공개 패키지 6개에 각각 Trusted Publisher를 설정한다.

- `@connextable/popbill-spec`
- `@connextable/popbill-utils`
- `@connextable/popbill-runtime`
- `@connextable/popbill-juso`
- `@connextable/popbill-compat`
- `@connextable/popbill`

설정값은 [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers)의 GitHub Actions 항목을 사용한다.

| 항목              | 설정          |
| ----------------- | ------------- |
| GitHub 소유자     | `connextable` |
| 저장소            | `popbill`     |
| 워크플로 파일     | `release.yml` |
| Environment       | 빈 값         |
| Allow npm publish | 활성화        |

발행 정책은 [`.github/npm/packages.yml`](../.github/npm/packages.yml)의 `publish.mode: direct`다. npm 인증은 GitHub 호스팅 러너의 OIDC와 `id-token: write`를 사용하며 `NPM_TOKEN`은 필요하지 않다.

### GitHub 권한

- 실행자는 `origin`의 `develop`·`main` 직접 푸시 권한이 있어야 한다.
- 브랜치 보호 설정이 릴리스 명령의 직접 병합·푸시를 허용해야 한다.
- GitHub Packages는 `GITHUB_TOKEN`의 `packages: write`와 각 패키지의 저장소 Actions 쓰기 권한이 필요하다.

## 릴리스 실행

저장소 루트의 `develop`에서 실행한다. 변경을 모두 커밋하고 작업트리를 깨끗하게 만든다. `origin`은 fetch·push에 동일한 URL 하나를 사용해야 한다.

먼저 배포할 버전과 로컬 조건을 확인한다.

```sh
pnpm release 2.0.0 --dry-run
```

dry-run은 파일·커밋·원격 상태를 바꾸지 않는다. 원격 ref를 fetch하지 않으며 빌드·테스트·레지스트리 발행 가능 여부 검사도 수행하지 않는다.

실제 릴리스는 같은 버전으로 실행한다.

```sh
pnpm release 2.0.0
```

1. manifest를 검증하고 `origin/develop`·`origin/main`을 fetch한다. 로컬 `develop`이 원격의 커밋을 포함하는지 확인한다.
2. 루트와 공개 패키지 6개의 버전을 함께 변경하고 커밋한다.
3. `origin/main`을 로컬 `develop`에 병합한다.
4. 공개 npm에 대상 버전이 없는지 확인한 뒤 빌드·타입 검사·린트·테스트를 실행한다.
5. 같은 커밋을 `origin/develop`·`origin/main`에 atomic push한다. 두 브랜치는 함께 성공하거나 실패하며 강제 푸시는 사용하지 않는다.
6. `main` push로 시작한 `Release` Actions가 재검증·pack 후 npm을 발행하고 GitHub Packages에 미러링한다.

로컬 작업 브랜치는 `develop`으로 유지한다. Git 태그와 GitHub Release는 생성하지 않는다. 명령 성공은 원격 푸시 완료를 뜻하므로 Actions의 최종 발행 결과까지 별도로 확인한다.

### 버전·검증 명령

- `pnpm release patch`, `minor`, `major`: 현재 버전에서 지정한 폭만큼 올린다.
- `pnpm release 2.0.0`: 정확한 버전을 지정한다. 현재 버전과 같은 값도 허용하므로 로컬 검증·푸시 실패 후 재시도에 사용한다.
- `pnpm release auto`: `origin/main` 이후 커밋에서 증가 폭을 계산한다.
- `pnpm release verify`: 로컬 manifest·빌드·현재 버전의 공개 npm 발행 여부를 확인한다. 커밋·푸시·발행은 하지 않는다.

버전을 지정하는 실제 릴리스 명령은 원격 푸시를 포함한다. 검토만 하려면 `--dry-run`을 붙인다.

## 검증한 tarball 발행

`prepare-release` 작업이 빌드·타입·린트·테스트 후 패키지별로 pack을 한 번 수행한다. `pnpm release verify-tarballs`는 tarball의 이름·버전·파일·공개 import/require와 소비자 타입을 검사한다.

`--artifacts-manifest` 옵션은 SHA-512 SRI·원본 저장소·실제 checkout 커밋을 `artifacts.json`에 기록한다. tarball과 manifest를 하나의 GitHub artifact로 보관하고, 발행 작업은 생성 단계에서 받은 정확한 artifact ID로 다운로드한다.

npm은 [Releaseway npm Actions v0.8.0](https://github.com/releaseway/npm-actions/releases/tag/v0.8.0)이 manifest와 digest를 확인해 발행한다. 순서는 최종 tarball의 의존성에서 계산한다. GitHub Packages도 같은 artifact의 tarball을 사용한다.

발행 후에는 Actions의 패키지별 결과와 레지스트리의 버전·dist-tag를 확인하고, 레지스트리에서 새로 설치한 소비자 환경의 import/require·타입 검사를 확인한다.

## 실패 후 재실행

### 로컬 병합·검증·푸시 실패

병합 충돌은 `develop`에서 해결해 커밋한다. 검증이나 푸시 실패도 원인을 해결한 뒤 현재 버전의 정확한 값으로 재실행한다. `minor` 등을 다시 사용하면 의도하지 않은 추가 버전 증가가 생길 수 있다.

`main`의 커밋이 이미 같으면 새 push 이벤트가 발생하지 않는다. 이 경우 기존 `Release` 실행의 실패 작업을 재실행한다.

### 대상 버전이 이미 발행됐거나 npm 일부 발행

새 소스를 배포하려면 새 버전을 선택한다. 부분 발행 복구는 기존 `Release` 실행의 실패 작업을 재실행해 원본 artifact를 사용한다. 이미 발행된 패키지의 digest를 대조한 뒤 나머지만 발행하며, 부분 발행된 버전의 내용을 바꾸지 않는다.

### GitHub Packages 일부 발행

원래 실행의 모든 작업을 재실행해 두 레지스트리의 발행 상태를 다시 확인한다. 실행 커밋과 이미 발행된 버전의 소스는 변경하지 않는다.

### 진단과 원본 보관

npm 진단은 `npm-publication-<run_id>-<run_attempt>` artifact의 보고서·진단·tarball 검증 결과를 확인한다. 결과가 `unknown`이면 실제 레지스트리 상태와 원본 digest를 확인한 뒤 재시도한다.

artifact와 보고서는 7일간 보관한다. 부분 발행 복구 전에는 원본 manifest·tarball을 별도로 보관한다. 실제 발행은 npm Trusted Publisher와 GitHub Packages 권한 설정이 완료돼 있어야 한다.
