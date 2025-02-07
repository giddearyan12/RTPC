import React, { useEffect, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import logo_white from '../../../../assets/logo_white.png'
import './C_Style.css'
import Header from '../../Header';

const C_Home = () => {
    const navigate = useNavigate();
    const projectId = useParams();
    const location = useLocation();
    const { project } = location.state || {}; 
    
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        localStorage.setItem("id", JSON.stringify(project._id));
        toast.success('Created a new room');
    };

    const joinRoom = () => {
      
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }
    
    

        navigate(`/editor/${roomId}`, {
            state: {
                username,
                projectId,
                project
            },
        });
    };

    const token = localStorage.getItem("token");

  const fetchUserName = async () => {
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const response = await axios.get(`http://localhost:5000/user/getname`, {
          params: { id: decodedToken.userId },
        });
       
        setUsername(response.data.user.name);
      } catch (error) {
        console.error("Failed to fetch user name", error);
      }
    } else {
      console.log("No token");
    }
  };
  useEffect(() => {
   fetchUserName();``
  }, [])
  

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    return (
        <div className='home-wrap'>
        <Header/>
        <div className="homePageWrapper">
            
            <div className="formWrapper">
                <img
                    className="homePageLogo"
                    src={logo_white}
                    alt="code-sync-logo"
                />
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
              
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="createNewBtn"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>
          
        </div>
        </div>
    );
};

export default C_Home;