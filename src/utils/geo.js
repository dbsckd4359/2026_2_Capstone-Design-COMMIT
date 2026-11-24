// 행정동 GeoJSON(MultiPolygon, [lng, lat]) 대상 공간 계산 유틸

const EARTH_RADIUS = 6371000; // m

// 위경도 > 기준점 근처 평면 좌표(m).
function project(lng, lat, refLat) {
  const rad = Math.PI / 180;
  return [
    lng * rad * EARTH_RADIUS * Math.cos(refLat * rad),
    lat * rad * EARTH_RADIUS,
  ];
}

// ray casting: 점이 고리(ring) 안에 있는지
function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// 점이 동 경계 안에 있는지 (구멍 고려)
export function isPointInFeature(feature, lat, lng) {
  return feature.geometry.coordinates.some(([outer, ...holes]) =>
    pointInRing(lng, lat, outer) && !holes.some((h) => pointInRing(lng, lat, h))
  );
}

// 점과 선분 사이 거리(평면 좌표)
function distToSegment(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

// 점에서 동 경계까지의 최단 거리(m). 안에 있으면 0
export function distanceToFeature(feature, lat, lng) {
  if (isPointInFeature(feature, lat, lng)) return 0;
  const p = project(lng, lat, lat);
  let min = Infinity;
  for (const polygon of feature.geometry.coordinates) {
    const outer = polygon[0];
    for (let i = 0; i < outer.length - 1; i++) {
      const a = project(outer[i][0], outer[i][1], lat);
      const b = project(outer[i + 1][0], outer[i + 1][1], lat);
      min = Math.min(min, distToSegment(p, a, b));
    }
  }
  return min;
}

/**
 * 좌표 기준으로 동 찾기
 1. 좌표를 포함하는 동이 있으면 그 동
 2. 없으면 maxDistance(m) 이내에서 가장 가까운 동
 3. 그것도 없으면 null
 */
export function findDongByPoint(features, lat, lng, maxDistance = 1500) {
  const hit = features.find((f) => isPointInFeature(f, lat, lng));
  if (hit) return { feature: hit, distance: 0 };

  let nearest = null;
  for (const f of features) {
    const d = distanceToFeature(f, lat, lng);
    if (d <= maxDistance && (!nearest || d < nearest.distance)) {
      nearest = { feature: f, distance: d };
    }
  }
  return nearest;
}
