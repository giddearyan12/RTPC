import React, { useEffect, useState } from "react";
import '../Home/ProjectCard.css'; 
import axios from "axios";

function ProjectList() {
  const url = "http://localhost:3000"; 
  const [projects, setProjects] = useState([]); 

  
  const fetchData = async () => {
    try {
    
      const token = localStorage.getItem('token');
      let newUrl = url+'/user/myProject'
      
      const response = await axios.get(newUrl, {
        headers: {
          'Authorization': `Bearer ${token}` 
      }
    });


      setProjects(response.data.projects); 
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="project-list">
      {projects.length === 0 && <p>No projects added yet.</p>}
      {projects.map((project, index) => (
        <div key={index} className="project-card">
          <h3 className="project-name">{project.name}</h3>
          <p className="technologies"><strong>Technologies Used: </strong>{project.technology}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
