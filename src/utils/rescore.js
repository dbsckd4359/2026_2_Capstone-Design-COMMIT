// 가중치 슬라이더 값으로 추천 점수를 다시 계산하고 순위를 다시 매깁니다.
// 백엔드가 항목별 점수(0~100)를 주므로 프론트에서 재계산 가능

export const score_items = [
  { key: 'population', field: 'population_score', label: '인구' },
  { key: 'single_households', field: 'single_household_score', label: '1인 가구' },
  { key: 'competition', field: 'competition_score', label: '경쟁도' },
  { key: 'related_store_distribution', field: 'related_store_score', label: '관련 업종' },
    { key: 'time_population', field: 'time_population_score', label: '시간대 생활인구' } 
];

// 정규화 작업(가중치 합을 1로 맞춤) ※모두 0이면 균등 
export function normalizeWeights(w) {
  const sum = score_items.reduce((s, it) => s + (w[it.key] ?? 0), 0);
  if (sum === 0) return Object.fromEntries(score_items.map((it) => [it.key, 1 / score_items.length]));
  return Object.fromEntries(score_items.map((it) => [it.key, (w[it.key] ?? 0) / sum]));
}

// 추천 목록 + 가중치 → 점수 재계산 후 정렬된 새 배열 (원본은 바꾸지 않음) 
export function rescore(recommendations = [], weights) {
  const w = normalizeWeights(weights);
  return recommendations
    .map((r) => ({
      ...r,
     // score: Math.round(score_items.reduce((s, it) => s + r[it.field] * w[it.key], 0) * 100) / 100,
      score: Math.round(score_items.reduce((s, it) => s + (r[it.field] ?? 0) * (w[it.key] ?? 0), 0) * 100) / 100,
    }))
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
