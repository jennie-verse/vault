# Vault v2.3 viewer compatibility 테스트 보고서

- 테스트 일자: 2026-08-10
- 빌드: `2026.08.10-compat2`
- 테스트 URL: `http://127.0.0.1:4173/Published/vault/`
- 브라우저: Codex In-app Browser
- 기준 파일: `WebApp/mindmap.zip` (`693b2024984d1e992a152b86604fa7e909a9ce8e76d489f7fccbc9f11598fb97`), Civics 원본 (`08fc31e72559a71f2d2503f9c9f9a353015bf0240542999a68ef03998a6bcdee`)

## 2026-08-10 compat2 현재 재실행

| 검사 | 결과 |
|---|---|
| `npm test`, `npm run test:syntax` | PASS |
| 저장소 소유 package browser harness | PASS — 9 security fixtures, classic script, resource 분류, dynamic rewrite |
| 원격 script 진단 | PASS — import 전 고위험 안내, 기능 중단 banner, 안전한 `Preview issues` |
| runtime error 경계 | PASS — 최대 300자, session-only, sync metadata 저장 없음 |
| Civics offline ZIP | PASS — 7 allowlisted files, graph, 6 filters, active/aria state, 교차 연결선, pan/zoom controls |
| Civics Preview issues | PASS — 0 |
| Civics SVG export | PARTIAL — 비어 있지 않은 6,264자 SVG DOM과 export handler 확인; nested data-URL download event는 Browser에서 관찰되지 않음 |
| CSP/sandbox | PASS — 원격 origin 추가 없음, `allow-same-origin` 없음, preview `connect-src 'none'` |

과거 compat1 결과는 아래 역사 기준으로 유지하되 현재 결과처럼 간주하지 않습니다. 기존 사용자가 수정해 둔 `WebApp/Tests/vault/` 경로 설명은 보존했고, 추가로 저장소 자체 `tests/`를 만들었습니다. workflow는 test 이후 allowlist artifact만 올려 tests/fixture/package metadata를 배포하지 않습니다.

## 결과 요약

| 항목 | 결과 |
|---|---|
| 일반 폴더 `mindmap/index.html` | PASS — 카드 11, section 11, SVG 11, 콘솔 오류 0 |
| `mindmap.zip` 가져오기 | PASS — `index.html`, 12 files, 482,396 B expanded |
| 동적 `innerHTML` 이미지 경로 | PASS — 11개 SVG 모두 `naturalWidth > 0` |
| fragment 클릭/키보드 | PASS — `#map00`, `#map05`, Vault route 유지, 중첩 Vault 0 |
| Code 보기 원본 | PASS — `const MAPS` 유지, data SVG 미포함 |
| 새로고침/재실행 | PASS — 카드·이미지 manifest 유지 |
| backup schema v2 | PASS — `features: ["packageAssets"]`, 자산 11개 |
| 삭제 후 복원 | PASS — 원본 HTML·manifest·entry path 복원 |
| Service Worker 오프라인 재실행 | PASS — 서버 중단 뒤 카드 11, 이미지 11 |
| 과거 GitHub Pages 하위 경로 | HISTORICAL PASS — compat1 당시 `/Deliverable/vault/`; 현재 운영은 `Published/vault/` 작업 트리와 `/vault/` Pages URL |
| console error/warn | PASS — 관련 오류 0 |

## 정상 비교 기준

일반 웹 폴더에서 첫 SVG는 1860×1340이었고 전체 SVG 크기는 다음과 같았습니다.

`1860×1340, 1960×1120, 1980×1330, 2020×1420, 1980×1300, 1980×1360, 2020×1440, 2000×1330, 2060×1720, 1900×1180, 2060×1660`

Vault ZIP 미리보기에서도 지연 로딩 대상을 순서대로 viewport에 넣은 뒤 동일한 11개 크기를 확인했습니다.

## 보안 fixture

배포 폴더 밖의 `WebApp/Tests/vault/`에서 개인정보 없는 최소 fixture를 실행했습니다.

| fixture | 예상/실제 |
|---|---|
| ZIP Slip | `UNSAFE_PATH` / PASS |
| 중복 path | `DUPLICATE_PATH` / PASS |
| 대소문자 충돌 | `CASE_COLLISION` / PASS |
| 암호화 ZIP | `ENCRYPTED_ZIP` / PASS |
| 10 MB 초과 entry | `ZIP_LIMIT` / PASS |
| 모호한 entry HTML | `AMBIGUOUS_ENTRY` / PASS |
| HTML 없음 | `NO_ENTRY_HTML` / PASS |
| 손상 ZIP | `CORRUPT_ZIP` / PASS |
| ZIP 내부 classic script inline | PASS |

두 iframe의 sandbox attribute에 `allow-same-origin`이 없음을 확인했습니다. 사용자 문서에서 부모 IndexedDB와 Service Worker 접근은 실패했고, preview CSP는 `connect-src 'none'`, `object-src 'none'`, `form-action 'none'`입니다.

## 모바일 viewport

실제 브라우저 안의 고정 viewport harness로 390×844, 844×390, 820×1180, 1180×820을 확인했습니다. 네 크기 모두 앱 `clientWidth`가 요청 폭과 일치했고, 외부 가로 overflow·헤더 겹침이 없었으며 preview iframe이 표시됐습니다. 주요 헤더 touch target은 44px 이상입니다.

실물 iPhone/iPad Safari와 Add to Home Screen 설치는 이 자동화 환경에서 실행하지 못했으므로 배포 후 최종 수동 확인 항목으로 남깁니다.

## PWA

- `sw.js VERSION`: `2026.08.10-compat2`
- `src/version.js APP_BUILD`: `2026.08.10-compat2`
- 신규 cache asset: `src/package.js`, `preview-host.html`
- 서버 중단 후 navigation fallback과 IndexedDB package preview: PASS
- manifest JSON 및 상대경로: PASS

## 알려진 제한

- ES module/import graph, dynamic import, Worker/Service Worker, package-local fetch/XHR, multi-page navigation, object/embed는 지원하지 않습니다.
- 원격 JavaScript는 실행하지 않습니다. 원격 링크는 일반 링크로 분류하고 원격 실행 자원과 구분합니다.
- 미리보기 package asset은 data URL을 사용하므로 Blob/Object URL을 생성하지 않습니다. 따라서 preview 종료 시 정리할 Object URL이 없습니다.
- 자동화 브라우저의 download event는 nested data URL에서 노출되지 않았지만, 다운로드 href·MIME·`download` 속성과 SVG media payload 해석은 확인했습니다.
