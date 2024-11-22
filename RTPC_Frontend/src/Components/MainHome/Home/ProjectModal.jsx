import React from "react";
import "./ProjectModal.css";

const ProjectModal = ({ project, onClose, onRequest}) => {
  return (
    <div className="project-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>{project.name}</h2>
        
        <div className="collaboration-question">
          <p>Do you want to collaborate on this project?</p>
          <div className="modal-buttons">
          <button className="request-button" onClick={() => onRequest(project)}>
              Request
            </button>
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
