import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';

const Profile = ({ student, onBack }) => {
  const [studentDetails, setStudentDetails] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${student.name}`); 
        console.log(response.data)
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
    <div className="student-profile-section">
      <div className="student-profile-header">
        <button onClick={onBack} className="back-button">Back</button>
        <h1 className="student-profile-name">{studentDetails.student.name}</h1>
      </div>
      <div className="student-profile-info">
        <div className="student-profile-info-item">
          <p><strong>Email:</strong> {studentDetails.student.email}</p>
        </div>
        <div className="student-profile-info-item">
          <p><strong>Phone:</strong> {studentDetails.student.phone}</p>
        </div>
        <div className="student-profile-info-item">
          <p><strong>Enrollment No:</strong> {studentDetails.student.en}</p>
        </div>
        <div className="student-profile-info-item">
          <p><strong>Department:</strong> {studentDetails.student.department}</p>
        </div>
        <div className="student-profile-info-item">
          <p><strong>Gender:</strong> {studentDetails.student.gender}</p>
        </div>
        <div className="student-profile-info-item">
          <p><strong>College:</strong> {studentDetails.student.college}</p>
        </div>
        <div className="student-profile-info-item">
          <p><strong>Domain:</strong> {studentDetails.student.domain}</p>
        </div>
        <div className="student-profile-info-item">
          <p><strong>Projects:</strong> {studentDetails.student.projects.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
