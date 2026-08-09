# Vault — GitHub Pages 재배포 안내

Vault는 이미 `https://jennie-verse.github.io/vault/`에 배포되어 있습니다. 이 문서는 **코드를 고친 뒤 다시 배포하는 방법**을 설명합니다.

## 배포 방식

이 저장소는 **GitHub Actions**로 배포합니다 (`.github/workflows/deploy.yml`). `main` 브랜치에 push하면 자동으로 빌드 없이 그대로 Pages에 올라갑니다.

GitHub 저장소 → **Settings → Pages → Source**가 **GitHub Actions**로 되어 있는지 확인하세요.

## 재배포 순서

1. `Published/vault/` 안의 파일을 수정합니다.
2. `index.html`이나 `sw.js`를 고쳤다면, `sw.js`의 `VERSION` 값을 **반드시** 올립니다. 올리지 않으면 기기에 저장된 이전 캐시가 계속 보일 수 있습니다.
3. 커밋하고 push합니다.

   ```sh
   cd Published/vault
   git add -A
   git commit -m "설명"
   git push
   ```

4. GitHub 저장소의 **Actions** 탭에서 배포 워크플로가 성공했는지 확인합니다.
5. `https://jennie-verse.github.io/vault/`를 열어 새 내용이 반영됐는지 확인합니다. 화면이 이전 그대로면 홈 화면 앱을 완전히 종료했다가 다시 열거나, Safari에서 새로고침을 한 번 더 해보세요.

## 홈 화면 앱 업데이트 반영

이미 홈 화면에 추가해 쓰고 계신 경우, 새 배포는 다음에 앱을 열 때 백그라운드에서 자동으로 받아옵니다. 즉시 반영하고 싶으면 앱을 완전히 종료(위로 스와이프)했다가 다시 여세요.
