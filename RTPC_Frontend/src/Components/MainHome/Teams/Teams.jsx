import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdRemoveCircleOutline } from "react-icons/io";
import './Teams.css';

const Teams = () => {
  const [view, setView] = useState('created');
  const [myteamData, setMyTeamData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null); // Stores the member to be removed
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const response = await axios.get('http://localhost:5000/students/team', {
        params: {
          id: decodedToken.userId,
        },
      });
      setMyTeamData(response.data.projects);
      setTeamData(response.data.collaboratedProjects);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = (projectId, collaboratorId) => {
    setMemberToRemove({ projectId, collaboratorId });
    setShowPopup(true);
  };

  const confirmRemoveMember = async () => {
    if (memberToRemove) {
      try {
        const response = await axios.post(`http://localhost:5000/students/remove-collaborator`, {
          data: {
            projectId: memberToRemove.projectId,
            collaboratorId: memberToRemove.collaboratorId,
          },
        });  
        fetchData();
        setShowPopup(false);
        setMemberToRemove(null);
      } catch (error) {
        console.log('Error removing member:', error);
      }
    }
  };

  const cancelRemoveMember = () => {
    setShowPopup(false);
    setMemberToRemove(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="teams-container">
      <div className="toggle-buttons">
        <button 
          className={`toggle-btn ${view === 'created' ? 'active' : ''}`} 
          onClick={() => setView('created')}
        >
          Projects Created by Me
        </button>
        <button 
          className={`toggle-btn ${view === 'collaborated' ? 'active' : ''}`} 
          onClick={() => setView('collaborated')}
        >
          Projects I Collaborate On
        </button>
      </div>

      {view === 'created' && (
        <div>
          {myteamData.length === 0 ? (
            <p className="no-project">No projects created yet.</p>
          ) : (
            myteamData.map((project) => (
              <div key={project._id} className="team-card">
                <h3 className="team-title">{project.name}</h3>
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Collaborator Name</th>
                      <th>Remove Member</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.collaborators.map((collaborator) => (
                      <tr key={collaborator._id}>
                        <td>{collaborator.name || 'None'}</td>
                        <td>
                          <IoMdRemoveCircleOutline 
                            className="remove-icon" 
                            onClick={() => handleRemoveMember(project._id, collaborator._id)} 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}

      {view === 'collaborated' && (
        <div>
          {teamData.length === 0 ? (
            <p className="no-project">No projects to collaborate on yet.</p>
          ) : (
            teamData.map((project) => (
              <div key={project._id} className="team-card">
                <h3 className="team-title">{project.name}</h3>
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Created By</th>
                      <th>Collaborator Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{project.createdBy.name}</td>
                      <td>{project.collaborators.map((collaborator) => collaborator.name).join(', ')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}

      {/* Popup for confirming removal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Are you sure you want to remove this member?</h3>
            <div className="popup-actions">
              <button className="popup-btn" onClick={confirmRemoveMember}>Yes</button>
              <button className="popup-btn" onClick={cancelRemoveMember}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
