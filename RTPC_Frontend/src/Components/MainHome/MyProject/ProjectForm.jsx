import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ProjectForm() {
  const url = "http://localhost:5000";
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    technology: "",
    userId: ""
  });

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectData.name || !projectData.description || !projectData.technology) {
      console.log("All fields required");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/user/createProject`,
        projectData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if(response.data.success){
        toast(`Project Request Sent`, {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
      else{
        toast(response.data.message, {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }

  
      
      setProjectData({ name: "", description: "", technology: "", userId: "" }); 
    } catch (error) {
      console.log("Error creating project:", error);
   
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setProjectData((data) => ({ ...data, [name]: value }));
  };

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
          name="description"
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
