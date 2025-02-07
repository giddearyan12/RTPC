import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import "./Dashboard.css";
import jwt_decode from "jwt-decode"; 
import Notification from "../Notification";
import ProjectModal from "./ProjectModal";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedProject, setSelectedProject] = useState(null); 
  const [userId, setUserId] = useState(null); 
  const [loading, setLoading] = useState(true);

  
  const fetchData = async () => {
    try {
      if (token) {
       
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.userId);

        const response = await axios.get("http://localhost:5000/user/listprojects", {
          params: { id: decodedToken.userId },
        });
        setProjectData(response.data.projects);
      } else {
        console.log("No token found in localStorage");
      }
    } catch (error) {
      console.error("Error fetching project data:", error.response?.data || error.message);
    }
    finally{
      setLoading(false);
    }
  };

  
  const handleCardClick = (project) => {
    setSelectedProject(project); 
  };


  const closeModal = () => {
    setSelectedProject(null);
  };

 
  const handleRequest = async (project) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      console.log(project._id)
    
      if (!project._id) {
        alert("Invalid project data");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/students/requestcollaboration",
        {
          projectId: project._id,
          userId: userId, 
        }
      );
      toast(`Collaboration Request Sent`, {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error sending collaboration request:", error.message);
      toast("Collaboration Request Not Sent", {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }

    closeModal();
  };


  useEffect(() => {
    fetchData();
  }, [token]); 

  return (
    <div className="right-main">
      <div className="project">
        <div className="dashboard">
          <div className="dash-title">
            <h2>Total Projects</h2>
          </div>
          {loading?(
            <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading Projects...</p>
          </div>
          ):
          (<div className="project-grid">
            {
              projectData.map((project, index) => (
                <div key={index} >
                  <ProjectCard
                    projectName={project.name}
                    technology={project.technology}
                    description={project.description}
                    onClick={() => handleCardClick(project)}
                  />
                </div>
              ))
             }
          </div>)}
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
