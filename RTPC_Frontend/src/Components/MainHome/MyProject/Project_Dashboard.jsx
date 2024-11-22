import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import "./Project_Dashboard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faCheckCircle, faSpinner, faArrowRight } from "@fortawesome/free-solid-svg-icons";


function Project_Dashboard() {
  const [projects, setProjects] = useState([]);

  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  return (
    <div className="pro-dash">
      <div className="tabs">
        <div className="tab">
          <FontAwesomeIcon icon={faTasks} className="icon" />
          Total Projects
          <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
        </div>

        <div className="tab">
          <FontAwesomeIcon icon={faCheckCircle} className="icon" />
          Completed Projects
          <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
        </div>

        <div className="tab">
          <FontAwesomeIcon icon={faSpinner} className="icon" />
          Progress Projects
          <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
        </div>
      </div>
      <div className="App">
        <div className="project_list">
          <h2>Project List</h2>
          <ProjectList projects={projects} />
        </div>
        <div className="project_form_section">
          <h1>Add New Project</h1>
          <ProjectForm addProject={addProject} />
        </div>

      </div>
    </div>
  );
}

export default Project_Dashboard;