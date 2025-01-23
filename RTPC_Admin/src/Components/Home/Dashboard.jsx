import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import './Dashboard.css';
import axios from "axios";

function Dashboard() {
  const [newProjects, setNewProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('all');

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/newProjects"); 
      if (response.data.success) {
        setNewProjects(response.data.project);
      } else {
        setError(response.data.message || "Failed to fetch projects");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/allProjects"); 
      if (response.data.success) {
        setAllProjects(response.data.project);
      } else {
        setError(response.data.message || "Failed to fetch projects");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching projects");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (projectId) => {
    try {
      const response = await axios.post("http://localhost:5000/admin/remove", { id: projectId }); 
      if (response.data.success) {
       
        // Update the project list after removal
        
        setAllProjects((prevProjects) => prevProjects.filter(project => project._id !== projectId));
      } else {
        alert('Error');
      }
    } catch (err) {
      console.log(err.message || "An error occurred");
    }
  };

  const handleAccept = async (name) => {
    try {
      const response = await axios.post("http://localhost:5000/admin/verify", {
        name: name,
      });
      if (!response.data.success) {
       
        alert('Error');
      }
      setNewProjects((prevProjects) => prevProjects.filter(project => project.name !== name));
    } catch (err) {
      console.log(err.message || "An error occurred while fetching projects");
    }
    
  };

  const handleReject = async (name) => {
    try {
      const response = await axios.post("http://localhost:5000/admin/reject", {
        name: name
      });
      if (!response.data.success) {
       
        alert('Error');
      }
      setNewProjects((prevProjects) => prevProjects.filter(project => project.name !== name));
    } catch (err) {
      console.log("An error occurred while fetching projects");
    }
   
  };

  useEffect(() => {
    fetchProjects();
    fetchAllProjects();
  }, []);

  return (
    <div className="admin-home">
      <div className="toggle-buttons">
        <button 
          className={`toggle-btn ${view === 'all' ? 'active' : ''}`} 
          onClick={() => setView('all')}
        >
          All Projects
        </button>
        <button 
          className={`toggle-btn ${view === 'new' ? 'active' : ''}`} 
          onClick={() => setView('new')}
        >
          New Projects
        </button>
      </div>

      {view === 'all' && (
        <div>
          {allProjects.length === 0 ? (
            <p className="no-project">No projects created yet.</p>
          ) : (
            <div className="projects-list">
              {allProjects.map((project, index) => (
                <ProjectCard 
                  key={index} 
                  project={project} 
                  onRemove={handleRemove}  
                  view={view}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'new' && (
        <div>
          {newProjects.length === 0 ? (
            <p className="no-project">No new projects created yet.</p>
          ) : (
            <div className="projects-list">
              {newProjects.map((project, index) => (
                <ProjectCard 
                  key={index} 
                  project={project} 
                  onAccept={handleAccept}  
                  onReject={handleReject}  
                  view={view}
                  
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
