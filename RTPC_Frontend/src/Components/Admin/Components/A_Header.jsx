import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import "./A_Header.css";

import logo from "../assets/logo.png";

const A_Header = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const token = localStorage.getItem("token");
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("chat-user");

    toast("Logged out Successfully", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };
  const handleViewProfile = () => {
    window.location.href = "/profile";
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".user-info")) {
      setIsDropdownVisible(false);
    }
  };
    useEffect(() => {
  
      document.addEventListener("click", handleOutsideClick);
  
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }, [token]);
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="user-info" onClick={toggleDropdown} >
        <FaUserCircle />
        <span>Admin</span>
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
    
      </div>
    </div>
  );
};

export default A_Header;
