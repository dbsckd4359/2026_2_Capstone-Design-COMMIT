// 후보지 상세 비교 모달 (담은 2곳을 같은 항목으로 나란히 비교)
import { useEffect, useRef } from 'react';
import { score_items } from '../../utils/rescore.js';//가중치 항목 배열
import { getContributions, sumContributions, diffContributions } from '../../utils/contribute';
import { ScoreStackBar, ScoreStackLegend } from './ScoreStackBar'
import  {Badges} from '../../utils/Badges.js';
import {COMPARE_LABELS} from '/src/store/useFlow';

import './CompareModal.css';

/*시간대 생활 인구를 가중치에 포함시켰지만 보조지표로 사용 가능한 확실한 구분 필요
   또한 세부 구분을 요소로 넣지 못할 경우 배제할 것※추후 고도화 시 방법 고안 */
const ROWS = [
    { label: '인구', field: 'population', unit: '명', higher: true },
    { label: '1인 가구', field: 'single_households', unit: '가구', higher: true },
    { label: '동일 업종 점포', field: 'selected_category_store_count', unit: '개', higher: false },
    { label: '관련 업종 점포', field: 'related_store_count', unit: '개', higher: true },
    { label: '시간대 생활인구', field: 'time_population', unit: '명', higher: true }, 
];

const fmt = (n) => Number(n).toLocaleString(); //천단위 기준 콤마 추가

export const CompareModal = ({ rows, total, subName, weights, onClose }) => {

    const closeRef = useRef(null);

    const items = rows.map((r ,idx) => {
        const parts = getContributions(r, weights);
        return { ...r, label : r.label ?? COMPARE_LABELS[idx],  parts, total: sumContributions(parts) };
    });
    //console.log(items);
    const [a, b] = items;
    const gap = a.total - b.total; //헤더 영역 센터 점수차 
    console.log(a); //  key: 'population', label: '인구', weight: 30, value: 0
    const weightText = a.parts.map( p  => `${p.label} ${p.weight}`).join(' · '); //커스텀한 가중치를 모달창 좌상단에 현황표기

   // console.log(a.parts);
    const diffs = diffContributions(a.parts, b.parts);

    //모달창 닫기 포커스 및 esc닫기 
    useEffect(() => {
        closeRef.current?.focus();
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    // 항목별로 더 높은 쪽 표시 (경쟁도 점수는 높을수록 경쟁이 약함)
    const better = (field) => {
        if (rows.length < 2) return null;
        const [a, b] = rows.map((r) => r[field]);
        return a === b ? null : a > b ? rows[0].admin_dong : rows[1].admin_dong;
    };

    return (
        <div className="compare-overlay" role="dialog" aria-modal="true" aria-labelledby="compare-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="compare-modal">
                <div className="compare-head">
                    <div className='rows-1'>
                        <div>
                            <span id="compare-title">후보지 상세 비교</span><p>{subName} · 가중치 {weightText}</p>
                        </div>
                        <button className="compare-exit-btn" ref={closeRef} type="button" aria-label="비교 닫기" onClick={onClose}>✕</button>
                    </div>
                    <div className='rows-2'>
                     {items.map((ele, idx) => (
                        <div className= {idx === 0 ? "card-compare-a" : "card-compare-b"}>
                            <div> <span id='n1'><img src={Badges[ele.label]} alt="COMMIT 홈" height="38" /></span><span id='n2'>{ele.admin_dong}</span><span id='n3'>현재 {ele.rank}위 / {total}</span> </div>
                            <span id='n4'>{ele.total.toFixed(2)}점</span></div>
                     ))}
                    {/*비교덱 센터는 공백 */}

                    </div>
                </div>

                <div className='compare-body'>
                    {/*게이지바, 가중치 항목 안내문항*/}
                    <section className="st1">
                        <h4><span>추천 점수는 이렇게 만들어졌어요</span></h4>
                        <p>항목점수  × 가중치의 합 · 막대 전체 길이 = 100점 </p>
                        {items.map(ele => {
                         return( <ScoreStackBar key={ele.admin_dong} row={ele} label={ele.label} parts={ele.parts} />
                        )})}
                        <ScoreStackLegend weights={weights} />
                    </section>

                    {/*점수차이 항목※기준은 가중치 반영 후 의 a-b */}
                    <section>
                        <div><h3>항목별 점수 차이</h3><p>가중치 반영 후</p></div>
                        <div className='cmp-diff-grid'>
                        {diffs.map(ele => {
                            const winner = ele.winnerIdx === null ? null : items[ele.winnerIdx];//비교항목 동 세부 형식
                            return (
                                <div className='cmp-diff-card'>
                                    <span className='cmp-diff-label'>{ele.label}</span>
                                    <strong className='cmp-diff-value'>{Math.abs(ele.diff).toFixed(2)}<small>점</small></strong>
                                    {winner
                                        ? <span className="cmp-diff-win"><img src={Badges[winner.label]}height="18" />
                                            {winner.admin_dong} 쪽이 높음</span>
                                        : <span className="cmp-diff-win">같음</span>}



                                </div>
                            )
                        })}

                        </div>
                    </section>
                    {/*기초지표 */}
                    <section className='cpm-raw'>
                    <table className="compare-table">
                        <thead>
                            <tr>
                                <th scope="col">기초지표 </th>
                                {rows.map((r) => <th scope="col" key={r.admin_dong}>{r.admin_dong}</th>)} 
                                  <th scope="col">차이 ({a.label}−{b.label})</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                        
                            {ROWS.map((row) => {
                             
                                  const va = a[row.field] ?? 0;
                                    const vb = b[row.field] ?? 0;
                                    const d = va - vb;
                                    // 우세: 클수록 유리하면 큰 쪽, 적을수록 유리하면 작은 쪽
                                    const aWin = d !== 0 && (d > 0) === row.higher;
                                    const bWin = d !== 0 && !aWin;
                                return (
                                   <tr key={row.field}>
                                            <th scope="row">
                                                {row.label}
                                                {!row.higher && <span className="cmp-hint">적을수록 유리</span>}
                                            </th>
                                            <td className={aWin ? 'is-win is-a' : undefined}>
                                                
                                                {fmt(va)}{row.unit}{aWin && <span className="cmp-chip">우세</span>}
                                            </td>
                                            <td className={bWin ? 'is-win is-b' : undefined}>
                                                {fmt(vb)}{row.unit}{bWin && <span className="cmp-chip">우세</span>}
                                            </td>
                                            <td className="cmp-delta">{d > 0 ? '+' : d < 0 ? '−' : ''}{fmt(Math.abs(d))}{row.unit}</td>
                                        </tr>
                                );
                            })}
                           
                            <tr>
                                <th scope="row">연령·시간대</th>
                                {rows.map((r) => <td key={r.admin_dong}>생활인구 연동 후 제공 예정</td>)}
                            </tr>
                        </tbody>
                    </table>
                    </section>
                    <section className='cmp-respons'>
                          {items.map( row =>{
                               <div key={row.admin_dong} className="cmp-reason-col">
                                                            <span className="cmp-reason-title"><img src={Badges[row.label]} height="18" />{row.admin_dong} 추천 근거</span>
                                                            <ul>{(row.reasons ?? []).map((t) => {
                                                                return <li key={t}>{t}</li>
                                                            })}
                                                               </ul>
                                                        </div>
                          })}  
                    </section>
                </div>
                <footer className='cmp-foot'>
                      <span>연령·시간대 비교는 생활인구 데이터 연동 후 제공 예정 · 점수는 춘천시 {total}개 동 사이의 상대 비교</span>
                    <button type="button" className="cmp-foot-close" onClick={onClose}>닫기</button>
                </footer>
            </div>
        </div>
    );
};
