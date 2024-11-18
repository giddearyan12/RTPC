import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';

const Profile = ({ student, onBack }) => {
  const [studentDetails, setStudentDetails] = useState(null); 
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${student.name}`); 
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
    <div className="profile-section">
      <button onClick={onBack}>Back</button>
      <h1>{studentDetails.name}</h1>
      <p><strong>Email:</strong> {studentDetails.email}</p>
      <p><strong>Phone:</strong> {studentDetails.phone}</p>
      <p><strong>Enrollment No:</strong> {studentDetails.en}</p>
      <p><strong>Department:</strong> {studentDetails.department}</p>
      <p><strong>Gender:</strong> {studentDetails.gender}</p>
      <p><strong>College:</strong> {studentDetails.college}</p>
      <p><strong>Domain:</strong> {studentDetails.domain}</p>
    </div>
  );
};

export default Profile;
