import React from 'react';
import './ProjectCard.css'; 

const ProjectCard = ({ projectName, technologies, description }) => {
  return (
    <div className="project-card">
      <h3 className="project-name">{projectName}</h3>
      <p className="technologies">
        <strong>Technologies Used: </strong>{technologies.join(', ')}
      </p>
      <p className="description">{description}</p>
    </div>
  );
}

export default ProjectCard;