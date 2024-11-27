import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import '../Home/ProjectCard.css'; 
import axios from "axios";

function ProjectList() {
  const url = "http://localhost:3000"; 
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null); // State for handling errors
  const navigate = useNavigate(); // Initialize the navigate function

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authorization token is missing!");
        return;
      }

      const newUrl = `${url}/user/myProject`;
      const response = await axios.get(newUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const handleOpenIDE = () => {
    navigate('/ide'); // Navigate to the /ide page
  };

  return (
    <div className="project-list">
      {error && <p className="error-message">{error}</p>} {/* Show error message if any */}
      {projects.length === 0 && !error && <p>No projects added yet.</p>}
      {projects.map((project, index) => (
        <div key={index} className="project-card">
          <h3 className="project-name">{project.name}</h3>
          <p className="technologies"><strong>Technologies Used: </strong>{project.technology}</p>
          <button 
            className="open-ide-btn"
            onClick={handleOpenIDE} // Add the click handler here
          >
            Open IDE
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
