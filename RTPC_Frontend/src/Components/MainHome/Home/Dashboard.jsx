import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import "./Dashboard.css";
import jwt_decode from "jwt-decode"; 
import Notification from "../Notification";
import ProjectModal from "./ProjectModal";

const Dashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedProject, setSelectedProject] = useState(null); 
  const [userId, setUserId] = useState(null); // Store decoded user ID

  // Fetch data from the API
  const fetchData = async () => {
    try {
      if (token) {
        // Decode the token once and store the userId
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.userId);

        const response = await axios.get("http://localhost:3000/user/listprojects", {
          params: { id: decodedToken.userId },
        });
        setProjectData(response.data.projects);
      } else {
        console.log("No token found in localStorage");
      }
    } catch (error) {
      console.error("Error fetching project data:", error.response?.data || error.message);
    }
  };

  // Handle card click (open modal)
  const handleCardClick = (project) => {
    setSelectedProject(project); 
  };

  // Close the modal
  const closeModal = () => {
    setSelectedProject(null);
  };

  // Handle collaboration request
  const handleRequest = async (project) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      console.log(project._id)
      // Ensure that the project object has the 'id' field
      if (!project._id) {
        alert("Invalid project data");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/students/requestcollaboration",
        {
          projectId: project._id, // Ensure this is correct
          userId: userId, // Use stored user ID
        }
      );
      alert(`Collaboration request sent for project: ${project.name}`);
    } catch (error) {
      console.error("Error sending collaboration request:", error.message);
      alert("Failed to send the collaboration request. Please try again.");
    }

    closeModal();
  };

  // Fetch data when the component mounts or token changes
  useEffect(() => {
    fetchData();
  }, [token]); // Re-fetch when token changes

  return (
    <div className="right-main">
      <div className="project">
        <div className="dashboard">
          <div className="dash-title">
            <h2>Total Projects</h2>
          </div>
          <div className="project-grid">
            {projectData.length > 0 ? (
              projectData.map((project, index) => (
                <div key={index} onClick={() => handleCardClick(project)}>
                  <ProjectCard
                    projectName={project.name}
                    technology={project.technology}
                    description={project.description}
                  />
                </div>
              ))
            ) : (
              <p>No projects available</p>
            )}
          </div>
        </div>
      </div>
      <div className="notification">
        <Notification />
      </div>
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={closeModal} 
          onRequest={handleRequest} 
        />
      )}
    </div>
  );
};

export default Dashboard;
