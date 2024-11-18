import React, { useState } from 'react';
import StudentsCard from './StudentsCard';
import Profile from './Profile'; // Import the Profile component

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to handle card click
  const handleCardClick = (student) => {
    setSelectedStudent(student); // Set the clicked student's data
  };

  // Function to go back to the students list
  const handleBack = () => {
    setSelectedStudent(null); // Reset to show the students list
  };

  return (
    <div>
      {selectedStudent ? (
        <Profile student={selectedStudent} onBack={handleBack} />
      ) : (
        <StudentsCard onCardClick={handleCardClick} />
      )}
    </div>
  );
};

export default Students;
