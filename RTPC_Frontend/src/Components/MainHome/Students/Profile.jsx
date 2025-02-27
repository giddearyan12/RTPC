import React, { useEffect, useState } from 'react';
import './Profile.css';
import { FaEnvelope, FaPhone, FaIdBadge, FaUser, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const Profile = ({ student, onBack }) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${student.name}`);
      
        setStudentDetails(response.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student details:', error);
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [student.name]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!studentDetails) {
    return <p>Student details not found.</p>;
  }

  return (
    <div className="profile-container">
      <div className="user-profile-header">
        <button onClick={onBack} className="back-button"><FaArrowLeft/></button>
        <h3>Student Profile</h3>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <img src={studentDetails.student.profilePic} alt="Profile" className="profile-avatar" />
          <h3>{studentDetails.student.name}</h3>
        </div>


        <div className="profile-details">
          <div className="domain-title">{studentDetails.student.domain} Developer</div>
          <div className="department-info">{studentDetails.student.department}, {studentDetails.student.college}</div>
          <div className="detail-item-grid">
            <div className="detail-item"><FaEnvelope size={15} color="#4C3575" /> {studentDetails.student.email}</div>
            <div className="detail-item"><FaPhone size={15} color="#4C3575" /> {studentDetails.student.phone}</div>
            <div className="detail-item"><FaIdBadge size={15} color="#4C3575" /> {studentDetails.student.en}</div>
            <div className="detail-item"><FaUser size={15} color="#4C3575" /> {studentDetails.student.gender}</div>
          </div>


        </div>
      </div>

      <div className="profile-projects">
        <h3>Projects</h3>
        <div className="user-projects-grid">
          {studentDetails.student.projects.map((project, index) => (
            <div key={index} className="user-project-card">
              {project}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;
