import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import "./Dashboard.css";
import jwt_decode from "jwt-decode"; 
import Notification from "../Notification";

const Dashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      if (token) {
        
        const decodedToken = jwt_decode(token);

        console.log(decodedToken.id)
        const response = await axios.get("http://localhost:3000/user/listprojects", {
          params: { id: decodedToken.id },
        });
        console.log(response);

     
        setProjectData(response.data.projects);
      } else {
        console.log("No token found in localStorage");
      }
    } catch (error) {
      console.error("Error fetching project data:", error.response?.data || error.message);
    }
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
          <div className="project-grid">
            {projectData.length > 0 ? (
              projectData.map((project, index) => (
                <ProjectCard
                  key={index}
                  projectName={project.name}
                  technology={project.technology}
                  description={project.description}
                />
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
    </div>
  );
};

export default Dashboard;
