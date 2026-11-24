# 상권핏 프론트 ↔ 백엔드 API 명세 (초안)
> 작성: 00 지도 탐색 → 01 조건 설정(팝업) → 03 추천 지역(+ 상세 비교 모달)

## 1. 화면별로 필요한 데이터

| 화면 | 필요한 데이터 | 사용처 | 백엔드 현황 | 요청 사항 |
|---|---|---|---|---|
| 00 지도 탐색 | 동별 업종 점포 수 (현황: 4개) | 우측 게이지 차트, 총계 |  | **신규** `GET /stores/count` |
| 01 조건 설정 | 업종 4개 + 업종별 세부 업종 목록 (코드, 이름) | 업종 칩, 세부 업종 선택 | 업종 4개 (`analysis_group`) | **신규** `GET /industries` |
| 01 조건 설정 | 규모, 고객층 | 비활성화 (데이터 가공 여부 미정) |  | 추후 결정 |
| 03 추천 지역 | 세부 업종 기준 동별 추천 점수, 순위 | 추천 카드 목록 |  | **변경** `GET /recommend`에 `sub_industry` 추가 |
| 03 추천 지역 | 항목별 점수 4개 (인구, 1인 가구, 경쟁도, 관련 업종) | 가중치 슬라이더 재계산, 근거 태그 |  | 유지 |
| 03 추천 지역 | 추천 이유 문장 | 카드 근거 |  있음(`reasons`) | 유지 |
| 03 추천 지역 | 기본 가중치 | 슬라이더 초기값 |  (`weights`) |  |
| 03 추천 지역 | 데이터 기준일 안내 | 화면 하단 | 있음(`data_note`) | 유지 |
| 상세 비교 (모달) | 인구, 1인 가구, 동일·관련 업종 점포 수, 항목 점수, 이유 | 2개 동 나란히 비교 |  (추천 응답에 포함) | 추가 API 불필요 |
| 상세 비교 (모달) | 연령·성별, 시간대 생활인구 | 차트 |  (생활인구 연동 예정) | 추후 필드 이름 합의 |

## 2. API 목록

### 2-1. 업종 목록 `GET /industries`(신규)

응답
```json
{
  "industries": [
    { "code": "CAFE", "name": "카페",
      "subs": [ { "code": "CAFE_COFFEE", "name": "커피전문점" }, { "code": "CAFE_TEA", "name": "차·전통찻집" } ] }
  ]
}
```

- 세부 업종 코드·이름은 현재 프론트 목데이터의 **가정값**입니다. 실제 소분류 기준으로 알려줄 것.

### 2-2. 추천 지역 `GET /recommend`(변경)

요청 파라미터

| 이름 | 필수 | 예 | 설명 |
|---|---|---|---|
| `industry` | O | `CAFE` | 업종 코드 |
| `sub_industry` | O | `CAFE_COFFEE` | 세부 업종 코드 (**신규**) |
| `top_n` | X | `0` | 0 또는 생략 = 전체 동 반환 |

응답 (기존 필드 유지 + `sub_industry` 추가)
```json
{
  "region": "춘천시",
  "boundary_unit": "행정동",
  "industry": "카페",
  "sub_industry": "커피전문점",
  "weights": { "population": 0.3, "single_households": 0.2, "competition": 0.3, "related_store_distribution": 0.2 },
  "data_note": "데이터 기준일 안내 문구",
  "recommendations": [
    {
      "rank": 1, "admin_dong": "신사우동", "score": 77.74,
      "population": 52000, "single_households": 6100,
      "selected_category_store_count": 18, "related_store_count": 120,
      "population_score": 90.1, "single_household_score": 80.2,
      "competition_score": 85.0, "related_store_score": 40.3,
      "reasons": ["인구 규모가 큰 편", "동일 업종(커피전문점) 점포가 적음"]
    }
  ]
}
```
- 프론트는 **전체 동**을 받아 가중치 슬라이더로 순위를 다시 계산, `top_n=0`(전체)을 지원

- 항목 점수 0~100 정규화는 **춘천 전체 동 기준**
※프론트 재계산 결과가 백엔드와 같아야 함

- `selected_category_store_count`는 **세부 업종** 기준 점포 수로 변경

### 2-3. 동별 업종 점포 수 `GET /stores/count` (신규 · 00 지도 탐색)

요청: `admin_dong=퇴계동`

응답
```json
{
  "admin_dong": "퇴계동",
  "total": 497,
  "categories": [
    { "category": "식당·간이음식", "count": 83 },
    { "category": "카페", "count": 103 },
    { "category": "일반주점", "count": 255 },
    { "category": "베이커리·떡·디저트", "count": 56 }
  ]
}
```
- `total`: 업종 4개의 합이 아닌 동 전체 점포 수라면 그 값으로 (없을 경우 프론트가 4개 합으로 표시)

## 3. 공통 규칙(고려사항)
- 행정동 이름: 네이버 지도 역지오코딩 행정동명(`area3`)과 동일한 표기 (예: `후평1동`)
- 오류 응답: HTTP 상태 코드 + `{ "detail": "메시지" }` (FastAPI 기본 형식)
- CORS: 개발 `http://localhost:5173`, 배포 프론트 주소 허용
- 개발 중에는 Vite 프록시(`/api` → `http://127.0.0.1:8000`) 사용

## 4. 백엔드 확인사항
1. 세부 업종의 기준 분류(소상공인 상가정보 중분류/소분류 중 무엇)와 업종별 목록
2. 세부 업종 단위로 추천 점수 계산이 가능한지, 가능하다면 관련 업종(`related_store_count`)의 기준
3. `top_n=0`(전체 동) 반환 가능 여부와 춘천 행정동 수
4. `/stores/count`의 `total` 기준 (4개 업종 합 vs 동 전체)
5. 생활인구(연령·시간대) 연동 일정과 응답 필드 이름
