import { useEffect, useState } from 'react';
import { getRecommendations } from '../api/recommend';

const cache = new Map(); // key: 세부 업종 코드

/*
  세부 업종 기준 추천 결과 (전체 동)
  가중치 슬라이더로 순위를 다시 계산하려면 TOP N이 아니라 전체 동이 필요해서 topN = 0으로 요청
 */
export function useRecommendations(industry, subIndustry) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!industry || !subIndustry) { setData(null); return; }
    if (cache.has(subIndustry)) { setData(cache.get(subIndustry)); setError(''); return; }

    const ctrl = new AbortController();
    setLoading(true);
    setError('');
    getRecommendations({ industry, subIndustry, topN: 0 }, { signal: ctrl.signal })
      .then((res) => { cache.set(subIndustry, res); setData(res); })
      .catch((e) => { if (e.name !== 'AbortError') { setData(null); setError(e.message); } })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    return () => ctrl.abort();
  }, [industry, subIndustry]);

  return { data, loading, error };
}
