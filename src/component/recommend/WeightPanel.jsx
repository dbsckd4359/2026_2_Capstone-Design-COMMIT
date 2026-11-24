// 점수 구성 · 가중치 조정 ※가중치 조절 시 순위 업데이트
import { score_items, normalizeWeights } from '../../utils/rescore';

export const WeightPanel = ({ weights, onChange, onReset }) => {
    const ratio = normalizeWeights(weights);

    return (
        <section className="weight-panel" aria-labelledby="weight-title">
            <span id="weight-title">점수 구성 · 가중치 조정</span>
            {score_items.map((it) => (
                <div className="weight-row" key={it.key}>
                    <label htmlFor={`w-${it.key}`}>{it.label}</label>
                    <input id={`w-${it.key}`} type="range" min="0" max="100" step="5"
                           value={Math.round((weights[it.key] ?? 0) * 100)}
                           onChange={(e) => onChange({ ...weights, [it.key]: Number(e.target.value) / 100 })} />
                    <span className="weight-value">{Math.round(ratio[it.key] * 100)}%</span>
                </div>
            ))}
            <button type="button" className="weight-reset" onClick={onReset}>기본값</button>
            <p className="weight-note">조정하면 순위와 근거가 바로 바뀝니다 (비율은 합계 100% 기준)</p>
        </section>
        
    );
};
