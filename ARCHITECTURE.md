# 아키텍처

```
1. 사용자 
2. react화면 지도탐색•추천•비교
3. 커스텀 훅 : 캐시•로딩•요청 취소
4. API계층(/src/api)
    - USE_MOCK = true -> 목데이터/json
    - USE_MOCK = false -> Vite프록시 /api -> FastAPI(127.0.0.1:8000) -> CSV데이터(업종•점포•인구•생활인구) 
```
- `USE_MOCK`으로  목데이터와 API를 전환하므로, 백엔드 없이 화면을 개발•빌드 후 테스트까지 할 수 있습니다. 