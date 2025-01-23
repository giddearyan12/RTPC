import React from 'react';

const StudentProfile = ({ student, closePopup, handleRemoveClick }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Student Profile</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Enrollment No.:</strong> {student.en}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>College:</strong> {student.college}</p>
          <p><strong>Domain:</strong> {student.domain}</p>
          <p><strong>Projects:</strong> {student.projects.join(", ")}</p>
        </div>
        <div className="btns">
          <button className="close-btn" onClick={closePopup}>
            Close
          </button>
          <button className="remove-btn" onClick={handleRemoveClick}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
