import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notification.css";
import jwt_decode from "jwt-decode";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useSocketContext } from "../MainHome/Chat/Context/SocketContext.jsx";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const { socket } = useSocketContext();
  const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);

  const fetchNotifications = async () => {
    try {
     
      const response = await axios.get("http://localhost:5000/students/notifications", {
        params: { id: decodedToken.userId },
      });

      const unreadNotifications = response.data.reverse();
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchMessageNotifications = async () => {
    try {
      
      
      const response = await axios.post("http://localhost:5000/api/messages/notification", {
        receiverId: decodedToken.userId
      });

      const unreadMessages = response.data.reverse();
      
      setMessageNotifications(unreadMessages);
    } catch (error) {
      console.error("Error fetching message notifications:", error);
    }
  };

  const handleAction = async (id, action) => {
    try {
    
      
      await axios.post(
        `http://localhost:5000/students/notifications/${id}/respond`,
        { action },
        { params: { userId: decodedToken.userId }}
      );

      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error(`Error handling notification ${action}:`, error);
    }
  };

  const markNotification = async (id, message) => {
    
		try {
			await axios.post("http://localhost:5000/api/members/markNotification", {
				receiverId: decodedToken.userId,
				senderId: id,
        message:message,
			});
      setMessageNotifications((prev) =>
        prev.filter((notif) => !(notif.senderId === id && notif.message === message))
    );
		} catch (error) {
			console.log(error);
		}
	};

  useEffect(() => {
    fetchNotifications();
    fetchMessageNotifications();

    if (!socket) return;

    const handleNewMessage = (notif) => {
      if (!notif.seen) {
        setMessageNotifications((prev) => [notif, ...prev]);
        
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  return (
    <div className="notification-section">
      <div className="title">
        <FaBell />
        <h2>Notifications</h2>
      </div>

     <div className="notification-panel">
      <div>
        {
          notifications.map((notif) => (
            <div className="notification-box" key={notif._id}>
              <div className="notification-header">
                <FaUserCircle className="user-icon" />
                <h4>{notif.sender?.name || "Unknown"}</h4>
              </div>
              <p>Sent a Message : {notif.message}</p>
              <div className="notification-actions">
                <button className="accept-btn" onClick={() => handleAction(notif._id, "accept")}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => handleAction(notif._id, "reject")}>
                  Reject
                </button>
              </div>
            </div>
          ))
        }
      </div>
      <div>
        {
          messageNotifications.map((notif, index) => (
            <div className="notification-box" key={index}>
              <div className="notification-header">
                <FaUserCircle className="user-icon" />
                <h4>{notif.sender?.name || "Unknown"}</h4>
              </div>
              <p>New Message: {notif.message}</p>
              <button className="mark-read-btn" onClick={() => markNotification(notif.senderId, notif.message)}>
                Mark as Read
              </button>
            </div>
          ))
        }
      </div>
      </div>
    </div>
  );
};

export default Notification;
