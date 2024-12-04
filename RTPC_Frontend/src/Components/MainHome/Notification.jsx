import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notification.css";
import jwt_decode from "jwt-decode";
import { FaUserCircle, FaBell } from "react-icons/fa";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const decodedToken = jwt_decode(token);
      const response = await axios.get("http://localhost:3000/students/notifications", {
        params: { id: decodedToken.userId },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      
      await axios.post(
        `http://localhost:3000/students/notifications/${id}/respond`,
        { action },
        { params: { userId: userId }}
      );
      setNotifications((prev) => prev.filter((notif) => notif._id !== id)); 
    } catch (error) {
      console.error(`Error handling notification ${action}:`, error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notification-section">
      <div className="title">
        <FaBell />
        <h2>Notifications</h2>
      </div>
      <div>
        {notifications.length === 0 ? (
          <p className="no-notification">No new notifications.</p>
        ) : (
          notifications.map((notif) => (
            <div className="notification-box" key={notif._id}>
              <div className="notification-header">
                <FaUserCircle className="user-icon" />
                <h4>{notif.sender.name}</h4>
              </div>
              <p>{notif.message}</p>
              <div className="notification-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAction(notif._id, "accept")}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(notif._id, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
