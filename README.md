# Vault

아이폰·아이패드에서 HTML 문서를 기기 안에 보관하고, 미리보기와 코드 보기로 확인하는 오프라인 PWA입니다.

## 특징

- 문서는 IndexedDB에 로컬 저장되며 저장소에 자동 업로드되지 않습니다.
- 저장한 HTML은 샌드박스된 미리보기에서 열립니다. JavaScript는 문서별로 직접 허용할 수 있습니다.
- 단일 `.html`/`.htm`과 여러 자산을 묶은 `.zip`을 가져올 수 있습니다. ZIP의 원본 HTML은 그대로 보존하고 SVG·이미지·CSS·classic JavaScript는 별도 자산 manifest로 저장합니다.
- 서비스 워커가 앱 화면과 필요한 라이브러리·글꼴·아이콘을 오프라인 캐시합니다.
- 모든 경로가 상대 경로라 GitHub Pages의 프로젝트 하위 주소에서 동작합니다.
- 단일 라이트 테마는 베이비핑크를 중심으로 하늘색·라일락을 보조색으로 쓰며, UI 글꼴은 자체 포함된 Lexend와 Verdana 계열입니다.
- 버튼·입력창·포커스·선택 영역·스크롤바와 iPhone Safe Area가 세 앱의 공통 디자인 기준을 따릅니다.

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

JavaScript를 끄면 사용자 스크립트와 이벤트 속성은 제거되지만, Vault의 격리된 fragment 처리기는 유지되어 `#section` 링크가 같은 문서 안에서 동작합니다.

## HTML·ZIP 호환성

- ZIP 루트의 `index.html`을 우선 진입점으로 사용합니다. 루트 `index.html`이 없고 HTML이 여러 개면 모호한 가져오기를 중단하고 파일 목록을 보여줍니다.
- ZIP 제한은 압축 파일 10 MB, 압축 해제 합계 25 MB, 단일 파일 10 MB, 500개 파일, 압축률 100:1입니다.
- ZIP Slip, 절대경로, 중복·대소문자 충돌, 암호화 ZIP, symlink, CRC 오류를 가져오기 전에 차단합니다.
- 정적 `src`/`href`/CSS URL뿐 아니라 JavaScript가 `innerHTML`, `setAttribute`, `element.src`로 만든 package-local 경로도 미리보기 시 해결합니다.
- package-local classic script는 실행 순서를 유지해 inline합니다. ES module/import graph, Worker·Service Worker, 로컬 `fetch`/XHR, 다중 HTML 페이지 이동은 지원하지 않습니다.
- 원격 JavaScript는 기본 차단됩니다. Vault 앱 자체 CSP는 완화하지 않습니다.

## 문서 읽기

- 완성 문서에 `<meta name="viewport">`가 없으면 자동으로 주입합니다. 없으면 iOS가 980px 폭으로 축소 렌더링합니다.
- 조각(fragment)은 `<html>`/`<body>`로 감싸 렌더링합니다. "Minimal wrap"을 켜면 구조만 넣고 스타일은 문서 것을 씁니다.
- `.txt`, `.md` 등 태그가 없는 파일은 줄바꿈을 유지한 채 `<pre>`로 표시합니다.
- 가져오기 시 BOM과 `<meta charset>`을 확인해 EUC-KR·CP949·UTF-16 파일을 올바르게 디코딩합니다.

## 배포

이 저장소에는 `.github/workflows/deploy.yml`이 포함되어 있습니다. GitHub 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 선택하면 `main` 브랜치에 올릴 때 자동 배포됩니다.

`sw.js`의 `VERSION`과 `src/version.js`의 `APP_BUILD`는 항상 함께 올려야 합니다. 현재 배포 빌드는 `2026.08.10-compat1`입니다.

## 개인정보와 백업

앱에 저장한 문서는 현재 기기의 브라우저 저장공간에만 있습니다. **Settings → Export backup**의 schema v2 백업에는 원본 HTML, package assets, 진입 경로와 호환성 메타데이터가 함께 들어갑니다. 개인 백업은 Public Repository에 올리지 마세요.
