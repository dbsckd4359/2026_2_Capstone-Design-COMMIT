import {score_items,normalizeWeights} from  '../../utils/rescore.js';
import { getContributions,  sumContributions } from '../../utils/contribute.js';

import {Badges} from '../../utils/Badges.js';

export const ScoreStackBar  =({row, label, weights,  parts: given})=>{
    const parts = given ?? getContributions(row, weights);
   // console.log(parts)
    const total = sumContributions(parts);
return(
    <div className='stack-row'>
        {/*이름 앞의 A/B서브뱃지*/}
        <span className='stack-name'><img src={Badges[label]} height='24' />{row.admin_dong}</span>
        <div className='stack-track'>
            {parts.map((p => (
              <div key = {p.key} className= {`stack-seg seg-${p.key}`} style ={{width : `${p.value}%`}}
              title = {`${p.label} ${p.value.toFixed(2)}점`} > 
            {p.value.toFixed(1)}

       </div>
          )))}
          </div>
    <span className='stack-total'>{total.toFixed(2)}점</span>
    </div>

  
);
}

export function ScoreStackLegend({weights}){
    const w = normalizeWeights(weights); 
return(
    /*게이지바 하단 가중치 점수항목안내*/
    <ul className='stack-legend'>
        {score_items.map( ele =>{
            return(
            <li key={ele.key}>
                <span className={`stack-dot seg-${ele.key}`}></span>
                {ele.label} (최대{Math.round(w[ele.key] * 100)}점)
            </li>
            )
        })}
    </ul>
)
}