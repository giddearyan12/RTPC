import React, { useState, useEffect } from 'react';
import './A_StudentList.css';
import axios from 'axios';
import A_StudentTable from './A_StudentTable';
import A_StudentProfile from './A_StudentProfile';

const A_StudentList = () => {
  const url = 'http://localhost:5000';
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch students data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/students`);
      setStudents(response.data.students);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  const closePopup = () => {
    setSelectedStudent(null);
    setShowConfirmation(false);
  };

  const handleRemoveClick = () => {
    setShowConfirmation(true);
  };

  const confirmRemoveMember = async () => {
    try {
      const response = await axios.post(`${url}/admin/id/${selectedStudent._id}`);

      if (response.data.success) {
        alert('Student removed successfully');
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== selectedStudent._id)
        );
      } else {
        alert('Failed to remove student');
      }
      closePopup();
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  return (
    <div className="student-list-container">
      {/* Pass students and actions to StudentTable component */}
      <A_StudentTable
        students={students}
        handleViewProfile={handleViewProfile}
      />

      {/* Pass selectedStudent and actions to StudentProfile component */}
      {selectedStudent && (
        <A_StudentProfile
          student={selectedStudent}
          closePopup={closePopup}
          handleRemoveClick={handleRemoveClick}
        />
      )}

      {/* Confirmation Pop-up */}
      {showConfirmation && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Confirm Removal</h2>
            <p>Are you sure you want to remove {selectedStudent.name}?</p>
            <div className="confirmation-buttons">
              <button className="confirm-btn" onClick={confirmRemoveMember}>
                Yes
              </button>
              <button className="cancel-btn" onClick={closePopup}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default A_StudentList;
