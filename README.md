# 🎬 오늘 뭐 볼까? 기분 기반 영화 추천 웹앱 - ViewPick

## 1. 프로젝트 소개

**ViewPick**은 사용자의 **기분**에 따라 오늘 볼 영화를 추천해주는 웹앱입니다.  
“오늘 뭐 볼까?” 버튼을 눌러 현재 기분을 선택하면, 그에 어울리는 영화가 랜덤으로 추천됩니다.  
또한, 탐색 페이지에서 원하는 장르, 국가, 키워드 등으로 영화 콘텐츠를 탐색할 수 있습니다.

- **🖥 배포 주소**: [https://viewpick-web.web.app/](https://viewpick-web.web.app/)
- **📁 주요 기능**: 기분 기반 영화 추천, 조건 탐색, 상세 정보 확인, 찜 목록 저장
- **🛠 GitHub **: https://github.com/changi123/viewpick

---

## 2. 프로젝트 스택

- **Frontend**: React (CRA 기반)
- **Backend/서비스**: Firebase Hosting / Firebase Authentication
- **API**: TMDb (The Movie Database API)
- **Styling**: CSS-in-JS, Inline Style
- **기타**: React Router v6, 환경변수 사용

---

## 3. 주요 기능 소개

### ✅ 기분 기반 랜덤 추천 페이지 (홈)
- “🎲 오늘 뭐 볼까?” 버튼 클릭
- 사용자 기분 선택 (예: 우울해요, 기분 좋아요, 설레요, 심심해요 등)
- 선택한 감정에 맞는 영화 장르로 필터링된 영화 중 무작위로 추천
- 영화 정보 카드 형태로 출력
- “마음에 들어요” / “나중에 볼래요” 버튼으로 찜 기능 제공 ( 추가예정 )

### 🔍 콘텐츠 탐색 페이지 (`/search`) ( 추가예정 )
- TMDb API 기반 영화 목록 탐색
- 조건 필터: 장르 / 국가 / 키워드 / 연도 ( 추가예정 )
- 무한스크롤 방식으로 영화 카드 출력

### 🎞️ 상세 페이지 (`/detail/:id`)
- 영화의 포스터, 제목, 개봉일, 평점, 줄거리 등 정보 표시
- 주요 출연진 5명, 제공 중인 OTT(한국 기준) 정보 포함
- 유튜브 예고편 임베드
- TMDb 추천 영화 6개 출력

### ⭐ 즐겨찾기 페이지 (`/favorites`) ( 추가예정 )
- 로그인한 사용자 전용
- “마음에 들어요” / “나중에 볼래요”로 저장한 영화 리스트 확인 가능

### 👤 마이페이지 ( 추가예정 )
- Firebase Auth 기반 로그인 / 회원가입
- 찜한 영화 목록 관리

---

## 4. 핵심 구현 포인트

### 😄 기분 기반 추천 로직
- 사용자가 기분을 선택하면 미리 정의된 기분-장르 매핑 데이터를 기반으로 랜덤 추천
  - 예: `우울해요 → 코미디`, `설레요 → 로맨스`, `심심해요 → 액션`
- 선택된 장르를 기반으로 TMDb에서 영화를 호출하고, 거기서 무작위 추출

### 🔑 TMDb API 활용
- 다양한 endpoint: `/discover/movie`, `/movie/{id}`, `/movie/{id}/videos`, `/movie/{id}/recommendations`
- 국가, 장르, 키워드 등 파라미터 필터 활용
- 유튜브 예고편 키 추출 후 iframe 임베딩

### 🔥 Firebase 연동
- Firebase Auth를 통해 로그인/회원가입 구현
- 로그인 여부에 따라 찜 버튼 활성화
- Firebase Hosting으로 배포

---

## 5. 주요 UI

| ![홈화면](https://velog.velcdn.com/images/changi_gg/post/5fcae648-681b-4f7d-8ce2-9f2b6bb50fe7/image.jpg) | ![기분선택](https://velog.velcdn.com/images/changi_gg/post/5ed8b0e4-8116-4385-a93d-294acb4fc8d2/image.jpg) |
|:--:|:--:|
| 홈화면 | 기분 선택 |

| ![추천결과](https://velog.velcdn.com/images/changi_gg/post/9736fc16-5120-4c9c-8bd0-a3d347217087/image.jpg) | ![상세페이지](https://velog.velcdn.com/images/changi_gg/post/82d0e926-b38e-469f-ae13-5839bc6951ab/image.jpg) |
|:--:|:--:|
| 기분 선택 시 추천 결과 | 상세 페이지 |

