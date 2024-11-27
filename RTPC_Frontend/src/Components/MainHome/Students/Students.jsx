import React, { useState } from 'react';
import StudentsCard from './StudentsCard';
import Profile from './Profile'; 

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);


  const handleCardClick = (student) => {
    setSelectedStudent(student); 
  };


  const handleBack = () => {
    setSelectedStudent(null); 
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
