
import { useEffect, useMemo, useRef, useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import { useFlow, MAX_COMPARE } from '../store/useFlow';
import { useRecommendations } from '../hock/useRecommendations';
import { rescore, score_items, normalizeWeights } from '../utils/rescore';  // [B안] 요약 보드에 가중치 한 줄 표시용
import { WeightPanel } from '../component/recommend/WeightPanel';
import { RecommendCard } from '../component/recommend/RecommendCard';
import { CompareTray } from '../component/recommend/CompareTray';
import { CompareModal } from '../component/recommend/CompareModal';
import '../App.css';

import homelogo from"/src/assets/COMMIT-logo.svg";
import diffBadgeA from "/src/assets/deep diff-icon/badge-a.svg";
import diffBadgeB from "/src/assets/deep diff-icon/badge-b.svg";

const TOP_N = 5;

export function TopPage() {
    const navigate = useNavigate();

    const location = useFlow((s) => s.location);
    const industry = useFlow((s) => s.industry);
    const subIndustry = useFlow((s) => s.subIndustry);
    const userWeights = useFlow((s) => s.weights);
    const setWeights = useFlow((s) => s.setWeights);
    const compare = useFlow((s) => s.compare);
  //  console.log(compare); A동 B동
    const toggleCompare = useFlow((s) => s.toggleCompare);
    const removeCompare = useFlow((s) => s.removeCompare);
    const clearCompare = useFlow((s) => s.clearCompare);

    const { data, loading, error } = useRecommendations(industry?.code, subIndustry?.code);
    //console.log(data);

    const [showAll, setShowAll] = useState(false);
    const [notice, setNotice] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    // [B안] 가중치 조정 팝오버 열림 상태 + 바깥 클릭·Esc로 닫기
    const [weightOpen, setWeightOpen] = useState(false);
    const weightRef = useRef(null);
    useEffect(() => {
        if (!weightOpen) return;
        const onDown = (e) => { if (weightRef.current && !weightRef.current.contains(e.target)) setWeightOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setWeightOpen(false); };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [weightOpen]);

    const weights = userWeights ?? data?.weights ?? null;
    //onsole.log(weights);

    // 가중치가 바뀌면 전체 동 점수·순위 재계산
    const ranked = useMemo(
        () => (data && weights ? rescore(data.recommendations, weights) : []),
        [data, weights]
    );
    const visible = showAll ? ranked : ranked.slice(0, TOP_N);
    //console.log(visible);
    const myDong = location?.name ? ranked.find((r) => r.admin_dong === location.name) : null;
    const compareRows = compare.map((d) => ranked.find((r) => r.admin_dong === d)).filter(Boolean);
    console.log(compareRows);//topPage비교담기 선택 동
    
    const handleToggle = (dong) => {
        const ok = toggleCompare(dong);
        setNotice(ok ? '' : `비교는 최대 ${MAX_COMPARE}곳까지 담을 수 있습니다. 담긴 후보를 빼고 다시 선택하세요.`);
    };

    // 조건 없이 직접 들어온 경우
    if (!industry || !subIndustry) {
        return (
            <div className="top-container-condition-re">
                <p>희망 업종과 세부 업종을 먼저 선택해 주세요.</p>
                <button type="button" onClick={() => navigate('/pages/SearchMap.jsx')}>조건 설정하러 가기</button>
            </div>
        );
    }
    

    return (
       
        <div className="top-container is-b-layout">
            <div className="top-head">
                {/*추후 고도화 사이드바 영역 */}
             
                    <a href="/"><img src ={homelogo}alt="COMMIT 홈" height="38" /></a>
                    <div className='search-box'>
                        <div className='search-home'><span>홈 </span></div>
                        <div className='search-menu'><span>메뉴 </span></div>
                        <div className='search-price' ><span>가격</span></div>
                        <div className='search-question' ><span>문의</span></div>
                    </div>
                    <div className='searchs-login'><button >로그인/회원가입</button></div>
              
            </div>

            {loading && <p>추천 결과를 불러오는 중…</p>}
            {error && <p className="error">{error}</p>}

            {data && weights && (
                <>
                    
                    {/*비교 최대 개수 안내(notice)는 하단 플로팅 바 위로 이동 (아래 compare-float) */}

                    <div className="center-space">
                     
                        <div className='current-summary'>
                            <div className='top-sub-space'>
                                <p className="top-sub">
                                    <span style={{ fontWeight: 'bold' }}>{industry.name} › {subIndustry.name}</span>
                                    {location?.name && <span style={{fontSize : '0.8rem',  fontWeight: 'bold' ,color : ' #64748B;'}}> · 지도 선택 위치: {location.name}</span>}
                                </p>
                            </div>
                            <div className="btn-space">
                                <button type="button" onClick={() => navigate('/pages/SearchMap.jsx')}>조건 다시 설정</button>
                            </div>
                            <div className="pick-dong"><p>내가 고른 동</p><p style={{ fontWeight: 'bold' }}>{myDong.admin_dong} {myDong.rank}위/25</p></div>
                            <div className='rank-dong'><p>현재 1위</p><p style={{ fontWeight: 'bold' }}>{visible[0].admin_dong}</p></div>
                            <div className='diff-candidate'><p>비교 후보</p><p style={{ fontWeight: 'bold' }}>{compare.length}/2</p></div>

                            {/* 요약 보드 3번째 줄: 현재 가중치 한 줄 요약 + 가중치 조정 버튼 > WeightPanel 재사용) */}
                            <div className="weight-space" ref={weightRef}>
                                <p className="weight-summary">
                                    <span className="weight-summary-label">가중치</span>
                                   <span className='weight-curr-label' style={{color: '#64748B'}}> {score_items.map((it) => `${it.label} ${Math.round(normalizeWeights(weights)[it.key] * 100)}`).join(' · ')}</span>
                                </p>
                                <button type="button" className="weight-toggle"
                                    aria-expanded={weightOpen} aria-controls="weight-popover"
                                    onClick={() => setWeightOpen((v) => !v)}>
                                    가중치 조정 {weightOpen ? '▴' : '▾'}
                                </button>
                                {weightOpen && (
                                    <div className="weight-popover" id="weight-popover">
                                        <WeightPanel weights={weights} onChange={setWeights} onReset={() => setWeights(null)} />
                                    </div>
                                )}
                            </div>

                        </div>
                     
                        <ul className="recommend-list">
                            {visible.map((item) => (
                                <RecommendCard key={item.admin_dong} item={item} subName={subIndustry.name}
                                    //isMyDong={item.admin_dong === location?.name}
                                    checked={compare.includes(item.admin_dong)}
                                    onToggle={handleToggle} />
                            ))}
                        </ul>

                        <div class="bottom-space">
                            <button type="button" className="show-all" onClick={() => setShowAll((v) => !v)}>
                                {showAll ? `TOP ${TOP_N}만 보기` : `전체 ${ranked.length}개 동 보기`}
                            </button>

                            <p className="data-note" style={{color :' #64748B;'}}>※ {data.data_note} · 행정동 간 상대적 입지 적합도이며 창업 성공 가능성이 아님.</p>
                        </div>
                    </div>
                </>
            )}
            {/* 화면 아래 가운데 플로팅 
                ※후보를 1곳 이상 담았을 때 활성화
            */}
            {compare.length > 0 && (
                <div className="compare-float">
                    {notice && <p className="compare-notice" role="status">{notice}</p>}
                    <CompareTray items={compare} onRemove={removeCompare}
                        onClear={() => { clearCompare(); setNotice(''); }}
                        onOpen={() => setModalOpen(true)} />
                </div>
            )}

            {modalOpen && compareRows.length === MAX_COMPARE && (
                <CompareModal rows={compareRows} total={ranked.length} subName={subIndustry.name}
                    onClose={() => setModalOpen(false)} weights ={weights} />

            )}
        </div>
    );
}
