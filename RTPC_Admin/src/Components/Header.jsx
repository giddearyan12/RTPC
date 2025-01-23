import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import "./Header.css";

import logo from "../assets/logo.png";

const Header = () => {
  

  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="user-info" >
        <FaUserCircle />
        <span>Admin</span>
    
      </div>
    </div>
  );
};

export default Header;
