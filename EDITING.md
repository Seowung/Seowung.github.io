# 홈페이지 콘텐츠 편집 안내

GitHub에서 파일 열기 → 연필(Edit) → 수정 → Commit changes로 저장합니다.
코드 파일(app.js, style.css, index.html)을 수정할 필요가 없습니다.

| 수정할 내용 | 파일 |
| --- | --- |
| 이름, 현재 소속, 학위, Scholar·LinkedIn 링크 | content/profile.json |
| 논문 제목, 저자, 학회·저널, 연도, 링크 | content/publications.json |
| 홈 소개 문구, 메뉴, 섹션 설명의 영어·한국어 | content/translations.json |
| 신앙·취미·미국생활 글 | content/posts.json |

JSON에서는 마지막 항목 뒤에 쉼표를 쓰지 않습니다. 문자열에 큰따옴표를 넣으려면 \"처럼 씁니다. en과 ko를 함께 수정하면 두 언어가 일치합니다.

## 논문
content/publications.json에 기존 항목을 복사해서 추가합니다. type은 journal(학술지), conference(학회 논문), preprint(프리프린트), presentation(학회 발표) 중 하나입니다. 최신 연도순으로 자동 정렬됩니다. REVEAL은 MIDL 2026 항목 하나만 유지합니다. REVEAL++는 별도 논문입니다. Scholar 실시간 자동 수집은 하지 않습니다.

## 새 글
content/posts.json은 처음에 []입니다. 다음 형식으로 항목을 추가합니다. 아래는 형식 예시이며 실제 게시글이 아닙니다.

```json
[
  {
    "section": "faith",
    "published": false,
    "date": "2026-10-28",
    "en": {
      "title": "Your title",
      "body": ["First paragraph.", "Second paragraph."]
    },
    "ko": {
      "title": "글 제목",
      "body": ["첫 번째 문단입니다.", "두 번째 문단입니다."]
    }
  }
]
```

section: faith(신앙), interests(취미), life(미국생활).
published가 true인 글만 표시합니다. 글은 날짜 내림차순으로 해당 섹션에 표시됩니다. body의 각 문자열은 한 문단입니다. HTML이 아닌 일반 텍스트로 입력합니다. 한 언어가 없으면 다른 언어의 원문을 표시합니다.

주의: published:false는 화면 표시만 숨깁니다. 나중에 저장소나 사이트를 공개하면 파일 내용은 읽을 수 있으므로 비밀 메모나 개인정보를 넣지 마세요. 비공개 초안은 별도로 보관하세요.

## 미리보기와 공개
GitHub에 저장해도 현재 컴퓨터의 localhost 미리보기에는 자동 동기화되지 않습니다. 이 프로젝트 채팅에 동기화를 요청하세요. 로컬에서 dist 폴더를 HTTP 서버로 열어야 하며, index.html 파일을 직접 더블클릭하는 방식은 지원하지 않습니다.
현재 저장소는 비공개이며 Pages 배포는 꺼져 있습니다. 향후 공개 배포를 연결하면 콘텐츠 파일 변경도 함께 배포됩니다.

## 논문 게시 날짜와 DOI
`publishedDate`를 YYYY-MM-DD, YYYY-MM, YYYY 중 확인 가능한 정밀도로 입력합니다. 날짜가 자세한 항목을 우선해 최신순으로 정렬합니다. 같은 날짜는 파일 순서를 유지합니다. 온라인 공개일이 확인되면 그 날짜를 사용하고, 아니면 출판 메타데이터의 날짜를 사용합니다. 정확한 날짜를 모르는데 1월 1일 등을 임의로 입력하지 마세요. `venue`에는 학술지·학회 이름만, `doi`에는 `10.…` 형식의 DOI 문자열만 입력합니다. 확인되지 않은 DOI는 null로 둡니다. sources에는 검증에 사용한 주소를 기록합니다. `dateNote`는 필요한 경우 en/ko 설명을 담습니다.

## 미국생활 하위 분류
Life in the US 글에는 `category`를 추가합니다. `survival`은 미국에서 유학생&이민자로 살아남기, `ramblings`는 아무말 대잔치입니다. 하위 분류 이름은 content/translations.json의 lifeCategories에서 수정합니다. 글의 en/ko에 각각 제목과 본문을 입력합니다. 한국어 원문과 영어 번역은 언어 스위치로 전환됩니다.

## 방문 통계와 공개 카운터 (연결 준비 완료, 현재 비활성)
GoatCounter 계정이 필요합니다. content/analytics.json의 siteCode에 계정의 사이트 코드를 넣고 enabled를 true로 변경합니다. 실제 공개 주소만 allowedHosts에 등록하세요. localhost에서는 외부 분석 스크립트를 불러오지 않으며 집계하지 않습니다.

관리자 통계: https://사이트코드.goatcounter.com 에 로그인합니다. 전체 통계 공개 설정은 끈 상태로 유지하세요. 공개 카운터만 사용하려면 GoatCounter 설정의 “Allow adding visitor counts on your website”를 켭니다. showPublicCounter를 false로 하면 숫자 표시를 숨길 수 있습니다. 공개 숫자는 TOTAL의 누적 조회 수이며 고유 인원 수가 아닙니다. 서비스 캐시 때문에 최대 4시간 지연될 수 있습니다.

화면별 이동은 집계하지만 언어 전환과 목차 스크롤은 중복 집계하지 않습니다. 현재 life 통계는 하위 분류별로 집계합니다. 검색어나 URL query는 보내지 않으며 referrer도 비워 보냅니다. 비밀 API 토큰은 사이트 파일에 넣지 마세요. 계정이 연결되기 전에는 숫자를 표시하지 않습니다. 현재 GitHub Pages 공개 배포도 켜지 않습니다.

## 홈 조회 수 그래프
홈 하단에 GoatCounter TOTAL 누적 조회 수와 최근 7일(UTC) 일별 막대그래프를 표시합니다. 로컬 미리보기에서도 공개 통계를 읽을 수 있지만 추적 스크립트는 로드하지 않아 방문 기록을 만들지 않습니다. 실제 값이 0이면 0으로 표시하며, 조회에 실패하면 숫자를 임의로 만들지 않고 로딩/조회 불가 안내를 표시합니다. API 결과는 최대 4시간 캐시될 수 있습니다. 각 날짜의 start/end를 같은 날짜로 요청합니다.
