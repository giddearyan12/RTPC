import react from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Registration from './Components/Registration'
import './App.css'
import PreHome from './Components/PreHome/PreHome'
import { useAuthContext } from './Components/MainHome/Chat/Context/AuthContext'
import HomePage from './Components/MainHome/HomePage'

function App() {
  const { authUser } = useAuthContext();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PreHome/>}/>
          <Route path='/user/register' element={<Registration/>}/>
          <Route path='/home' element={authUser ?<HomePage/>:<PreHome/>}/>
        
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
