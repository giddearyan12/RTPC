import React, { useState } from 'react';
import profile from '../../assets/profile.jpg';
import mytask from '../../assets/mytask.png';
import chat from '../../assets/chat.png';
import home from '../../assets/home.png';
import member from '../../assets/member.png';
import project from '../../assets/project.png';
import { FaSearch } from 'react-icons/fa';
import group from '../../assets/group.png';
import setting from '../../assets/setting.png';
import logo from '../../assets/logo.png';

import './HomePage.css';
import Dashboard from './Dashboard';
import Header from './Header';


import Chats from './Chats.jsx'; 
import Students from './Students.jsx'; 
import Teams from './Teams.jsx'; 
import Project_Dashboard from './Project_Dashboard.jsx';

const HomePage = () => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');

 
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Project_Dashboard />;
      case 'chats':
        return <Chats />;
      case 'teams':
        return <Teams />;
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
                <li onClick={() => setSelectedComponent('projects')}>
                  <img src={project} alt="" />My Projects
                </li>
                <li onClick={() => setSelectedComponent('chats')}>
                  <img src={chat} alt="" />Chats
                </li>
                <li onClick={() => setSelectedComponent('teams')}>
                  <img src={group} alt="" />Teams
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
