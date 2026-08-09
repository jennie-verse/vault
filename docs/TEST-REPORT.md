# Vault — 테스트 결과 (2026-08-08, 글자 크기 6단계 + docs 추가)

## 이번 변경

- webapp-standard.md 기준 미달 2건 보완: 글자 크기 6단계 조절, `docs/` 4종 문서
- 기존 기능·저장 데이터(IndexedDB, 백업/복원 형식)는 변경하지 않음
- 글자 크기 기본(4단계)은 지금까지 써 온 화면 크기와 동일하게 유지 (사용자 승인 사항)
- `sw.js` 캐시 버전을 `2026.07.31-fix1` → `2026.08.08-fontscale1`로 올림

## 통과 항목 (코드 검토로 확인)

- 인라인 JavaScript 문법 오류 없음 (`node --check`로 확인)
- `<style>` 블록의 중괄호 개수 일치 (195쌍) — CSS 구조 깨짐 없음
- `font-size`를 쓰던 규칙 38곳 중 실제 텍스트 입력 요소(`.search input`, `.field`, `textarea.field`, `.code-tools .csearch input`)는 의도적으로 제외하고 그대로 둠 — 6단계를 낮춰도 iOS Safari 자동 확대(16px 미만 입력창)가 발생하지 않음
- 버튼류(`.btn`, `.seg button`, `.sheet-btn` 등)는 글자만 `calc(...)`로 줄고 `padding`/`min-width`/`min-height`는 원래 px 값 그대로라 44×44px 터치 영역이 축소되지 않음
- Settings 화면에 Text size 6단계 세그먼트 버튼 + Reset 버튼 추가, 선택값은 `Storage.setSetting('fontScale', n)`으로 저장, 새로고침 후에도 `loadPrefs()`가 값을 읽어와 `applyFontScale()`로 재적용

## 실기기에서 직접 확인 필요 (Pending)

- iPhone 세로·가로, iPad 세로·가로에서 1~6단계 전체 확인 — 버튼 겹침, 글자 잘림 여부
- 6px·8px(1~2단계)에서 목록·헤더·시트(sheet)·모달의 레이아웃이 깨지지 않는지
- 17px 이상(6단계)에서 헤더 타이틀·목록 줄임표(ellipsis)가 자연스럽게 잘리는지
- Settings 안 Text size 세그먼트가 6개 버튼일 때 좁은 화면(iPhone SE 등)에서 줄바꿈 없이 들어가는지
- 홈 화면에 이미 설치된 기존 앱에서, 이번 배포 후 캐시가 정상적으로 갱신되고 기존 문서·백업 데이터가 그대로 유지되는지
- GitHub Actions 배포 성공 여부 및 실제 배포 URL에서의 콘솔 오류 0건 확인

## 손대지 않은 부분

- 문서 저장/미리보기 샌드박스, 백업·복원 로직, 코드 검색 등 글자 크기와 무관한 기능은 수정하지 않음
