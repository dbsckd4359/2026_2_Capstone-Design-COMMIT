import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import {StartPage} from './pages/StartPage.jsx'
import { SearchMap } from './pages/SearchMap.jsx'
import { TopPage } from './pages/TopPage.jsx'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
    <Route path='/' element={<StartPage/>}/>
     <Route path='/pages/SearchMap.jsx' element={<SearchMap/>}/>
    {/* Condition는 SearchMap 안의 팝업으로 이동 */}
    <Route path='/pages/TopPage.jsx' element={<TopPage/>}/>
    </Routes>
   
      </>
    

  )
}

export default App
