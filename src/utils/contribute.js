//기여 점수 = 항목점수(0~100) x 정규화된 가중치 4개를 더하면 추천 점수(rescore와 같음)

import {score_items, normalizeWeights} from './rescore.js';

export function getContributions(rows, weights) {
   const w = normalizeWeights(weights);
    return  score_items.map( ele => ( {
        key : ele.key,
        label : ele.label,
        weight :Math.round(w[ele.key] * 100), //특성에 대한 가중치 표시용% , 그 항목의 최대 점수
        value : (rows[ele.field] ?? 0 ) * w[ele.key],

 })); 
}
//기여 점수 총합
export function sumContributions(parts) {
    return Math.round(parts.reduce((s, p) => s + p.value, 0) * 100) / 100;
}


//A, B안 중 우세동 반환
export function diffContributions(Apart, Bpart){
    return Apart.map( (p, k) =>{ //object , index
        const diff = p.value - Bpart[k].value;
        return { key : p.key, label : p.label, diff, winnerIdx : diff > 0 ? 0 : diff < 0 ? 1 : null }//우세 동을 인덱스로 구분
          
    })
}