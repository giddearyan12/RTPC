import React, { useEffect, useState } from 'react';
import './Students.css';
import axios from 'axios';

const StudentsCard = ({ onCardClick }) => {
  const url = 'http://localhost:5000';
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/students`);
      setStudentList(response.data.students);
     
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="student-section">
      <h2>Proyecta Minds Members</h2>
      {loading? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Members...</p>
        </div>
      ) 
      :(<div className="students-list">
        {studentList.map((student) => (
          <div
            className="student-card"
            key={student.id}
            onClick={() => onCardClick(student)}
          >
            <h4>{student.name}</h4>
            <p>{student.domain}</p>
          </div>
        ))}
      </div>)}
    </div>
  );
};

export default StudentsCard;
