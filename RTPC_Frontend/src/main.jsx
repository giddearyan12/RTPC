import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from './Components/MainHome/Chat/Context/AuthContext.jsx';
import { SocketContextProvider } from "./Components/MainHome/Chat/Context/SocketContext.jsx";

createRoot(document.getElementById('root')).render(
  
    <StrictMode>
    <AuthContextProvider>
    <SocketContextProvider>
					<App />
				</SocketContextProvider>
    </AuthContextProvider>
  </StrictMode>
 
)
