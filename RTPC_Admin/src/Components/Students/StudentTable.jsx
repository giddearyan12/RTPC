import React from 'react';

const StudentTable = ({ students, handleViewProfile }) => {
  return (
    <div className="student-table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>
                <img src={student.profilePic} alt="avatar" className="avatar" />
              </td>
              <td>{student.name}</td>
              <td>
                <button
                  className="view-profile-btn"
                  onClick={() => handleViewProfile(student)}
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
