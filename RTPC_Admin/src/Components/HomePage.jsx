import React, { useState } from 'react';
import mytask from '../assets/mytask.png';
import home from '../assets/home.png';
import member from '../assets/member.png';
import './HomePage.css';
import Dashboard from '../Components/Home/Dashboard.jsx';
import Header from './Header';
import Students from './Students/Students.jsx'; 

const HomePage = () => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');

 
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Project_Dashboard />;
      
      case 'students':
        return <Students />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className='right-navbar'>
        <Header />
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

export default HomePage;
