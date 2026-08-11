# Vault 사용 안내

## 시작하기

1. Safari에서 Vault 주소를 엽니다.
2. 공유(Share) → 홈 화면에 추가(Add to Home Screen)로 설치하면 저장 공간이 더 안정적으로 유지됩니다.

## 문서 추가

- 라이브러리 화면 오른쪽 위 **+** 버튼 → **Import HTML or ZIP…**으로 HTML/텍스트/ZIP 문서를 추가합니다.
- 완성된 HTML 문서는 그대로, 조각(fragment)이나 일반 텍스트는 자동으로 감싸서 보여줍니다.
- SVG·이미지·CSS가 같은 폴더에 있는 HTML은 폴더의 파일들을 ZIP으로 묶어 가져오세요. 루트 `index.html`이 있으면 자동 선택됩니다.

## 문서 보기

- 목록에서 문서를 탭하면 미리보기가 열립니다.
- 상단 세그먼트 버튼으로 **미리보기 / 코드** 보기를 전환합니다.
- 코드 보기에서는 검색(csearch)으로 특정 줄을 찾고, **Wrap** 버튼으로 줄바꿈 여부를 바꿀 수 있습니다.
- 문서별로 JavaScript 허용 여부를 켜고 끌 수 있습니다. 미리보기는 격리된 샌드박스에서 열려 Vault의 다른 데이터에 접근하지 못합니다.

## 오프라인에서 열기

⋯ 메뉴 → **Check offline resources…**는 문서가 package-local, 원격, data/blob, script 또는 제한 기능을 사용하는지 진단합니다. ZIP 자산은 실제로 오프라인 저장되며, 원격 자산은 오프라인이라고 표시하지 않습니다. 원격 JavaScript는 기본 차단됩니다.

ZIP 내부 classic JavaScript와 JavaScript가 실행 중 만든 이미지 경로는 지원합니다. ES module, Worker/Service Worker, 로컬 fetch/XHR, 다중 페이지 이동은 지원하지 않으며 영어 경고가 표시됩니다.

원격 JavaScript가 필요한 단일 HTML은 가져오기 전에 **Required JavaScript will be blocked**로 구분됩니다. 저장한 뒤에는 **Required JavaScript is blocked** banner와 **Preview issues**에서 차단된 script/style/media 및 session runtime error를 확인할 수 있습니다. 오류 내용은 300자로 제한되고 문서나 sync metadata에는 저장되지 않습니다.

작동 가능한 패키지는 새 폴더의 루트에 `index.html`을 두고, 고정 버전 script를 `vendor/` 같은 하위 폴더에 넣은 뒤 `<script src>`를 상대경로로 바꾸어 만듭니다. 라이선스도 포함하고 폴더 내용만 ZIP으로 묶어 가져오세요. Vault는 package-local classic JavaScript만 private sandbox에서 실행합니다.

## 글자 크기 조절

Settings(설정) → **Text size**에서 1~6단계 중 고를 수 있습니다.

- **4단계가 지금까지 써 오신 기본 크기**이며, 앱을 새로 여는 성인에게도 이 크기가 기본으로 보입니다.
- 1~3단계는 더 작게, 5~6단계는 더 크게 보입니다.
- 검색창·제목 입력창 등 글자를 입력하는 칸은 어떤 단계에서도 같은 크기를 유지합니다(iOS가 자동으로 화면을 확대하는 것을 막기 위함입니다).
- **Reset to default** 버튼으로 언제든 4단계로 되돌릴 수 있습니다.
- 선택한 크기는 기기에 저장되어 다음에 열어도 유지됩니다.

## 백업과 복원

- Settings → **Export backup**: 저장한 모든 문서를 JSON 파일로 내보냅니다. 설치된 앱에서는 공유 시트로, Safari에서는 파일 다운로드로 저장됩니다.
- Settings → **Copy backup as text**: 파일 저장이 어려운 상황에서 백업 내용을 텍스트로 복사해 메모 앱 등에 붙여넣을 수 있습니다.
- Settings → **Import backup**: JSON 백업 파일을 불러와 기존 문서와 병합합니다. schema v1과 v2를 지원하며, v2는 ZIP 자산과 패키지 메타데이터도 복원합니다. 위험하거나 손상된 manifest가 하나라도 있으면 아무 문서도 저장하지 않습니다.
- 백업 파일에는 저장한 HTML 원문이 그대로 들어 있으므로, 공개 저장소에는 올리지 말고 iCloud Drive 등 본인만 접근하는 곳에 보관하세요.

## 저장 공간 관리

Settings 화면에서 현재 사용 중인 용량을 볼 수 있습니다. 브라우저 저장 공간은 시스템이 정리할 수 있으므로, 배너나 Settings의 안내에 따라 정기적으로 백업하는 것을 권장합니다.

## 동기화 (Sync)

`Settings`의 `Sync`에서 켭니다. **처음에는 꺼져 있고, 꺼진 상태에서도 Vault는 전부 그대로 동작합니다.**

> **올라가는 것은 문서의 제목·태그·날짜·크기뿐입니다. 문서 HTML 원문은 절대 올라가지 않습니다.**
> 문서 한 건이 수 MB라 저장소가 금방 무거워지고, 개인 문서 원문을 공용 층에 두지 않기 위해서입니다.
> **본문 백업은 지금처럼 `Export backup`으로 하셔야 합니다.** 동기화는 백업이 아닙니다.

켜는 순서는 이렇습니다.

1. **Device name**을 먼저 적습니다. **영문 소문자와 숫자만** 씁니다 (예: `iphone-home`).
2. **Access token**을 붙여 넣고 `Save token`을 누릅니다.
3. `Sync with GitHub`를 켭니다.

> **기기 이름은 켜기 전에 적어야 합니다.** 이름은 켜는 순간 파일 이름으로 굳고 나중에 바꿀 수 없습니다. 비워 두거나 한글만 적으면 `context-3f2a1b9c` 같은 이름이 되어 어느 기기의 기록인지 알아볼 수 없게 됩니다.
>
> 같은 iPhone이라도 **Safari 탭과 홈 화면에 추가(Add to Home Screen)한 앱은 서로 다른 기기로 셉니다.**

### 켜면 무엇이 되는가

- **Atlas 검색**에서 Vault에 어떤 문서를 저장했는지 제목으로 찾을 수 있습니다.
- **Trace 하루 기록**에 문서를 저장한 날이 표시됩니다.
- 문서 목록(제목·날짜·크기)이 기기별로 한 파일씩 올라갑니다.

### 알아 둘 것

- **문서 자체는 기기 간에 옮겨지지 않습니다.** 다른 기기에서 저장한 문서는 목록과 검색에만 보이고, 열려면 그 기기에서 `Export backup` → `Import backup`을 거쳐야 합니다.
- 그래서 **원격에 있는 것이 이 기기의 문서를 지우거나 덮을 일이 없습니다.** 동기화가 잘못돼도 문서는 안전합니다.
- 문서를 지우면 목록에서 지워진 것으로 표시됩니다. 다른 기기의 문서에는 영향이 없습니다.
- `Settings` 맨 아래 **App version**이 지금 이 기기에서 실제로 돌고 있는 버전입니다.
