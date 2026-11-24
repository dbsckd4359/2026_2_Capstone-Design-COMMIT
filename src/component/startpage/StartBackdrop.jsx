import { useEffect, useState } from 'react';
import { KOREA_VIEWBOX, KOREA_PATH, CITIES } from './koreaMap';
import './StartBackdrop.css';

const INTERVAL = 2600;   // 몇 ms마다 새 지점을 고를지
const TRAIL = 3;         // 지나간 지점을 몇 개까지 점으로 남길지

export function StartBackdrop() {
  const [current, setCurrent] = useState(8);          // 처음 지점: 강원 춘천시 석사동
  const [trail, setTrail] = useState([0, 2, 12]);     // 직전 지점들 (최근 순)
  const [tick, setTick] = useState(0);                // 바뀔 때마다 +1 , 애니메이션 재생용 key

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setCurrent((prev) => {
        let next = prev;
        while (next === prev) next = Math.floor(Math.random() * CITIES.length);  // 같은 곳 연속 방지
        setTrail((t) => [prev, ...t].slice(0, TRAIL));
        return next;
      });
      setTick((t) => t + 1);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  const city = CITIES[current];
  const at = (p) => ({ left: `${p.x}%`, top: `${p.y}%` });

  return (
    <div className="korea-backdrop" aria-hidden="true">
      {/* 왼쪽: 지금 선택된 지점 */}
      <div className="korea-backdrop__label" key={`label-${tick}`}>
        <p className="eyebrow">현재 선택된 지점</p>
        <p className="region">{city.region}</p>
        <p className="place">{city.place}</p>
      </div>

      {/* 오른쪽: 지도 + 마커 */}
      <div className="korea-backdrop__map">
        <svg viewBox={KOREA_VIEWBOX} width="100%" height="100%">
          <path d={KOREA_PATH} fill="#2F6DB5" />
        </svg>

        {trail.map((k, n) => (
          <span key={`trail-${k}-${n}`} className={`korea-backdrop__trail trail-${n}`} style={at(CITIES[k])} />
        ))}

        <span key={`ripple-${tick}`} className="korea-backdrop__ripple" style={at(city)} />

        <svg key={`pin-${tick}`} className="korea-backdrop__pin" style={at(city)} width="34" height="44" viewBox="0 0 34 44">
          <path d="M17 43S3 28.5 3 17a14 14 0 0 1 28 0c0 11.5-14 26-14 26Z" fill="#289bed" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="17" cy="17" r="5.5" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
}
