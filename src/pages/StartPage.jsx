import {useNavigate} from 'react-router-dom'
  import { AnimationText } from '../animations/AnimationText.jsx';
import { StartBackdrop } from '../component/startpage/StartBackdrop.jsx';
import '../App.css'
import mainLogo from "/src/assets/COMMIT-logo.svg"

import defaultLogo from "/src/assets/default-icon.svg";
import helpLogo  from "/src/assets/icons/help.svg"
export  function  StartPage(){
    const navigate = useNavigate();



    return(
    <div className='start'>
        <div className='startPage-scrollBar'>
            <a href="/"><img src={mainLogo} alt="COMMIT 홈" height="38"/></a>
             <div className='search-box'>
             <div className='search-home'><span>홈 </span></div>
             <div className='search-menu'><span>메뉴 </span></div>
              <div className='search-price' ><span>가격</span></div>    
                  <div className='search-question' ><span>문의</span></div> 
         </div>
         <div className='searchs-login'><button >로그인/회원가입</button></div>
        </div>
        <div className='startPage-body'>
        <section className='startPage-box'> 
            <h2>스마트 상권 분석 <img src={defaultLogo} alt="COMMIT 홈" height="55"/> </h2> 

        <div className='startPage-box-center'>
          <AnimationText items={['입지가 정해졌다면', '상권을 분석하고', '창업을 준비하세요']} interval={3000} />
         <h3 className="sub-text01">쉽게 접근할 수 있는 분석 서비스</h3>
            </div>
            <p style={{fontSize:'0.8rem'}}>행정동과 희망 업종을 고르면 행정동별 적합도를 분석해서 제공합니다.</p>
            
            <button id='start_btn' onClick={ () => navigate('../pages/SearchMap.jsx')}>분석하기</button> 

         
        </section>
         <StartBackdrop/>
        </div>
       
        <div className="help-icon"><img src={helpLogo} alt="COMMIT 홈" height="60"/></div>
       </div>
    )
}