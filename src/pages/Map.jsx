import { useEffect, useRef, useState } from 'react';
import DongLayer from './DongLayer';

//상태끌어올리기 > SearchMap.jsx 
export  const Map =({ onDongChange })=> { 
  
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [selected_Dong, setSelected_Dong] = useState(null);

    //const CLIENT_ID = import .meta.env.VITE_NAVER_CLIENT_KEY //API KEY  
  const CLIENT_ID =  "z086o37v4y";
    const  SEOUL_CENTER = {LAT: 37.5665,LNG: 126.9780} 
    const CHUNCHEON_CENTER = { lat: 37.8813, lng: 127.7298 }; 

    //구분용 마커좌표
const places = [
  { name: '춘천시청', lat: 37.8813, lng: 127.7300 },
  { name: '남춘천역', lat: 37.8640, lng: 127.7238 }
];

  useEffect(() => {
    let mapInstance = null;

   const initMap = ()=>{
    const { naver } = window;
   // console.log(naver);
    if (!naver || !mapRef.current) return;

    mapInstance = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(CHUNCHEON_CENTER.lat, CHUNCHEON_CENTER.lng),
      zoom: 14,
    });

    places.forEach((p) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(p.lat, p.lng),
        map : mapInstance,
      });

      const info = new naver.maps.InfoWindow({
        content: `<div style="padding:8px">${p.name}</div>`,
      });
      naver.maps.Event.addListener(marker, 'click', () =>
        info.getMap() ? info.close() : info.open(mapInstance, marker)
      );
    });
     setMap(mapInstance);      
   };

  
const script = document.createElement('script');
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}`;
 script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
}, []);

const handleSelect = (feature, source) => {
    const dong = feature
      ? { code: feature.properties.code, name: feature.properties.name, type: feature.properties.type, source }
      : null;
    setSelected_Dong(dong);
    onDongChange?.(dong);
  };


  return (
  <>
  <div ref={mapRef} className= 'origin-map' style={{ width: '100%', height: '94%' }}  />
      
      
      {/*지도 중심 탐색을 위한 중심 서클 */}
        <div  
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 14, height: 14, marginLeft: -7, marginTop: -7,
            border: '2px solid #111', borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)', pointerEvents: 'none', zIndex: 10,
          }}
        />
  
      
       
        <DongLayer
          map={map}
          selectedCode={selected_Dong?.code}
          onSelect={handleSelect}
          selectMode="both"
          maxDistance={1500}
        />
     
  </>
  )

}