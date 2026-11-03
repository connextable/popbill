# 패키지 릴리스

GitHub Actions의 `Release`를 `main`에서 수동 실행한다. Releaseway가 Git 태그를 기준으로 버전을 정하고 공개 패키지 6개를 npm에 발행한다. GitHub Packages에는 npm에 공개된 tarball을 그대로 미러링한다.

`main` push는 CI 검증만 실행한다. 로컬에서 버전을 올리거나 릴리스 커밋·태그를 만들 필요는 없다.

## 최초 설정

### npm Trusted Publisher

공개 패키지 6개의 npm Trusted Publisher 설정을 유지한다.

- `@connextable/popbill-spec`
- `@connextable/popbill-utils`
- `@connextable/popbill-runtime`
- `@connextable/popbill-juso`
- `@connextable/popbill-compat`
- `@connextable/popbill`

[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers)의 GitHub Actions 설정값은 소유자 `connextable`, 저장소 `popbill`, 워크플로 파일 `release.yml`, Environment 빈 값이다. `Allow npm publish`를 활성화한다.

발행은 GitHub 호스팅 러너의 OIDC와 `id-token: write`를 사용한다. `NPM_TOKEN`은 필요하지 않다.

### GitHub 권한

워크플로 실행자는 `main`의 `Release`를 실행할 권한이 필요하다. 워크플로는 태그 생성에 `contents: write`, GitHub Packages 미러링에 `packages: write`를 사용한다. 각 GitHub 패키지에서도 이 저장소의 Actions 쓰기 권한을 허용한다.

## 릴리스 실행

1. 배포할 변경을 `main`에 반영하고 해당 커밋의 CI가 통과했는지 확인한다.
2. GitHub Actions에서 **Release → Run workflow**를 선택한다. 브랜치는 `main`으로 둔다.
3. 정식 버전은 `prerelease-id`를 비워 실행한다. 시험 배포는 `rc`나 `beta` 같은 식별자를 넣는다.
4. 실행 요약에서 결정된 버전·태그와 패키지별 npm 발행 결과, GitHub Packages 미러 결과를 확인한다.

정식 버전은 npm `latest`, 시험 버전은 `next`를 사용한다. 현재 `latest`보다 낮은 정식 버전에 발행 태그를 명시하지 않으면 Releaseway가 발행을 거부한다.

### 버전 결정

[Releaseway 설정](../.github/releaseway.yml)이 `main`과 `v` 접두사의 source tag를 기준으로 다음 버전을 계산한다. 일반 변경은 patch, `feat`는 minor, `BREAKING CHANGE`나 `!`가 있는 변경은 major 증가 대상이다.

`initial-version`은 기준 태그가 없을 때 최초 릴리스 버전을 정하는 설정이다. 릴리스마다 목표 버전에 맞춰 변경하지 않는다. 첫 기준 태그가 생긴 뒤에는 같은 설정을 유지하고, `bump: auto`가 마지막 기준 태그 이후의 커밋으로 다음 버전을 계산한다.

확정된 버전은 Release 실행 요약과 각 패키지의 npm 페이지에서 확인한다. 저장소의 `package.json` 버전은 빌드용 원본이며 발행 버전은 Git 태그를 따른다. Releaseway가 발행 작업 안에서 패키지 버전과 내부 의존성을 맞추므로 버전 변경 커밋을 만들지 않는다.

## 검증과 발행

검증 작업은 쓰기 권한 없이 버전 계획을 만들고 `pnpm check`를 실행한다. 이 명령은 빌드·타입 검사·린트·테스트·포맷 검사 후 SDK를 임시 pack해 공개 진입점·선언 파일·소비자 타입을 검사한다. 이 pack은 저장소의 원본 버전을 사용하므로 최종 태그 버전 tarball과 같은 바이트를 검사한 것은 아니다. 계획과 빌드 결과는 하나의 실행에 속한 artifact로 전달한다.

발행 작업은 같은 소스 커밋을 checkout하고, 검증 작업이 반환한 정확한 artifact ID와 digest로 결과를 복원한다. Releaseway가 계획을 재개해 소스 커밋을 가리키는 annotated tag를 만들고 최종 버전·내부 의존성 반영과 검증·pack·npm 발행을 맡는다. 최종 tarball은 Releaseway가 확정한 SHA-512로 검증한다. 정책은 [`.github/npm/packages.yml`](../.github/npm/packages.yml)의 `git-tag` 버전과 `direct` 발행 모드를 따른다.

GitHub Packages 미러는 npm 발행 뒤 공개 레지스트리에서 받은 tarball을 사용한다. SRI를 확인하며, 이미 같은 버전·내용이 있으면 건너뛰고 내용이 다르면 실패한다. 레지스트리별로 다시 빌드하지 않는다.

로컬에서 패키지 검사만 하려면 빌드 후 다음 명령을 실행한다. 임시 pack과 정리를 자동으로 수행하며 태그 생성·원격 푸시·발행은 하지 않는다.

```sh
pnpm build
pnpm check:packages
```

이미 pack한 tarball을 검사하려면 `pnpm check:packages <디렉터리>`를 사용한다. 소비자 실행 검사는 현재 Node.js에서 수행하며, manifest의 Node.js 지원 범위도 확인한다.

## 실패 후 재실행

### 검증 실패

소스를 수정해 `main`에 반영하고 새 `Release`를 실행한다. 발행 작업이 시작하기 전에는 새 버전이나 npm 패키지가 생기지 않는다.

### 태그 생성 후 실패·npm 일부 발행

**원래 실행의 모든 작업을 재실행**한다. 같은 소스와 정책에서 기존 태그·계획을 재개하고 npm에 이미 발행된 패키지와 남은 패키지를 구분한다. 새 커밋이나 바뀐 정책으로 부분 발행 버전을 이어서 만들지 않는다.

이미 npm에 발행한 버전의 내용을 바꿀 수 없다. 내용 변경이 필요하면 새 릴리스로 진행한다.

### GitHub Packages 미러 실패

원래 실행의 모든 작업을 재실행한다. npm 발행을 마친 경우에도 공개된 원본 tarball을 다시 받아 미러링을 재개한다. 이미 동일한 내용이 있는 GitHub Packages 버전은 건너뛴다.

npm의 최신 채널이 이미 다른 버전을 가리키면 `mirror-<version>` 복구 태그로 등록해 GitHub Packages의 `latest`·`next`를 되돌리지 않는다.

### 진단과 원본 보관

실행 요약과 npm 발행 보고서·진단 artifact에서 실패 단계를 확인한다. 결과가 불명확하면 실제 npm 버전·dist-tag와 tarball SRI를 확인한 뒤 재실행한다.

계획·빌드 결과와 보고서는 7일간 보관한다. 부분 발행 복구가 끝나기 전에는 원래 실행과 artifact를 보관한다. 태그를 삭제하거나 같은 버전에 다른 소스를 발행해 복구하지 않는다.
