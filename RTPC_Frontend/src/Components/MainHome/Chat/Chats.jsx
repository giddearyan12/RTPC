import React from 'react'
import './Chats.css'
import Sidebar from './Components/Sidebar/Sidebar'
import MessageContainer from './Components/Messages/MessageContainer'



const Chats = () => {
  return (
    <div>
      <div className='chat-page'>
			<Sidebar />
			<MessageContainer/>
		 </div> 
   </div>
  )
}


export default Chats
