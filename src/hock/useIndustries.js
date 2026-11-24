import { useEffect, useState } from 'react';
import { getIndustries } from '../api/recommend';

let cached = null; // 읍면동 내의 점포수 이전 요청 캐싱처리

export function useIndustries() {
  const [industries, setIndustries] = useState(cached ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cached) return;
    const ctrl = new AbortController();
    getIndustries({ signal: ctrl.signal })
      .then((res) => { cached = res.industries; setIndustries(res.industries); })
      .catch((e) => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    return () => ctrl.abort();
  }, []);

  return { industries, loading, error };
}
