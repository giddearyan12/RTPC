import React, { useEffect, useState } from "react";
import axios from "axios";
import "./A_Dashboard.css";

function A_Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const url = 'http://localhost:5000';

  useEffect(() => {
    if (filter === "new") {
      fetchNewProjects();
    } else {
      fetchAllProjects();
    }
  }, [filter]);
  

  const fetchNewProjects = async () => {
    try {
      const response = await axios.get(`${url}/admin/newProjects`);
      if (response.data.success) {
        console.log(response.data.project);
        setProjects(response.data.project);
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
      const response = await axios.get(`${url}/admin/allProjects`);
      if (response.data.success) {
        setProjects(response.data.project);
      } else {
        setError(response.data.message || "Failed to fetch projects");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching projects");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (name) => {
    try {
      const response = await axios.post(`${url}/admin/verify`, {
        name: name,
      });
      if (!response.data.success) {
        alert("Error");
      }
      setProjects((prevProjects) => prevProjects.filter((project) => project.name !== name));
    } catch (err) {
      console.log(err.message || "An error occurred while processing the request");
    }
  };

  const handleReject = async (name) => {
    try {
      const response = await axios.post(`${url}/admin/reject`, { name: name });
      if (!response.data.success) {
        alert("Error");
      }
      setProjects((prevProjects) => prevProjects.filter((project) => project.name !== name));
    } catch (err) {
      console.log("An error occurred while processing the request");
    }
  };


  const handleRemove = async (projectId) => {
    try {
      const response = await axios.post(`${url}/admin/remove`, { id: projectId });
      if (response.data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== projectId));
      } else {
        alert("Error removing project");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((project) => {
    return (
      project.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
  });

  return (
    <div className="admin-home">
      <div className="controls">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All Projects</option>
          <option value="new">New Projects</option>
        </select>
      </div>

      {loading ? (
        <div className="loader">Loading projects...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="project-table-container">
        <table className="project-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Technology</th>
              <th>Created By</th>
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr><td colSpan="5">No projects found</td></tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project._id}>
                  <td>{project.name}</td>
                  <td>{project.technology}</td>
                  <td>{project.createdBy.name}</td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>
                    {filter==='new' && (
                      <button className="accept-btn" onClick={() => handleAccept(project.name)}>Accept</button>
                    )}
                    {filter==='new' && (
                      <button className="reject-btn" onClick={() => handleReject(project.name)}>Reject</button>
                    )}
                    {
                      filter==='all' && (
                    <button className="remove-btn" onClick={() => handleRemove(project._id)}>Remove</button>)
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default A_Dashboard;