import React, { useEffect, useRef, useState } from "react";
import C_Client from "./C_Client";
import C_Editor from "./C_Editor";
import { initSocket } from "./Socket.js";
import logo_white from "../../../../assets/logo_white.png";
import ACTIONS from "./Actions.js";
import "./C_Style.css";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


const LANGUAGES = ["python", "java", "cpp", "c", "javascript", "php"];

function C_EditorPage() {
  const [clients, setClients] = useState([]);

  const [output, setOutput] = useState("");
  const [fetchData, setFetchData] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const [code, setCode] = useState(""); 
  const codeRef = useRef(""); 

  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const socketRef = useRef(null);

  useEffect(() => {
    fetchCode();
    console.log("Code ...",code)
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, try again later");
        navigate("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
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
        toast.success(`${username} left the room.`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
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
  }, [roomId, location.state?.username, navigate]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const fetchCode = async()=>{
    const projectId = location.state?.projectId.projectId;
    const response = await axios.post('http://localhost:5000/api/get-code',{
      projectId
    })
    console.log('Fetched Code = ',response.data);
    setCode(response.data.code)
    codeRef.current = response.data.code;
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

  // Run the code
  const runCode = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post("http://localhost:5000/api/execute", {
        code: codeRef.current,
        language: selectedLanguage,
      });

      console.log("Backend response:", response.data);

      setOutput(
        response.data.output
          ? response.data.output
          : JSON.stringify(response.data, null, 2)
      );
    } catch (error) {
      console.error("Error compiling code:", error);
      setOutput(error.response?.data?.error || "An error occurred");
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen((prev) => !prev);
  };

  // Import code
  const importCode = (event) => {
    const file = event.target.files[0];
    if (file && file.type.includes("text")) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = (e) => {
        const importedCode = e.target.result;
        setCode(importedCode);
        codeRef.current = importedCode;
      };
    } else {
      alert("Please choose a text file only");
    }
  };

  // Export code
  const exportCode = () => {
    const codeValue = code.trim();
    if (!codeValue) {
      alert("Please type some code in the code editor before exporting");
      return;
    }
    const codeBlob = new Blob([codeValue], { type: "text/plain" });
    const downloadUrl = URL.createObjectURL(codeBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `code.${selectedLanguage}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    codeRef.current = codeValue;
    setCode(codeValue);
  };

  // Save code
  const saveCode = async () => {
    const projectId = location.state?.projectId;
    try {
      const response = await axios.post("http://localhost:5000/api/save-code", {
        code: code,
        language: selectedLanguage,
        username: location.state?.username,
        projectId: projectId,
      });
      toast.success(response.data.message || "Code saved successfully");
    } catch (error) {
      console.error("Error saving code:", error);
      toast.error(
        error.response?.data?.error || "An error occurred while saving the code"
      );
    }
  };

  return (
    <div className="editor-container">
      <div className="sidebar">
        <img src={logo_white} alt="Logo" className="logo" />
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
            <div>
              <label htmlFor="import-code" className="importbutton">
                <span className="material-icons">cloud_download</span>
                <span>Import Code</span>
              </label>

              <input
                type="file"
                id="import-code"
                className="footerBtns"
                style={{ display: "none" }}
                onChange={importCode}
              />
            </div>
            <div>
              <button className="exportbutton" onClick={exportCode}>
                <span className="material-icons">cloud_upload</span>
                <span>Export Code</span>
              </button>
            </div>
            <div>
              <button className="savebutton" onClick={saveCode}>
                Save
              </button>
            </div>

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
              setCode(code);
              codeRef.current = code;
            }}
            initialCode={code}
          />
        </div>

        <button className="compile-btn" onClick={toggleCompileWindow}>
          {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
        </button>

        <div className={`compiler-output ${isCompileWindowOpen ? "open" : ""}`}>
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