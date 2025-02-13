import React from 'react';
import './Footer.css'; 
import "./PreHome.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faXTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';  

const Footer = () => {

  const languageLinks = {
    "C/C++": "https://en.wikipedia.org/wiki/C%2B%2B",
    "Java": "https://en.wikipedia.org/wiki/Java_(programming_language)",
    "Python": "https://en.wikipedia.org/wiki/Python_(programming_language)",
    "JavaScript": "https://en.wikipedia.org/wiki/JavaScript",
    "Php": "https://en.wikipedia.org/wiki/PHP"
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          
          <div className="footer-col">
            <h4>Languages</h4>
            <ul>
              {Object.entries(languageLinks).map(([name, link]) => (
                <li key={name}><a href={link} target="_blank" rel="noopener noreferrer">{name}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get Help</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="mailto:proyectaminds@gmail.com?subject=Contact%20Us">Contact</a></li>
              <li><a href="#">Terms and Conditions</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#home">About Us</a></li>
              <li><a href="#ss">Our Services</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="x">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;