import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "./Chat/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const url = "http://localhost:3000"; 
  const { authUser, setAuthUser } = useAuthContext();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    en: "",
    department: "",
    gender: "",
    college: "",
    domain: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${url}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          console.error("Failed to fetch profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${url}/user/profile`,
        { ...userData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setAuthUser(response.data.user);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditMode(false); 
      } else {
        setMessage({ type: "error", text: response.data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile." });
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-header">My Profile</h2>
      {message && <p className={`profile-message ${message.type}`}>{message.text}</p>}

      <form onSubmit={handleUpdate} className="profile-form">
        <div className="profile-field">
          <label className="profile-label">Name:</label>
          {isEditMode ? (
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="profile-input"
              required
            />
          ) : (
            <p className="profile-value">{userData.name}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">Email:</label>
          <p className="profile-value">{userData.email}</p>
        </div>

        <div className="profile-field">
          <label className="profile-label">Phone:</label>
          {isEditMode ? (
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="profile-input"
              required
            />
          ) : (
            <p className="profile-value">{userData.phone}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">EN No:</label>
          {isEditMode ? (
            <input
              type="text"
              name="en"
              value={userData.en}
              onChange={handleChange}
              className="profile-input"
              required
            />
          ) : (
            <p className="profile-value">{userData.en}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">Department:</label>
          {isEditMode ? (
            <select
              name="department"
              value={userData.department}
              onChange={handleChange}
              className="profile-select"
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="DS">DS</option>
              <option value="AI/ML">AI/ML</option>
            </select>
          ) : (
            <p className="profile-value">{userData.department}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">Gender:</label>
          {isEditMode ? (
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              className="profile-select"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="profile-value">{userData.gender}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">College:</label>
          {isEditMode ? (
            <select
              name="college"
              value={userData.college}
              onChange={handleChange}
              className="profile-select"
              required
            >
              <option value="">Select College</option>
              <option value="Dypcet">Dypcet</option>
            </select>
          ) : (
            <p className="profile-value">{userData.college}</p>
          )}
        </div>

        <div className="profile-field">
          <label className="profile-label">Domain:</label>
          {isEditMode ? (
            <select
              name="domain"
              value={userData.domain}
              onChange={handleChange}
              className="profile-select"
              required
            >
              <option value="">Select Domain</option>
              <option value="Java">Java</option>
              <option value="C/C++">C/C++</option>
              <option value="Python">Python</option>
              <option value="Javascript">Javascript</option>
            </select>
          ) : (
            <p className="profile-value">{userData.domain}</p>
          )}
        </div>

        {isEditMode ? (
          <button type="submit" className="profile-button" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        ) : (
          <button
            type="button"
            className="profile-button"
            onClick={() => setIsEditMode(true)}
          >
            Update Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
