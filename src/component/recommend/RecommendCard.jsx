// 추천 지역 카드 1개 (순위 ,동 , 점수 , 근거 태그 , 비교 담기)
export const RecommendCard = ({ item, subName, isMyDong, checked, onToggle }) => {
    return (
        <li className={`recommend-card${checked ? ' is-checked' : ''}`}>
           <div class="card-head">
            <span className="rank">{item.rank}</span>
            <strong className="dong-name">{item.admin_dong}</strong>
           </div>
            <div className="recommend-info">
             
                {/*{isMyDong && <span className="my-dong">지도에서 선택한 동</span>}*/}
                <ul className="reason-tags">
                    {item.reasons.map((r) => <li key={r}>{r}</li>)}
                </ul>
                <strong className="store-count">
                    동일 업종({subName}) {item.selected_category_store_count}개 · 관련 업종 {item.related_store_count}개
                </strong>
            </div>

            <div className="recommend-score">
                <strong>{item.score}점</strong>
                <label className="compare-check">
                    <input type="checkbox" checked={checked} onChange={() => onToggle(item.admin_dong)} />
                    <span>비교 담기</span>
                </label>
            </div>
        </li>
    );
};
