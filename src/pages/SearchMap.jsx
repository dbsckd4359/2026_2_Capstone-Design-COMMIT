import { useState } from "react"
import { Map as DongMap } from "./Map.jsx"
import { useDongStoreCount } from "../hock/useDongCount.jsx"
import { useFlow } from "../store/useFlow" //전역 상태관리 
import { StoreGaugeChart } from "../component/chart/SearchMapGuageChart.jsx"
import { Condition } from "../component/condition/Condition.jsx" 
//import { NavigationBar } from "../component/Root/NavigationBar.jsx"; 
import '../../src/App.css'

import mainlogo from "/src/assets/COMMIT-logo.svg"
import pinlogo  from "/src/assets/icons/pin.svg"

export const SearchMap = () => {
  const [selectedDong, setSelectedDong] = useState(null); //선택한 읍/면/동 데이터 활성화
  const [conditionOpen, setConditionOpen] = useState(false);
   



  const dongName = selectedDong ? selectedDong.name : null;

  const { data, loading, error } = useDongStoreCount(dongName);
  const setLocation = useFlow((s) => s.setLocation);

  // chartData불러오기
  const chartData = (data?.categories ?? []).map(ele => ({ label: ele.category, value: ele.count }));
  //오름,내림차순 기능에 대한 영역

  const totalStore = data?.total ?? chartData.reduce((sum, curr) => sum + curr.value, 0);

  // 조건 설정 팝업 열기: 지도에서 고른 동을 다음 흐름(조건 → 추천)에 넘김
  const openCondition = () => {
    setLocation(selectedDong);
    setConditionOpen(true);
  };

  return (
    <>
      <div className={`SearchMap-container ${conditionOpen ? 'open': ''}`}>

        <div className="SearchMap-nav">
            <a href="/"><img src={mainlogo} alt="COMMIT 홈" height="38"/></a>
             <div className='search-box'>
             <div className='search-home'><span>홈 </span></div>
             <div className='search-menu'><span>메뉴 </span></div>
              <div className='search-price' ><span>가격</span></div>    
                  <div className='search-question' ><span>문의</span></div> 
         </div>
         <div className='searchs-login'><button >로그인/회원가입</button></div>

        </div>

        <section className="current-box"> 
          <span id="condition-title" ><img src={pinlogo} alt="COMMIT 홈" height="28"/>조건 설정</span>
          <span id="search-navi-space">선택 위치</span>
          <div className="search-box">{selectedDong ? 
          `선택:${selectedDong.name} (${selectedDong.source === 'click' ? '클릭':'지도중심'})`
           : <p style={{fontSize :'0.7rem'}}>동을 선택하거나 지도를 움직여 선택하세요.</p>}
          </div>

          <span id="current-space" >반경 내 현황 </span>

          <div className="current-shop-space">
            {loading && <span>불러오는 중…</span>}
            {error && <span className="error">{error}</span>}
            {data && !loading && (
              <StoreGaugeChart data={chartData} />
            )}
          
            <span id="total-store-space">총 점포 수: {totalStore}개</span>
          </div>

          <div className="choise-space">
            <button type="button" className="condition-btn" onClick={openCondition}>조건 설정</button>
          </div>
        </section>
        <DongMap onDongChange={setSelectedDong} />{/*네이버맵 */}
      </div>

      {conditionOpen && <Condition open ={conditionOpen }onClose={() => setConditionOpen(false)}/>}
    </>
  )
}
