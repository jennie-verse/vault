# Vault

아이폰·아이패드에서 HTML 문서를 기기 안에 보관하고, 미리보기와 코드 보기로 확인하는 오프라인 PWA입니다.

## 특징

- 문서는 IndexedDB에 로컬 저장되며 저장소에 자동 업로드되지 않습니다.
- 저장한 HTML은 샌드박스된 미리보기에서 열립니다. JavaScript는 문서별로 직접 허용할 수 있습니다.
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
| `<form>` 제출 | `allow-forms` |
| 다운로드 (`<a download>`, Blob URL) | `allow-downloads` |
| `window.open` | `allow-popups` |
| 외부 링크 | 부모 앱이 가로채 새 탭으로 엽니다. 팝업이 차단되면 확인 시트로 대체됩니다. |
| `indexedDB` | 사용 불가로 감지되면 `undefined`로 노출되어 기능 감지가 정상 실패합니다. |

JavaScript를 끈 문서는 스크립트와 링크가 모두 동작하지 않습니다.

## 문서 읽기

- 완성 문서에 `<meta name="viewport">`가 없으면 자동으로 주입합니다. 없으면 iOS가 980px 폭으로 축소 렌더링합니다.
- 조각(fragment)은 `<html>`/`<body>`로 감싸 렌더링합니다. "Minimal wrap"을 켜면 구조만 넣고 스타일은 문서 것을 씁니다.
- `.txt`, `.md` 등 태그가 없는 파일은 줄바꿈을 유지한 채 `<pre>`로 표시합니다.
- 가져오기 시 BOM과 `<meta charset>`을 확인해 EUC-KR·CP949·UTF-16 파일을 올바르게 디코딩합니다.

## 배포

이 저장소에는 `.github/workflows/deploy.yml`이 포함되어 있습니다. GitHub 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 선택하면 `main` 브랜치에 올릴 때 자동 배포됩니다.

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

`index.html`에 CSP를 넣었지만 **자원(이미지·글꼴·스타일)은 일부러 열어 두었습니다.** 저장 문서는 `iframe.srcdoc`으로 그려지고 **부모 페이지의 CSP를 그대로 물려받기** 때문에, 자원을 `'self'`로 잠그면 외부 이미지나 웹폰트를 쓰는 저장 문서가 깨집니다. 잠근 것은 `connect-src`(통신)와 `object-src`·`base-uri`·`form-action`입니다.
