import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaTrashAlt, FaTimes, FaCross } from 'react-icons/fa';
import './Teams.css';

const Teams = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState([]);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const token = localStorage.getItem('token');

  let decodedToken;
  try {
    decodedToken = JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error("Invalid token", error);
  }
  const currentUserId = decodedToken?.userId;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [searchQuery,filterByStatus, projects]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students/team', {
        params: { id: currentUserId },
      });
      const allProjects = [...response.data.projects, ...response.data.collaboratedProjects];
      console.log(allProjects)
      setProjects(allProjects);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let updatedProjects = [...projects];

    if (searchQuery) {
      updatedProjects = updatedProjects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterByStatus) {
      updatedProjects = updatedProjects.filter((project) => project.status === filterByStatus);
    }

    setFilteredProjects(updatedProjects);
  };

  const openPopup = (project) => {
    console.log(project)
    setSelectedProject(project);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleRemoveMember = async () => {
    if (memberToRemove) {
      try {
        await axios.post('http://localhost:5000/students/remove-collaborator', {
          projectId: memberToRemove.projectId,
          collaboratorId: memberToRemove.collaboratorId,
        });
        fetchData();
        setShowPopup(false);
        setMemberToRemove(null);
      } catch (error) {
        console.log('Error removing member:', error);
      }
    }
  };

  return (
    <div className="teams-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          className='search-box'
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select className='status-select' onChange={(e) => setFilterByStatus(e.target.value)}>
          <option value="">Filter by Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <p className="no-project">No projects available.</p>
          ) : (
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Technology</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Collaborators</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.name}</td>
                    <td>{project.technology || 'N/A'}</td>
                    <td>{project.createdBy ? project.createdBy.name : 'Me'}</td>
                    <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                    <td className="collaborator-td" onClick={() => openPopup(project)}>
                      <FaUsers style={{ cursor: 'pointer' }} />
                    </td>
                    <td>{project.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {showPopup && (
        <div className="teams-popup-overlay" onClick={closePopup}>
          <div className="teams-popup" onClick={(e) => e.stopPropagation()}>
            <div className="col-title">
            <h3>Collaborators</h3>
            <FaTimes onClick={closePopup}/>
            </div>
            <ul className="collaborators-list">
              {selectedProject.collaborators && selectedProject.collaborators.length > 0 ? (
                selectedProject.collaborators.map((collaborator) => (
                  <li key={collaborator._id} className="collaborator-item">
                    <span>{collaborator.name}</span>
                    
                    {selectedProject.createdBy &&
                      selectedProject.createdBy._id === currentUserId && (
                        <span onClick={() => handleRemoveMember(selectedProject._id, collaborator._id)}>
                          <FaTrashAlt className="remove-icon" />
                        </span>
                      )}
                  </li>
                ))
              ) : (
                <li className="collaborator-item">No collaborators</li>
              )}
            </ul>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;