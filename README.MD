# 🔍 상권 분석 창업 입지서비스 : COMMIT 
![project img banner](/frontend/src/assets/COMMIT-logo-white.svg)

## 프로젝트 개요
- **프로젝트명**: 상권분석 창업 입지서비스
- **저장소명**: 2026_2_capstone-Design
- **개발 기간**: 2026/11 ~ 
- **핵심 목표**: 상권관련 공공데이터와 오픈API를 통해 예비창업자가 업종에 대한 입지를 분석하고 상세 분석 결과를 통해
  의사결정을 지원합니다.


---
## 기술 스택 

| 구분 | 기술 | 비고 |
| :--- | :--- | :--- |
| **FrontEnd**| `react.js` | 화면구성 | 
| | `Vite8` |  개발서버,빌드 `api`프록시로 서버 연결 | 
| | `React Router` | 페이지 전환   | 
| | `zustand` | 업종,가중치,비교 후보 전역관리  | 
| | `chart.js` | 동별 업종 점포수 시각화  | 
|| `naverMap API ` |  춘천시 행정동 경계지도  | 
| | `CSS` | 별도 라이브러리없이 직접 스타일링   | 
| **AI (Hint)** | `zutand, chart.js, naverMapAPI` | 사용과 연동방안 참조   |
| **BackEnd** | python, FastAPI | RestAPI, Swagger문서 |
|  | CSV데이터 | 점포(업종 소분류),인구,1인가구,시간대별 생활인구 |


---

---
## 팀 구성 및 역할
| 이름 | 역할 | 담당 업무 | GitHub |
| :---: | :---: | :--- | :---: |
이용환 |Leader,BackEnd |데이터가공, 서버 개발| 	@GitHubID|
이윤창 |FrontEnd |클라이언트 UI 개발, 백엔드API연동 | 	https://github.com/dbsckd4359|
이준   |Data Analysis |	데이터수집 및 정제 |	@GitHubID

--- 

## 실행 방법
```
npm install 
npm run dev #로컬 개발서버
npm build #배포용 빌드 dist/
npm preview #빌드 결과 미리보기
```


