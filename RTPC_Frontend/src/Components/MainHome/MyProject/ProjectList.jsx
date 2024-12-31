import React from "react";
import { useNavigate } from "react-router-dom";
import "../Home/ProjectCard.css";

function ProjectList({ projects, filterProjects }) {
  const navigate = useNavigate();

  const handleOpenIDE = (projectId) => {
    navigate(`/ide/${projectId}`);
  };

  const filteredProjects = projects.filter((project) => {
    if (filterProjects === "All") return true;
    return project.status === filterProjects;
  });

  return (
    <div className="project-list">
      {filteredProjects.length === 0 && <p>No projects found.</p>}
      {filteredProjects.map((project) => (
        <div key={project._id} className="project-card">
          <h3 className="project-name">{project.name}</h3>
          <p className="technologies">
            <strong>Technologies Used: </strong>
            {project.technology}
          </p>
          <button className="open-ide-btn" onClick={() => handleOpenIDE(project._id)}>
            Open IDE
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
