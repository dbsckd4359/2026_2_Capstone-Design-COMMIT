# 🔍 상권 분석 창업 입지서비스 : COMMIT 
![project img banner](src/assets/COMMIT-logo-white.svg)

## 프로젝트 개요
- **프로젝트명**: 상권분석 창업 입지서비스
- **저장소명**: 2026_2_capstone-Design
- **개발 기간**: 2026/11 ~  
- **대상 지역**: 강원특별자치도 춘천시
- **핵심 목표**: 상권관련 공공데이터와 오픈API를 통해 예비창업자가 업종에 대한 입지를 분석하고 상세 비교 결과를 통해
  의사결정을 지원합니다.

## 데모
 `https://2026-2-capstone-designt2.vercel.app`
 - 배포된 데모는 목데이터로 동작합니다. ※FastAPI를 통한 백엔드 연동 후 배포는 이어서 준비 중입니다.
   
  
   
---
## 주요 기능
| 단계 | 기능 | 화면 | 
| :---: | :---: | :--- | 
| 1.지도탐색   |춘천시 경계 지도에서 읍/면/동 선택시 업종별 점포 수를 확인| `/docs/images/searchMap.png` 
| 2.조건설정 |업종 > 세부업종 필터링 |	`/docs/images/condition.png` 
| 3.입지 추천   | 행정동별 추천 점수,순위,추천 근거 제공. 가중치 조절 시 순위 업데이트 |	`/docs/images/topPage.png` 
| 4.후보지 비교 | 두 후보동에 대한 상세 추천 점수, 항목에 대한 점수차이 ,보조지표를 통한 상세비교 | `/docs/images/compare.png` 
---

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
| **BackEnd** | python, FastAPI | RestAPI, Swagger문서 |
|  | CSV데이터 | 점포(업종 소분류),인구,1인가구,시간대별 생활인구 |

> AI활용: `zutand, chart.js, naverMapAPI` 사용법과 연동 방안 참조   

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


