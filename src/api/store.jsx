import mockStoreCount  from  './searchMock.json';

const use_mock = true; //목데이터기반 테스트
const base = '/api/stores/count?'; // 실제 API 주소
 //api호출 읍면동,점포 총계, 업종과 업종 점포수
export async function getDongStoreCount(admin, {signal} ={}){

if(use_mock){
    await new Promise( r => setTimeout(r, 300));
    const found = mockStoreCount[admin];

    if(!found)throw new Error(`목데이터에 ${admin}가 존재하지않습니다.`);
    
    return found; 
}


    const ad =new URLSearchParams({admin_dong : admin});
    const ele = await fetch(`${base}${ad}`,{signal}); 
    
    if(!ele.ok) throw new Error(`HTTP ${ele.status}: ${await ele.text()}`);
    
    return ele.json();
}