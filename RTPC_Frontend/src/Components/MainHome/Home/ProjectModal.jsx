import React from "react";
import "./ProjectModal.css";

const ProjectModal = ({ project, onClose, onRequest }) => {
  return (
    <div className="project-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>{project.name}</h2>
        <div className="name-status">
        <p>
          <strong>Created By:</strong> {project.createdBy.name}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        
        </div>
        <p>
          <strong>Collaborators:</strong>{" "}
          {project.collaborators.length > 0
            ? project.collaborators.map((collab, index) => (
                <span key={index}>
                  {collab.name}
                  {index < project.collaborators.length - 1 ? ", " : ""}
                </span>
              ))
            : "None"}
        </p>
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
