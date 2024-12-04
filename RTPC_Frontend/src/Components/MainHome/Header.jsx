import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import jwt_decode from "jwt-decode";
import "./Header.css";
import axios from "axios";
import logo from "../../assets/logo.png";
import toast from "react-hot-toast";
const Header = () => {
  const [userName, setUserName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const token = localStorage.getItem("token");

  const fetchUserName = async () => {
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const response = await axios.get(`http://localhost:3000/user/getname`, {
          params: { id: decodedToken.userId },
        });

        setUserName(response.data.user.name);
      } catch (error) {
        console.error("Failed to fetch user name", error);
      }
    } else {
      console.log("No token");
    }
  };

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
    window.location.href = "/profile"; // Redirect to the profile page
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
    fetchUserName();

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

      <div className="user-info" onClick={toggleDropdown}>
        <FaUserCircle />
        <span>{userName || "Guest"}</span>
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleViewProfile}>
              View Profile
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
