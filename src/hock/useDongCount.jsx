import { useEffect, useState } from "react";
import { getDongStoreCount } from '../api/store.jsx';

const cache = new Map(); //선택 된 동 재요청 방지

export function useDongStoreCount(admin) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!admin) { setData(null); return; } //현재 동선택X

        if (cache.has(admin)) {
            setData(cache.get(admin));
            setError('');
            return;
        }

        //동 탐색 중 예외 케이스 영역: 동을 빠르게 바꾸면 이전 요청 결과 무시
        const ctrl = new AbortController();
        setLoading(true);
        setError('');

        getDongStoreCount(admin, { signal: ctrl.signal })
            .then((res) => {
                cache.set(admin, res); //다음에 같은 동일 경우 재요청 X
                setData(res);
            })
            .catch((e) => {
                if (e.name !== 'AbortError') { setData(null); setError(e.message); }
            })
            .finally(() => {
                if (!ctrl.signal.aborted) setLoading(false);
            });

        return () => ctrl.abort();
    }, [admin]);

    return { data, loading, error };
}
