import React, { useState } from 'react';
import axios from 'axios';
import './ProjectCard.css';

const ProjectCard = ({ project, view, onRemove, onAccept, onReject }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  

  return (
    <>
      <div className="project-card" onClick={handleOpenModal}>
        <h2>{project.name}</h2>
        <div className="modal-details">
          <p><strong>Technologies: </strong>{project.technology}</p>
          <p><strong>Created By:</strong> {project.createdBy.name}</p>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>Technologies:</strong> {project.technology}</p>
            <p><strong>Created On:</strong> {project.createdAt}</p>
            <p><strong>Created by:</strong> {project.createdBy.name}</p>
            <div className="modal-buttons">
              <button className="accept-btn" onClick={view === 'new' ? () => {onAccept(project.name); handleCloseModal}: () => onRemove(project._id)}>
                {view === 'new' ? 'Accept' : 'Remove'}
              </button>
              <button className="reject-btn" onClick={view === 'new' ? () =>{ onReject(project.name); handleCloseModal } : handleCloseModal}>
                {view === 'new' ? 'Reject' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
