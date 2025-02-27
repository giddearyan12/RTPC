import React, { useState } from 'react';
import mytask from '../assets/mytask.png';
import home from '../assets/home.png';
import member from '../assets/member.png';
import './HP_Admin.css';
import A_Dashboard from './A_Home/A_Dashboard.jsx';
import A_Header from './A_Header.jsx';
import A_Students from './A_Students/A_Students.jsx'; 

const HP_Admin = () => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');

 
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return <A_Dashboard />;
      case 'students':
        return <A_Students />;
      default:
        return <A_Dashboard />;
    }
  };

  return (
    <>
      <div className='right-navbar'>
        <A_Header />
      </div>
      <div className='main-home'>
        <div className="left">
          <div className="left-box">
            <div className="mytask">
              <img src={mytask} alt="" />
              <p>My Task</p>
            </div>
            <div className="main-menu">
              <ul>
                <li onClick={() => setSelectedComponent('dashboard')}>
                  <img src={home} alt="" />Home
                </li>
                
                <li onClick={() => setSelectedComponent('students')}>
                  <img src={member} alt="" />Students
                </li>
              </ul>
            </div>
           
          </div>
        </div>
        <div className="right">
          {renderComponent()} 
        </div>
      </div>
    </>
  );
};

export default HP_Admin;
