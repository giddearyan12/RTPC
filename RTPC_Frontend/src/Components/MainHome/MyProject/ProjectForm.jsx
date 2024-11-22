import React, { useEffect, useState } from "react";
import axios from "axios";

function ProjectForm() {
  const url = "http://localhost:3000";
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    technology: "",
    userId: ""
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setProjectData((data) => ({
        ...data, userId: decodedToken.id
      }));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectData.name || !projectData.description || !projectData.technology) {
      console.log('All fields required')
      return;
    }

    let newUrl = url + "/user/createProject";
    try {
      const response = await axios.post(newUrl, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Success')

      setProjectData({ name: "", description: "", technology: "", userId: "" });
    } catch (error) {
      console.log("Error creating project:", error);

    }


  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setProjectData(data => ({ ...data, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <div>
        <label>Project Name</label>
        <input
          name="name"
          type="text"
          value={projectData.name}
          onChange={onChangeHandler}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          name='description'
          value={projectData.description}
          onChange={onChangeHandler}
          required
        />
      </div>
      <div>
        <label>Technology</label>
        <select
          name="technology"
          value={projectData.technology}
          onChange={onChangeHandler}
          className="custom-select"
          required
        >
          <option value="">--Select Technology--</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
          <option value="C/C++">C/C++</option>
          <option value="Javascript">Javascript</option>
        </select>

      </div>
      <button type="submit">Add Project</button>
    </form>
  );
}

export default ProjectForm;
