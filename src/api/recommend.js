// 업종 목록 · 추천 지역 API
// USE_MOCK : false면 백엔드 호출
import industryMock from './industryMock.json';
import recommendMock from './recommendMock.json';

const USE_MOCK = true;
//const BASE = 'http://127.0.0.1:8000';   //  Vite proxy: /api → http://127.0.0.1:8000
// const BASE  = '/api'

 const MOCK_DELAY = 300;         // 로딩 화면 확인용

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function request(path, params, { signal } = {}) {
  const q = params ? `?${new URLSearchParams(params)}` : '';
  const res = await fetch(`${BASE}${path}${q}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

// 백엔드 카테고리 응답 → { industries: [{ code, name, subs }] }
function toIndustries(data) {
  // 응답이 { available_categories: {...} } / { categories: {...} } / { cafe: "카페", ... } / 배열 중 무엇이든 처리
  const src = data?.available_categories ?? data?.categories ?? data;
  const entries = Array.isArray(src)
    ? src.map((c) => (typeof c === 'string' ? [c, c] : [c.code ?? c.key, c.name ?? c.label]))
    : Object.entries(src);
  return {
    industries: entries.map(([code, name]) => ({
      code,
      name,
      subs: [{ code, name }],   // 백엔드에 세부 업종이 없으니 자기 자신을 하나 넣음
    })),
  };
}





/*
  업종 · 세부 업종 목록
  응답 및 구조: { industries: [{ code, name, subs: [{ code, name }] }] }
 */
export async function getIndustries({ signal } = {}) {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    return { industries: industryMock.industries };
  }
   const data = await request('/industries', null, {signal});

  return   Array.isArray(data?.industries) ? data : toIndustries(data);
}

/*
  세부 업종 기준 행정동 추천
  요청: industry(업종 코드), sub_industry(세부 업종 코드), topN(0 = 전체 동)
 응답: { region, boundary_unit, industry, sub_industry, weights, data_note, recommendations: [...] }
 */
export async function getRecommendations({ industry, subIndustry, topN = 5 }, { signal } = {}) {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    const found = recommendMock[subIndustry];
 
    if (!found) throw new Error(`목데이터에 세부 업종 ${subIndustry}가 없습니다`);

    const recs = topN > 0 ? found.recommendations.slice(0, topN) : found.recommendations;
    return { ...found, recommendations: recs };
  }
  // console.log('[recommend 요청]', { industry, subIndustry });
  return request( '/recommend', { industry, sub_Industry: subIndustry, top_n: topN }, { signal });
}

