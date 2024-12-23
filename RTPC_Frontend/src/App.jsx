import react from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Registration from './Components/Registration'
import './App.css'
import PreHome from './Components/PreHome/PreHome'
import { useAuthContext } from './Components/MainHome/Chat/Context/AuthContext'
import HomePage from './Components/MainHome/HomePage'
import UserProfile from './Components/MainHome/UserProfile'
import C_Home from './Components/MainHome/MyProject/CodeEditor/C_Home'
import C_EditorPage from './Components/MainHome/MyProject/CodeEditor/C_EditorPage'

function App() {
  const { authUser } = useAuthContext();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={authUser ?<HomePage/>:<PreHome/>}/>
          <Route path='/user/register' element={authUser ?<HomePage/>:<Registration/>}/>
          <Route path='/home' element={authUser ?<HomePage/>:<PreHome/>}/>
          <Route path='/profile' element={authUser ?<UserProfile/>:<PreHome/>}/>
          <Route path='/ide/:projectId' element={authUser ?<C_Home/>:<PreHome/>}/>
          <Route path="/editor/:roomId" element={<C_EditorPage />}></Route>

     
        
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
