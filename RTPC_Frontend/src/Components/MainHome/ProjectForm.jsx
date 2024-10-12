import React, { useEffect, useState } from "react";
import axios from "axios";

function ProjectForm() {
  const url = "http://localhost:3000";
  const [projectData, setProjectData] = useState({
    name:"",
    description:"",
    technology:"",
    userId:""
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
   if(token){
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setProjectData((data)=>({
      ...data, userId: decodedToken.id
    }));
   }
  }, [token]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!projectData.name || !projectData.description || !projectData.technology) {
     console.log('All fields required')
      return;
    }
  
    let newUrl = url+"/user/createProject";
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

  const onChangeHandler=(event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setProjectData(data=>({...data, [name]:value}))
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
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          name='description'
          value={projectData.description}
          onChange={onChangeHandler}
        />
      </div>
      <div>
        <label>Technology</label>
        <input
          type="text"
          name='technology'
          value={projectData.technology}
          onChange={onChangeHandler}
        />
      </div>
      <button type="submit">Add Project</button>
    </form>
  );
}

export default ProjectForm;
