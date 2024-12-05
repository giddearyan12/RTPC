import React, { useEffect, useState } from 'react';
import './Students.css';
import axios from 'axios';

const StudentsCard = ({ onCardClick }) => {
  const url = 'http://localhost:5000';
  const [studentList, setStudentList] = useState([]);

  // Fetch students data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/students`);
      setStudentList(response.data.students);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="student-section">
      <h2>Proyecta Minds Members</h2>
      <div className="students-list">
        {studentList.map((student) => (
          <div
            className="student-card"
            key={student.id}
            onClick={() => onCardClick(student)} // Pass the clicked student's data
          >
            <h4>{student.name}</h4>
            <p>{student.domain}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsCard;
