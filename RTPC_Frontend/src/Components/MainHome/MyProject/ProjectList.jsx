import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../Home/ProjectCard.css";
import axios from "axios";

function ProjectList({ filterProjects }) {
  const url = "http://localhost:5000";
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token is missing!");
        return;
      }

      const newUrl = `${url}/user/myProject`;
      const response = await axios.get(newUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenIDE = (projectId) => {
    navigate(`/ide/${projectId}`); 
  };

  const filteredProjects = projects.filter((project) => {
    if (filterProjects === "All") return true; 
    return project.status === filterProjects; 
  });

  return (
    <div className="project-list">
      {error && <p className="error-message">{error}</p>} 
      {filteredProjects.length === 0 && !error && <p>No projects found.</p>}
      {filteredProjects.map((project, index) => (
        <div key={index} className="project-card">
          <h3 className="project-name">{project.name}</h3>
          <p className="technologies">
            <strong>Technologies Used: </strong>
            {project.technology}
          </p>
         
          <button className="open-ide-btn" onClick={()=>handleOpenIDE(project._id)}>
            Open IDE
          </button>

          <div className="done">
            <label htmlFor="projectComplete" className="completeBtn">
              <span className="material-icons">check_circle</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
