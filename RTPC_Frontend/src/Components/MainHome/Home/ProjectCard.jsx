import React from 'react';
import './ProjectCard.css'; 

const ProjectCard = ({ projectName, technology, description }) => {
  console.log(technology)
  return (
    <div className="project-card">
      <h3 className="project-name">Name :{projectName}</h3>
      <p className="technologies">
        <strong>Technologies Used: </strong><span>{technology}</span>
      </p>
      <p className="description">{description}</p>
    </div>
  );
}

export default ProjectCard;