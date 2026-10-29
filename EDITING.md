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
