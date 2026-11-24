import { useEffect, useRef } from 'react';
import chuncheonDong from '../data/chuncheonDong.json';
import { findDongByPoint } from '../utils/geo';
import { getDongColor, getPolygonStyle, getLabelHtml } from '../utils/dongStyle';


export default function DongLayer({
  map,
  selectedCode = null,
  onSelect,
  selectMode = 'both',
  maxDistance = 1500,
  types = ['동', '읍', '면'],
  showLabels = true,
}) {
  const itemsRef = useRef(new Map()); // code  { feature, color, polygons, label }
  const onSelectRef = useRef(onSelect);
  const selectedRef = useRef(selectedCode);
  onSelectRef.current = onSelect;
  selectedRef.current = selectedCode;

  const typesKey = types.join(',');

  // 1. 폴리곤·라벨 생성 (map 또는 표시 구분이 바뀔 때만)
  useEffect(() => {
    const { naver } = window;
    if (!map || !naver) return;

    const features = chuncheonDong.features.filter((f) =>
      typesKey.split(',').includes(f.properties.type)
    ); 
    
    const listeners = [];
    const items = itemsRef.current;

    features.forEach((feature, index) => {
      const { code } = feature.properties;
      const color = getDongColor(feature, index);

      // MultiPolygon  조각마다 Polygon 하나 (첫 고리 = 외곽, 나머지 = 구멍)
      const polygons = feature.geometry.coordinates.map(
        (rings) =>
          new naver.maps.Polygon({
            map,
            paths: rings.map((ring) =>
              ring.map(([lng, lat]) => new naver.maps.LatLng(lat, lng))
            ),
            clickable: true,
            ...getPolygonStyle(feature, color, 'default'),
          })
      );

      const [labelLat, labelLng] = feature.properties.labelPoint;
      const label = showLabels
        ? new naver.maps.Marker({
            map,
            position: new naver.maps.LatLng(labelLat, labelLng),
            clickable: false,
            icon: {
              content: getLabelHtml(feature, color, false),
              anchor: new naver.maps.Point(0, 0),
            },
          })
        : null;

      polygons.forEach((polygon) => {
        if (selectMode !== 'center') {
          listeners.push(
            naver.maps.Event.addListener(polygon, 'click', () =>
              onSelectRef.current?.(feature, 'click')
            )
          );
        }
        listeners.push(
          naver.maps.Event.addListener(polygon, 'mouseover', () => {
            if (selectedRef.current === code) return;
            polygons.forEach((p) => p.setOptions(getPolygonStyle(feature, color, 'hover')));
          }),
          naver.maps.Event.addListener(polygon, 'mouseout', () => {
            if (selectedRef.current === code) return;
            const state = selectedRef.current ? 'dimmed' : 'default';
            polygons.forEach((p) => p.setOptions(getPolygonStyle(feature, color, state)));
          })
        );
      });

      items.set(code, { feature, color, polygons, label });
    });

    // 지도 이동이 끝나면(idle) 중심 좌표로 동 선택
    if (selectMode !== 'click') {
      listeners.push(
        naver.maps.Event.addListener(map, 'idle', () => {
          const center = map.getCenter();
          const result = findDongByPoint(features, center.lat(), center.lng(), maxDistance);
          const code = result?.feature.properties.code ?? null;
          if (code !== selectedRef.current) {
            onSelectRef.current?.(result?.feature ?? null, 'center');
          }
        })
      );
    }

    return () => {
      naver.maps.Event.removeListener(listeners);
      items.forEach(({ polygons, label }) => {
        polygons.forEach((p) => p.setMap(null));
        label?.setMap(null);
      });
      items.clear();
    };
  }, [map, typesKey, selectMode, maxDistance, showLabels]);

  // 2. 선택 상태가 바뀌면 스타일만 갱신 (다시 그리지 않음)
  useEffect(() => {
    const { naver } = window;
    if (!naver) return;
    itemsRef.current.forEach(({ feature, color, polygons, label }, code) => {
      const isSelected = code === selectedCode;
      const state = isSelected ? 'selected' : selectedCode ? 'dimmed' : 'default';
      polygons.forEach((p) => p.setOptions(getPolygonStyle(feature, color, state)));
      if (label) {
        label.setIcon({
          content: getLabelHtml(feature, color, isSelected),
          anchor: new naver.maps.Point(0, 0),
        });
        label.setZIndex(isSelected ? 1000 : 100);
      }
    });
  }, [selectedCode, map, typesKey, selectMode, maxDistance, showLabels]);

  return null; // 지도 위 오버레이만 다루므로 DOM은 렌더링X
}
