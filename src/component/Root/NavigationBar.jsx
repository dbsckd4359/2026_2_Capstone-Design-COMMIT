import '/src/App.css'; 
/*추후 공통 컴포넌트로 구성*/
export const NavigationBar =()=>{
  
  
  return(
  <div className='startPage-scrollBar'>
            <a href="'/src/pages/StartPage.jsx'"><img src="/src/assets/COMMIT-logo.svg" alt="COMMIT 홈" height="38"/></a>
             <div className='search-box'>
             <div className='search-home'><span>홈 </span></div>
             <div className='search-menu'><span>메뉴 </span></div>
              <div className='search-price' ><span>가격</span></div>    
                  <div className='search-question' ><span>문의</span></div> 
         </div>
         <div className='searchs-login'><button >로그인/회원가입</button></div>
        </div>
  ) 
} 