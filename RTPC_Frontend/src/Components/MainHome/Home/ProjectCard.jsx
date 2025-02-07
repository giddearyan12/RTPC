import React from 'react';
import './ProjectCard.css'; 

const ProjectCard = ({ projectName, technology, description, onClick }) => {
  return (
    <div className="project-card" onClick={onClick}>
      <h3 className="project-name">Name :{projectName}</h3>
      <p className="technologies">
        <strong>Technologies Used: </strong><span>{technology}</span>
      </p>
      <p className="description">{description}</p>
    </div>
  );
}

export default ProjectCard;