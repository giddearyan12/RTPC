import React, { useState, useEffect } from "react";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import "./Project_Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [filterProjects, setFilterProjects] = useState("All");
  const [loading, setLoading] = useState(true);

  const url = 'http://localhost:5000'

  const fetchProjects = async () => {
    setLoading(true);
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

      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="pro-dash">
      <div className="tabs">
        <div className="tab" onClick={() => setFilterProjects("All")}>
          <FontAwesomeIcon icon={faTasks} className="icon" />
          Total Projects
        </div>

        <div className="tab" onClick={() => setFilterProjects("Completed")}>
          <FontAwesomeIcon icon={faCheckCircle} className="icon" />
          Completed Projects
        </div>

        <div className="tab" onClick={() => setFilterProjects("Ongoing")}>
          <FontAwesomeIcon icon={faSpinner} className="icon" />
          Ongoing Projects
        </div>
      </div>
      <div className="project-app">
        <div className="project_list">
          <ProjectList
            projects={projects}
            filterProjects={filterProjects}
            setProjects={setProjects}
            loading={loading} 
          />
        </div>
        <div className="project_form_section">
          <h1>Add New Project</h1>
          <ProjectForm />
        </div>
      </div>
    </div>
  );
}

export default ProjectDashboard;
