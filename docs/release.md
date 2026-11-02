# 패키지 릴리스

루트와 공개 패키지 6개의 버전을 함께 올린 뒤 npm에 발행하고 GitHub Packages에 같은 tarball을 발행합니다. `Prepare Release PR`에서 릴리스 PR을 만들고, `main`에 병합하면 `Release`가 실행됩니다.

## 최초 설정

공개 패키지마다 npm의 Trusted Publisher를 설정해야 합니다.

- `@connextable/popbill-spec`
- `@connextable/popbill-utils`
- `@connextable/popbill-runtime`
- `@connextable/popbill-juso`
- `@connextable/popbill-compat`
- `@connextable/popbill`

각 패키지는 npm에 이미 존재해야 합니다. 새 패키지는 관리자가 먼저 생성한 뒤 Trusted Publisher를 연결합니다. GitHub 소유자는 `connextable`, 저장소는 `popbill`, 워크플로 파일은 `release.yml`로 지정합니다. [npm Trusted Publishing 설정](https://docs.npmjs.com/trusted-publishers)을 따르고, 각 연결에서 **Allow npm publish**를 활성화합니다. 저장소의 [발행 정책](../.github/npm/packages.yml)은 기존 자동 발행을 유지하도록 `publish.mode: direct`를 사용합니다.

npm 발행은 GitHub 호스팅 러너에서 `id-token: write` 권한으로 실행됩니다. `NPM_TOKEN`은 사용하지 않습니다. GitHub Packages는 워크플로의 `GITHUB_TOKEN`과 `packages: write` 권한을 사용합니다. 기존 GitHub Packages 패키지에도 이 저장소의 Actions가 쓸 수 있어야 합니다.

릴리스 PR 생성에는 `contents: write`, `pull-requests: write` 권한이 필요합니다. 저장소 설정에서 GitHub Actions의 PR 생성을 허용하고, 브랜치 보호 규칙이 릴리스 브랜치와 `develop` 버전 동기화를 허용하는지 확인합니다.

## 릴리스 실행

1. GitHub Actions에서 `Prepare Release PR`을 실행합니다. 기본 소스는 `develop`, 대상은 `main`입니다.
2. `bump`를 선택합니다. `auto`는 마지막 `chore(release): sync version to x.y.z` 커밋 이후의 변경으로 버전을 결정합니다. 첫 릴리스처럼 이 커밋이 없으면 `patch`, `minor`, `major` 또는 `custom`을 선택합니다. `custom`은 `custom_version`에 정확한 `x.y.z`가 필요합니다.
3. 생성된 `release/vX.Y.Z` PR의 변경과 CI 결과를 검토한 뒤 병합합니다. 워크플로는 `main`에서 브랜치를 만들고 선택한 소스의 파일 변경을 적용합니다. `GITHUB_TOKEN`으로 생성·갱신한 PR에 CI 승인 배너가 표시되면 쓰기 권한이 있는 사용자가 **Approve workflows to run**을 선택한 뒤 CI 완료를 확인합니다. [GitHub의 워크플로 실행 규칙](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow#triggering-a-workflow-from-a-workflow)을 참고합니다.
4. `Release`의 npm 발행과 GitHub Packages 발행 결과를 확인합니다. 두 발행이 필요한 경우 모두 성공해야 `develop`의 버전이 동기화됩니다.

Git 태그와 GitHub Release는 이 흐름에서 생성하지 않습니다. 버전의 기준은 릴리스 PR에 포함된 패키지 manifest입니다.

## 검증한 tarball 발행

`prepare-release`가 빌드와 pack을 한 번 수행합니다. `release:verify-tarballs`는 패키지 이름·버전·파일과 공개 import/require 경로를 검증합니다. `--artifacts-manifest`를 지정하면 검증을 마친 압축 파일의 SHA-512 SRI와 원본 저장소·커밋을 `artifacts.json`에 기록합니다. 원본 커밋은 실제 checkout과 같아야 합니다.

tarball과 manifest는 같은 GitHub artifact에 업로드됩니다. 발행 작업은 이름 검색 대신 생성 단계의 정확한 artifact ID로 내려받습니다. npm은 [Releaseway npm Actions v0.8.0](https://github.com/releaseway/npm-actions/releases/tag/v0.8.0)의 `artifacts-manifest` 계약으로 발행하며, npm에 이미 존재하는 버전과 새로 발행하는 버전의 SHA-512를 검사합니다. 발행 대상과 순서는 최종 tarball의 의존성으로 결정합니다.

GitHub Packages에는 같은 artifact의 tarball을 기존 순서대로 발행합니다. Releaseway npm Actions는 공개 npm 전용이므로 GitHub Packages 발행은 별도로 유지합니다.

## 실패 후 재실행

npm 작업만 실패했다면 원래 실행의 실패 작업을 다시 실행해 같은 artifact를 사용합니다. Releaseway는 이미 발행된 버전의 digest를 원래 manifest와 대조하고, 남은 패키지만 발행합니다. 실패 시 저장되는 `npm-publication-<run_id>-<run_attempt>` artifact에서 발행 보고서, 진단, tarball 검증 보고서를 확인합니다. 보고서의 `unknown`은 발행 요청의 최종 결과를 확인하지 못했다는 뜻이므로 npm 상태와 원래 digest를 먼저 확인합니다.

GitHub Packages가 일부만 발행됐다면 **모든 작업을 다시 실행**해 발행 여부를 다시 조회합니다. GitHub Packages 작업만 다시 실행하면 이전 실행에서 계산한 패키지별 발행 목록이 재사용됩니다.

`develop` 버전 동기화 작업이 실패했다면 해당 작업을 다시 실행합니다. 이미 모든 버전이 발행된 상태에서 새 `Release` 실행을 시작하면 발행과 버전 동기화가 생략됩니다. tarball과 보고서의 보관 기간은 7일입니다. 부분 발행을 복구할 때는 원래 manifest와 tarball을 보관하고, 같은 버전의 내용을 변경하지 않습니다.

로컬 테스트와 manifest 검증만으로 Trusted Publisher 연결, GitHub 권한, 실제 레지스트리 발행 성공을 확인할 수는 없습니다. 최초 설정은 해당 서비스에서 확인해야 합니다.
