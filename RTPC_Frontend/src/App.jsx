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
import HP_Admin from './Components/Admin/Components/HP_Admin'
import LogsHistory from './Components/MainHome/MyProject/CodeEditor/LogsHistory'

function App() {
  const { authUser } = useAuthContext();
 

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <PreHome />} />
          <Route path='/user/register' element={authUser ? <HomePage /> : <Registration />} />
          <Route path='/home' element={authUser ? <HomePage /> : <PreHome />} />
          <Route path='/profile' element={authUser ? <UserProfile /> : <PreHome />} />
          <Route path='/ide/:projectId' element={authUser ? <C_Home /> : <PreHome />} />
          <Route path="/logs/:projectId/:userId" element={authUser ?<LogsHistory />: <PreHome />}></Route>
          <Route path="/editor/:roomId" element={authUser ?<C_EditorPage />: <PreHome />}></Route>
          <Route
            path="/admin"
            element={
              authUser && authUser.role === "admin" ? <HP_Admin /> : <HomePage />
            }
          />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
