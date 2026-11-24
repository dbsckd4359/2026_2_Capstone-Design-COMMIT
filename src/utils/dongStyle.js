

// 동 마다 구분되는 색
const DONG_COLORS = [
  '#E64B4B', '#F08C2E', '#E8C21C', '#7CB82F', '#2FA36B',
  '#1FA6A6', '#2E86DE', '#4D5FD6', '#8A4FD8', '#C24FBF',
  '#E0508A', '#A0522D', '#5B8C5A', '#3F6E9E', '#B07D2B',
];

// 읍·면(외곽 지역)
const RURAL_COLORS = [
  '#8FA89B', '#9AA5B8', '#A89B8F', '#9FB28A', '#8F9FB0',
  '#B0A08A', '#8AA8A8', '#A69AB5', '#A8A88A', '#9AAE9A',
];

export function getDongColor(feature, index) {
  const isRural = feature.properties.type !== '동';
  const palette = isRural ? RURAL_COLORS : DONG_COLORS;
  return palette[index % palette.length];
}

// state: 'default' | 'hover' | 'selected' | 'dimmed'
export function getPolygonStyle(feature, color, state) {
  const isRural = feature.properties.type !== '동';
  const base = {
    strokeColor: color,
    strokeWeight: 1.5,
    strokeOpacity: 0.9,
    strokeStyle: isRural ? 'shortdash' : 'solid',
    fillColor: color,
    fillOpacity: isRural ? 0.15 : 0.25,
  };

  switch (state) {
    case 'hover':
      return { ...base, strokeWeight: 2.5, fillOpacity: 0.4 };
    case 'selected':
      return {
        ...base,
        strokeColor: '#111111',
        strokeWeight: 3,
        strokeStyle: 'solid',
        strokeOpacity: 1,
        fillOpacity: 0.55,
      };
    case 'dimmed': // 다른 동이 선택됐을 때
      return { ...base, fillOpacity: isRural ? 0.06 : 0.12, strokeOpacity: 0.5 };
    default:
      return base;
  }
}

export function getLabelHtml(feature, color, selected) {
  const { name } = feature.properties;
  return `
    <div style="
      transform: translate(-50%, -50%);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: ${selected ? 13 : 11}px;
      font-weight: ${selected ? 700 : 500};
      white-space: nowrap;
      color: ${selected ? '#fff' : '#222'};
      background: ${selected ? color : 'rgba(255,255,255,0.85)'};
      border: 1px solid ${color};
      pointer-events: none;
    ">${name}</div>`;
}
