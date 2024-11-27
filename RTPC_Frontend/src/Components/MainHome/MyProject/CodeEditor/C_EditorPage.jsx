import React, { useEffect, useRef, useState } from "react";
import C_Client from "./C_Client";
import C_Editor from "./C_Editor";
import { initSocket } from "./Socket.js";
import logo_white from '../../../../assets/logo_white.png'
import ACTIONS  from "./Actions.js";
import './C_Style.css'
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const LANGUAGES = [
  "python",
  "java",
  "cpp",
  "c",
  "javaScript",
  "php",
];

function C_EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const codeRef = useRef(null);

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const socketRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
  
      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };
  
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });
  
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== Location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
  
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
  
    init();
  
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();
      }
    };
  }, []);
  

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = async () => {
    navigate(-1);
  };

  const runCode = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post("http://localhost:3000/compile", {
        code: codeRef.current,
        language: selectedLanguage,
      });
      console.log("Backend response:", response.data);
      setOutput(response.data.output || JSON.stringify(response.data));
    } catch (error) {
      console.error("Error compiling code:", error);
      setOutput(error.response?.data?.error || "An error occurred");
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen(!isCompileWindowOpen);
  };

  return (
    <div className="editor-container">
      
        <div className="sidebar">
          <img
            src={logo_white}
            alt="Logo"
            className="logo"
          />
          <hr />

          <div className="clients-list">
            <span className="members-title">Members</span>
            {clients.map((client) => (
              <C_Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr />

          <div className="room-actions">
            <button className="copy-btn" onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button className="leave-btn" onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
        </div>
        

        <div className="editor-playground">
        <div className="editor-area">
          <div className="language-selector">
            <select
              className="language-dropdown"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <C_Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      

      <button
        className="compile-btn"
        onClick={toggleCompileWindow}
      >
        {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
      </button>

      <div
        className={`compiler-output ${isCompileWindowOpen ? "open" : ""}`}
      >
        <div className="output-header">
          <h5>Compiler Output ({selectedLanguage})</h5>
          <div className="action-buttons">
            <button
              className="run-btn"
              onClick={runCode}
              disabled={isCompiling}
            >
              {isCompiling ? "Compiling..." : "Run Code"}
            </button>
            <button className="close-btn" onClick={toggleCompileWindow}>
              Close
            </button>
          </div>
        </div>
        <pre className="output-content">
          {output || "Output will appear here after compilation"}
        </pre>
      </div>
      </div>
    </div>
  );
}

export default C_EditorPage;
