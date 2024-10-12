import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import "./Header.css";
import logo from '../../assets/logo.png'

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
      <img src={logo} alt="" />
     
      </div>
     
      
      <div className="user-info">
        
        <FaUserCircle />
        <span>Dylan Hunter</span>
      </div>
    </div>
  );
}

export default Header;