// 하단 비교 트레이: 담은 후보 표시 · 빼기 · 비교하기 >  플로팅 바로 변경

     
import { MAX_COMPARE } from '../../store/useFlow';

export const CompareTray = ({ items, onRemove, onClear, onOpen }) => {
    const empty = MAX_COMPARE - items.length;

    return (
        <section className="compare-tray" aria-label="비교 후보">
 
            <span className="compare-count">비교 {items.length}/{MAX_COMPARE}</span>
            <ul className="compare-chips">
                {items.map((dong) => (
                    <li key={dong} className='compare-after'> { /*동빼기*/} 
                        <span>{dong}</span>
                        <button type="button" aria-label={`${dong} 빼기`} onClick={() => onRemove(dong)}>×</button>
                    </li>
                ))}
                {Array.from({ length: empty }, (_, i) => ( /*동뺴기 before*/ 
                 
                    <li key={`empty-${i}`} className="compare-empty">+ 한 곳 더 담기</li>
                ))}
            </ul>
            <div className='compare-btn-space'>
            <button type="button" className="compare-clear" disabled={!items.length} onClick={onClear}>비우기</button>
            <button type="button" className="compare-open" disabled={items.length < MAX_COMPARE} onClick={onOpen}>
                비교하기 
            </button>
            </div>
        </section>
    );
};
