import { create } from 'zustand';

export const MAX_COMPARE = 2; //임의 후보군 갯수
export  const COMPARE_LABELS = ['A', 'B']; //  담은 순서대로 붙는 후보 라벨 

// 화면 간 공유 상태: 지도 > 업종구분 > 추천 지역 > 상세 비교
export const useFlow = create((set, get) => ({
  location: null,          // { code, name, type, source } : 지도(Map.jsx)에서 고른 동
  industry: null,          // { code, name }
  subIndustry: null,       // { code, name }
  weights: null,           // 사용자가 조정한 가중치 (null이면 백엔드 기본값 사용)
  compare: [],             // 비교 담기한 행정동 이름 (최대 MAX_COMPARE)

  setLocation: (location) => set({ location }),
  setIndustry: (industry) => set({ industry, subIndustry: null, compare: [], weights: null }),
  setSubIndustry: (subIndustry) => set({ subIndustry, compare: [], weights: null }),
  setWeights: (weights) => set({ weights }),

  // 담기 토글. 가득 찼으면 false 반환 ※플로팅바 상단에 팝업창 활성화
  toggleCompare: (dong) => {
    const { compare } = get();
    console.log(compare);
    if (compare.includes(dong)) { set({ compare: compare.filter((d) => d !== dong) }); return true; }
    if (compare.length >= MAX_COMPARE) return false;
    set({ compare: [...compare, dong] });
    return true;
  },
  removeCompare: (dong) => set({ compare: get().compare.filter((d) => d !== dong) }),
  clearCompare: () => set({ compare: [] }),
}));
