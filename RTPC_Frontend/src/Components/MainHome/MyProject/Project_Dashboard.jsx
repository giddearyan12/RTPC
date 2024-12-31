import React, { useState, useEffect } from "react";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import "./Project_Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faCheckCircle, faSpinner, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [filterProjects, setFilterProjects] = useState("All");

  const url = "http://localhost:5000";

  
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authorization token is missing!");
        return;
      }

      const response = await axios.get(`${url}/user/myProject`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.projects)

      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Add project to the state
  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  return (
    <div className="pro-dash">
      <div className="tabs">
        <div className="tab" onClick={() => setFilterProjects("All")}>
          <FontAwesomeIcon icon={faTasks} className="icon" />
          Total Projects
          <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
        </div>

        <div className="tab" onClick={() => setFilterProjects("Completed")}>
          <FontAwesomeIcon icon={faCheckCircle} className="icon" />
          Completed Projects
          <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
        </div>

        <div className="tab" onClick={() => setFilterProjects("Ongoing")}>
          <FontAwesomeIcon icon={faSpinner} className="icon" />
          Ongoing Projects
          <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
        </div>
      </div>
      <div className="App">
        <div className="project_list">
          <h2>Project List</h2>
          <ProjectList projects={projects} filterProjects={filterProjects} />
        </div>
        <div className="project_form_section">
          <h1>Add New Project</h1>
          <ProjectForm addProject={addProject} />
        </div>
      </div>
    </div>
  );
}

export default ProjectDashboard;
