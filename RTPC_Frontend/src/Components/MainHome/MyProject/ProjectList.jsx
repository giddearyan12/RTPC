import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import { FaCheckCircle, FaSpinner } from "react-icons/fa"; // Import FA icons
import jwt_decode from "jwt-decode";
import axios from "axios";
import "./Project_List.css";

function ProjectList({ projects, filterProjects, setProjects, loading }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = jwt_decode(token).userId;
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const updateProject = async () => {
    try {
      const response = await axios.put("http://localhost:5000/user/project/update", {
        data: currentProject,
      });
      if (response.data.success) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === currentProject._id ? { ...currentProject } : project
          )
        );
      } else {
        console.log("Error updating project");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenIDE = (project) => {
    navigate(`/ide/${project._id}`, { state: { project } });
  };

  const handleEditClick = (project) => {
    setCurrentProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProject(null);
  };

  const handleSaveChanges = () => {
    updateProject();
    handleCloseModal();
  };

  const filteredProjects = projects.filter((project) => {
    if (filterProjects === "All") return true;
    return project.status === filterProjects;
  });

  return (
    <div className="project-list">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        filteredProjects.map((project) => (
          <div key={project._id} className="project-cards">
            <div className="myproject-title">
              <h3 className="project-name">
                {project.name}{" "}
                {project.status === "Completed" ? (
                  <FaCheckCircle className="status-icon completed" />
                ) : (
                  <FaSpinner className="status-icon ongoing" />
                )}
              </h3>
              {userId === project.createdBy && (
                <MdOutlineEdit className="edit-icon" onClick={() => handleEditClick(project)} />
              )}
            </div>
            <p className="technologies">
              <strong>Technologies Used: </strong>
              {project.technology}
            </p>
            <button className="open-ide-btn" onClick={() => handleOpenIDE(project)}>
              Open IDE
            </button>
          </div>
        ))
      )}

      {showModal && currentProject && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Project</h2>
            <div className="inline-fields">
              <label>
                Project Name:
                <input
                  type="text"
                  value={currentProject.name}
                  onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                />
              </label>
              <label>
                Technology:
                <select
                  value={currentProject.technology}
                  onChange={(e) => setCurrentProject({ ...currentProject, technology: e.target.value })}
                >
                  <option value="">--Select Technology--</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="C/C++">C/C++</option>
                  <option value="Javascript">Javascript</option>
                </select>
              </label>
            </div>
            <label>
              Description:
              <textarea
                value={currentProject.description}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
              ></textarea>
            </label>

            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={currentProject.status === "Completed"}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    status: e.target.checked ? "Completed" : "Ongoing",
                  })
                }
              />
              <label>Mark as Completed</label>
            </div>

            <div className="modal-buttons">
              <button onClick={handleSaveChanges} className="save-btn">
                Save
              </button>
              <button onClick={handleCloseModal} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
