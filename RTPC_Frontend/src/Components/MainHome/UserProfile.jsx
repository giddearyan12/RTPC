import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import jwt_decode from "jwt-decode";
import { FaUsers, FaCogs, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { FaEnvelope, FaPhone, FaIdBadge, FaUser } from 'react-icons/fa';
import { MdOutlineEdit } from "react-icons/md";
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
        const response = await axios.get("http://localhost:5000/students/profile", {
          params: { id: decodedToken.userId },
        });

        setStudentDetails(response.data.user);
        console.log(response.data.user)
        setFormData(response.data.user);
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
      await axios.put("http://localhost:5000/students/profile", {
        id: decodedToken.userId,
        ...formData,
      });
      setStudentDetails(formData);
      setEditMode(false);
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
      <Header />
      <div className="profile-section">
        <div className="profile-header">
          <h1 className="my-profile">My Profile</h1>
          {!editMode && (
           
            <MdOutlineEdit className="edit-icon" onClick={() => setEditMode(true)}/>
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
          <>
            <div className="my-profile-content">
              <div className="my-profile-card">
                <img src={studentDetails.profilePic} alt="Profile" className="my-profile-avatar" />
                <h3>{studentDetails.name}</h3>
              </div>


              <div className="my-profile-details">
                <div className="my-domain-title">{studentDetails.domain} Developer</div>
                <div className="my-department-info">{studentDetails.department}, {studentDetails.college}</div>
                <div className="my-detail-item-grid">
                  <div className="my-detail-item"><FaEnvelope size={15} color="#4C3575" /> {studentDetails.email}</div>
                  <div className="my-detail-item"><FaPhone size={15} color="#4C3575" /> {studentDetails.phone}</div>
                  <div className="my-detail-item"><FaIdBadge size={15} color="#4C3575" /> {studentDetails.en}</div>
                  <div className="my-detail-item"><FaUser size={15} color="#4C3575" /> {studentDetails.gender}</div>
                </div>


              </div>

            </div>
            <div className="my-profile-projects">
              <h3>Projects</h3>

              <div className="my-projects-grid">
                {studentDetails.projects.map((project, index) => (
                  <div key={index} className="my-project-card">
                    <h3 className="project-name">{project.name}</h3>
                    <div className="my-project-info">

                      <div className="info-item">
                        <FaUsers />
                        <span>{project.collaborators.length}</span>
                      </div>
                      <div className="info-item">
                        <FaCogs />
                        <span>{project.technology}</span>
                      </div>
                    </div>
                    <div className="info-item progress-container">
                      {project.status === 'Completed' ? (
                        <>
                          <FaCheckCircle className="status-icon" />
                          <progress value={100} max={100} className="progress-bar completed" />
                        </>
                      ) : (
                        <>
                          <FaSpinner className="status-icon spin" />
                          <progress value={50} max={100} className="progress-bar ongoing" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>




            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
