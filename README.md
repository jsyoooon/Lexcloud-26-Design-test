# LexCloud 26 Accounting Project (React)

이 프로젝트는 LexCloud 26 회계 파트의 UI를 리액트(React)로 구현한 결과물입니다.
비개발자도 프로젝트 구조를 쉽게 파악할 수 있도록 주요 폴더와 파일의 역할을 정리했습니다.

## 📂 폴더 구조 안내 (비개발자용 가이드)

프로젝트의 핵심 파일들은 모두 `src` 폴더 안에 모여 있습니다.
수정해야 할 부분이 생기면 아래 경로를 찾아가세요.

### 1. 📄 화면(페이지) 파일들이 있는 곳
**경로:** `src/components/Accounting/`

우리가 작업한 주요 회계 메뉴들이 각각 하나의 파일(또는 폴더)로 관리됩니다. 내용을 수정하고 싶다면 해당 파일을 여세요.

*   `JobFeePage.jsx`: **작업료** 및 **지급그룹** 화면 (메인 탭 포함)
    *   `JobFeeList.jsx`: 작업료 리스트
    *   `PaymentGroupList.jsx`: 지급그룹 리스트
*   `CollectionPage.jsx`: **수금처리** 화면 (수금 리스트, 합산그룹, 지급 상세 모달 포함)
*   `AccountsReceivable.jsx`: **미수관리** 화면 (리스트 및 상세 모달 포함)
*   `Prepayment.jsx`: **선수금관리** 화면 (작업그룹별/업체별 리스트 및 상세 페이지 포함)
*   `SalesLedger.jsx`: **매출원장** 화면
*   `TaxInvoice.jsx`: **세금계산서** 화면
*   `BankTransactions.jsx`: **입출금내역** 화면 (리스트 및 상세 모달 포함)
*   `ExpenseResolution.jsx`: **지출결의** 화면

### 2. 🎨 디자인(스타일) 파일들이 있는 곳
**경로:** `src/styles/`

색상, 간격, 폰트 등 디자인 요소는 여기 있는 CSS 파일들이 담당합니다.

*   `accounting.css`: 회계 페이지들의 전체적인 레이아웃과 디자인이 정의된 파일 (가장 중요!)
*   `styleguide.css`: 글자 크기, 폰트 종류 등 텍스트 관련 규칙이 정의된 파일
*   `accounting-globals.css`: 전체적으로 공통 적용되는 기본 스타일

### 3. 🖼️ 전체 레이아웃 (틀)
**경로:** `src/components/DashboardLayout.jsx`

왼쪽 사이드바(메뉴 목록)와 상단 헤더, 그리고 페이지가 들어갈 자리를 잡아주는 틀입니다.
메뉴 이름이나 아이콘, 순서를 바꾸고 싶다면 이 파일을 수정하면 됩니다.

---

## 🚀 실행 방법

작업한 결과물을 내 컴퓨터에서 확인하려면 터미널에 아래 명령어를 입력하세요.

```bash
npm run dev
```

명령어를 입력하면 나오는 주소(예: `http://localhost:5173`)를 클릭하면 브라우저에서 화면을 볼 수 있습니다.
