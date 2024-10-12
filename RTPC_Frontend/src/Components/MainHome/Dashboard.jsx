import React from 'react';
import ProjectCard from './ProjectCard';
import './Dashboard.css';
import Notification from './Notification';
import { IoIosAddCircle } from "react-icons/io";

const Dashboard = () => {
  const projectData = [
    {
      projectName: 'Employee Management System',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express']
    },
    {
      projectName: 'E-Commerce App',
      technologies: ['React', 'Firebase', 'Stripe API']
    },
    {
      projectName: 'E-Commerce App',
      technologies: ['React', 'Firebase', 'Stripe API']
    },
    {
      projectName: 'E-Commerce App',
      technologies: ['React', 'Firebase', 'Stripe API']
    }
  ];


  return (

    <div className="right-main">
      <div className="project">
        <div className="dashboard">
          <div className="dash-title">
          <h2>Total Projects</h2>
          
          </div>
          
          <div className="project-grid">
            {projectData.map((project, index) => (
              <ProjectCard
                key={index}
                projectName={project.projectName}
                technologies={project.technologies}
                description={project.description}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="notification">
        <Notification />
      </div>
    </div>



  );
}

export default Dashboard;
