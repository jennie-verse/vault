# Vault

아이폰·아이패드에서 HTML 문서를 기기 안에 보관하고, 미리보기와 코드 보기로 확인하는 오프라인 PWA입니다.

## 특징

- 문서는 IndexedDB에 로컬 저장되며 저장소에 자동 업로드되지 않습니다.
- 저장한 HTML은 샌드박스된 미리보기에서 열립니다. JavaScript는 문서별로 직접 허용할 수 있습니다.
- `.zip` 웹 패키지는 원본 HTML과 동반 자산을 함께 보존해 오프라인에서도 표시합니다.
- 서비스 워커가 앱 화면과 필요한 라이브러리·글꼴·아이콘을 오프라인 캐시합니다.
- 모든 경로가 상대 경로라 GitHub Pages의 프로젝트 하위 주소에서 동작합니다.
- 단일 라이트 테마는 베이비핑크를 중심으로 하늘색·라일락을 보조색으로 쓰며, UI 글꼴은 자체 포함된 Lexend와 Verdana 계열입니다.
- Settings에서 글자 크기를 6단계로 조절할 수 있습니다. 기본(4단계)은 지금까지 쓰던 화면 크기와 같습니다.
- 버튼·입력창·포커스·선택 영역·스크롤바와 iPhone Safe Area가 다른 개인용 앱과 같은 디자인 기준을 따릅니다.

## 미리보기 샌드박스

미리보기 iframe은 `allow-same-origin` 없이 실행됩니다. 저장한 문서는 **불투명 origin(opaque origin)** 안에서 돌아가며 Vault 자신의 IndexedDB나 다른 문서에 접근할 수 없습니다. 이 격리는 의도된 것이며 완화하지 않습니다.

그 대신 문서가 정상 작동하도록 다음을 지원합니다.

| 기능 | 처리 방식 |
|---|---|
| `localStorage` / `sessionStorage` | 메모리 기반 셰임(shim)을 `<head>` 최상단에 주입. 문서를 벗어나면 초기화됩니다. |
| `document.cookie` | 메모리 기반 셰임 |
| `alert` / `confirm` / `prompt` | `allow-modals` |
| `<form>` 제출 | preview CSP의 `form-action 'none'`으로 차단 |
| 다운로드 (`<a download>`, Blob URL) | `allow-downloads` |
| `window.open` | `allow-popups` |
| 외부 링크 | 부모 앱이 가로채 새 탭으로 엽니다. 팝업이 차단되면 확인 시트로 대체됩니다. |
| `indexedDB` | 사용 불가로 감지되면 `undefined`로 노출되어 기능 감지가 정상 실패합니다. |

JavaScript를 끈 문서는 사용자 스크립트를 제거하지만 내부 `#fragment` 링크는 Vault 처리기로 계속 동작합니다.

## ZIP 웹 패키지

상대경로 SVG·이미지·CSS·JavaScript가 있는 HTML은 폴더 내용을 ZIP으로 묶어 가져오세요. Vault는 원본 진입 HTML을 `content`에 그대로 두고, 동반 파일을 `packageAssets`에 한 번씩 저장합니다. 미리보기에서만 임시 자체 포함 문서를 만들기 때문에 Code 보기에는 원본이 보입니다.

보안 제한: 압축 10 MB, 해제 25 MB, 파일당 10 MB, 500개, 압축률 100:1. 경로 탈출, 절대경로, 암호화, symlink, 중복·대소문자 충돌, CRC 오류는 전체 가져오기를 중단합니다.

지원: 정적/동적 이미지 경로, CSS `url()`/`@import`, 다운로드 링크, ZIP 내부 classic script. 비지원: ES module/import graph, Worker/Service Worker, 로컬 fetch/XHR, multi-page 이동, object/embed, 원격 JavaScript 실행. 원격 script는 style/media와 별도로 고위험 분류하며 차단 dependency와 runtime error를 session 한정 `Preview issues`에 표시합니다.

## 문서 읽기

- 완성 문서에 `<meta name="viewport">`가 없으면 자동으로 주입합니다. 없으면 iOS가 980px 폭으로 축소 렌더링합니다.
- 조각(fragment)은 `<html>`/`<body>`로 감싸 렌더링합니다. "Minimal wrap"을 켜면 구조만 넣고 스타일은 문서 것을 씁니다.
- `.txt`, `.md` 등 태그가 없는 파일은 줄바꿈을 유지한 채 `<pre>`로 표시합니다.
- 가져오기 시 BOM과 `<meta charset>`을 확인해 EUC-KR·CP949·UTF-16 파일을 올바르게 디코딩합니다.

## 배포

이 저장소에는 `.github/workflows/deploy.yml`이 포함되어 있습니다. GitHub 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 선택하면 `main` push에서 저장소 소유 테스트를 실행한 뒤 allowlist artifact만 자동 배포합니다. `tests`, fixture, `node_modules`, package metadata는 Pages에 포함하지 않습니다.

`sw.js`의 `VERSION` 값은 **배포할 때마다 반드시 올려야** 캐시가 갱신됩니다. 앱 화면(navigation) 요청은 network-first이므로 새 버전이 첫 실행에서 바로 반영됩니다.

## 개인정보와 백업

앱에 저장한 문서는 현재 기기의 브라우저 저장공간에만 있습니다. 저장소를 지우거나 iOS가 저장공간을 정리하면 사라질 수 있으므로 **Settings → Export backup**으로 정기적으로 백업하세요. 백업 파일에는 저장한 HTML 원문이 들어 있으므로 Public Repository에는 올리지 마세요.

## 동기화 (2026-08-10 추가)

`webapp-data`(비공개 저장소)에 **문서 메타만** 올립니다. 켜는 법은 [사용 안내](USER-GUIDE-KO.md)를 확인하세요.

| 층 | 파일 | 무엇 |
|---|---|---|
| A | `vault/index.<기기>.json` | 제목·태그·시각·크기. **본문 제외** |
| B | `events/vault.<기기>.<YYYY-MM>.json` | 문서를 저장한 기록 — atlas·trace가 읽음 |

백업(C층)은 **일부러 넣지 않았습니다.** Vault의 백업에는 HTML 원문이 들어 있어 저장소에 올릴 대상이 아닙니다. 본문 백업은 `Export backup` 그대로입니다.

### 고칠 때 지켜야 하는 것 네 가지

1. **`src/sync.js`의 `metaFor()`에서 필드를 하나씩 골라 담으세요.** `{...doc}`으로 통째로 복사하면 `content`가 딸려 올라갑니다. 검사가 올라간 JSON 전체에 `content`가 없는지 확인합니다.
2. **`sw.js`의 `VERSION`과 `src/version.js`의 `APP_BUILD`는 항상 같은 값이어야 합니다.**
3. **동기화 모듈은 동적 `import()`로 부릅니다.** Vault는 인라인 스크립트 하나가 곧 앱이라, 정적으로 물리면 그 파일 하나를 못 받을 때 앱 전체가 멈춥니다. `Sync`가 `null`일 수 있다는 전제로 코드를 쓰세요.
4. **삭제 표시(`markDeleted`)는 사용자가 직접 지웠을 때만 찍습니다.** "로컬에 없으니 지워진 것"이라고 추론하지 마세요.

### CSP에 대해

Vault 앱 CSP와 `preview-host.html` 정책을 분리했습니다. preview host는 `connect-src 'none'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`이며 data/blob package asset만 허용합니다. 두 단계 iframe 모두 `allow-same-origin`이 없고, 메시지는 source·opaque origin·문서별 session nonce를 검사합니다.
