import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import jwt_decode from "jwt-decode"; 
import axios from 'axios';
import Header from './Header';

const UserProfile = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const decodedToken = jwt_decode(token);
        const response = await axios.get("http://localhost:3000/students/profile", {
          params: { id: decodedToken.userId },
        });
        setStudentDetails(response.data.user);
        setFormData(response.data.user); // Pre-fill formData for editing
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student details:', error);
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const decodedToken = jwt_decode(token);
      await axios.put("http://localhost:3000/students/profile", {
        id: decodedToken.userId,
        ...formData,
      });
      setStudentDetails(formData); // Update the UI with the new data
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating student details:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!studentDetails) {
    return <p>Student details not found.</p>;
  }

  return (
    <div>
      <Header/>
    <div className="profile-section">
      <div className="profile-header">
        <h1 className="profile-name">{studentDetails.name}</h1>
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="edit-button">
            Edit
          </button>
        )}
      </div>

      {editMode ? (
        <div className="profile-edit-form">
          <div className="profile-info-item">
            <label><strong>Email:</strong></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-info-item">
            <label><strong>Phone:</strong></label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-info-item">
            <label><strong>Enrollment No:</strong></label>
            <input
              type="text"
              name="en"
              value={formData.en}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-info-item">
            <label><strong>Department:</strong></label>
            <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department...</option>
                <option value="CSE">CSE</option>
                <option value="DS">DS</option>
                <option value="AL/ML">AI/ML</option>
              </select>
          </div>
          <div className="profile-info-item">
            <label><strong>Gender:</strong></label>
            <select value={formData.gender} name="gender" onChange={handleInputChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
          </div>
    
          <div className="profile-info-item">
            <label><strong>Domain:</strong></label>
            <select
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
              >
                <option value="">Select Domain...</option>
                <option value="Java">Java</option>
                <option value="C/C++">C/C++</option>
                <option value="Python">Python</option>
                <option value="Javascript">Javascript</option>
              </select>
          </div>
          <button onClick={() => setEditMode(false)} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleSave} className="save-button">
            Save
          </button>
         
        </div>
      ) : (
        <div className="profile-info">
          <div className="profile-info-item">
            <p><strong>Email:</strong> {studentDetails.email}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Phone:</strong> {studentDetails.phone}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Enrollment No:</strong> {studentDetails.en}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Department:</strong> {studentDetails.department}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Gender:</strong> {studentDetails.gender}</p>
          </div>
        
          <div className="profile-info-item">
            <p><strong>Domain:</strong> {studentDetails.domain}</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default UserProfile;
