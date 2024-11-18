import React, { useState } from 'react'
import './prehome.css'
import { useNavigate } from 'react-router-dom'
import PreHomeImg from '../../assets/PreHomeImg.png'
import ServiceCard from './ServiceCard.jsx'
import logo from '../../assets/logo.png'
import Footer from './Footer.jsx'

const PreHome = () => {

  const navigate = useNavigate();

  const serviceCards = [
    {
        title: "Project Collaboration",
        description: "Connect with skilled peers to collaborate on projects, combining expertise for seamless team-based development."
    },
    {
        title: "Real-time Chat",
        description: "Communicate with your team instantly with integrated real-time chat, ensuring smooth and efficient exchanges during project development."
    },
    {
        title: "Integrated IDE",
        description: "Collaboratively write, run, and debug code directly within the platform through the built-in IDE, enhancing development speed and teamwork."
    }
];





  return (
    <div className='prehome'>
      <div className="navbar">
        <img src={logo} alt="" />
        <ul className="nav-links">
          <li>Home</li>
          <li>About Us</li>
          <li><a href='#ss'>Services</a></li>
        </ul>
        <div className='btn'>
          <button className='contact-btn'><a href='#footer'>Contact Us</a> </button>
          <button onClick={()=>navigate('/user/register')} className='sign-in-btn'>Get Started <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path></svg></button>
        </div>
      </div>
      <div className="home">
        <div className="login-section">
          <h2>Collaborate Seamlessly with <span>PROYECTA MINDS</span></h2>
          <p><span>PROYECTA MINDS</span> brings people together to collaborate effortlessly on projects, uniting minds and ideas in one seamless platform designed for effective teamwork.</p>
          <button onClick={()=>navigate('/user/register')}>Get Started <svg stroke="currentColor" fill="currentColor" StrokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path></svg></button>
        </div>

        <div className="demo">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className='background-svg'>
            <path fill="#5A71E3" d="M55.1,-47.1C67.7,-28.2,71.6,-5.5,67.7,17C63.8,39.4,52,61.5,33.5,70.9C15,80.4,-10.3,77.1,-31.2,66.4C-52.2,55.7,-68.7,37.6,-71.8,18.1C-74.9,-1.4,-64.4,-22.2,-50.2,-41.6C-36,-60.9,-18,-78.8,1.6,-80.1C21.3,-81.4,42.5,-66.1,55.1,-47.1Z" transform="translate(100 100)" />
          </svg>
          <img src={PreHomeImg} alt="" className='foreground-img' />
        </div>
      </div>
      <div id="ss" className="services-section">
            <h2>WHAT WE DO</h2>
            <h1>We Provide You With Real Time Project Collaboration</h1>
          

      <div className="services-container">
            {serviceCards.map((card, index) => (
                <ServiceCard
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                />
            ))}
                
            </div>
      </div>
      <div id="footer"> <Footer/></div>
     

    </div>
  )
}

export default PreHome