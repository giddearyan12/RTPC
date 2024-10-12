import React from 'react'
import './Notification.css'
import { FaUserCircle } from 'react-icons/fa';

import { FaBell } from 'react-icons/fa';

const Notification = () => {
    const tasks = [
        {
          name: "Dylan Hunter",
          time: "2MIN",
          description: "UI/UX Design Review"
          
        },
        {
          name: "Diane Fisher",
          time: "13MIN",
          description: "Get Started with Fast Cad project Get Started with Fast Cad project Get Started with Fast Cad project Get Started with Fast Cad project"
         
        },
        {
          name: "Andrea Gill",
          time: "1HR",
          description: "Task Completed Quality Assurance Task"
      
        }
      ];
      
      
      
  return (
    <div className='notification-section'>
        <div className="title">
        <FaBell />
        <h2>Notification</h2>
        </div>
        <div >
            {
                tasks.map((task, index)=>{
                    return(
                      <div className="notification-box" key={index}>
                      <div className="notification-header">
                          <FaUserCircle className="user-icon" />
                          <h4>{task.name}</h4>
                      </div>
                      <p>{task.description}</p>
                  </div>
                    )
                })
            }
        </div>
      
    </div>
  )
}

export default Notification
