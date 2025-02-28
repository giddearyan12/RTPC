import React, { useEffect, useRef, useState } from "react";
import C_Client from "./C_Client";
import C_Editor from "./C_Editor";
import { initSocket } from "./Socket.js";
import logo_white from "../../../../assets/logo_white.png";
import { useSocketContext } from "../../Chat/Context/SocketContext.jsx";
import ACTIONS from "./Actions.js";
import "./C_Style.css";
import {useNavigate,useLocation,Navigate,useParams} from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";


const LANGUAGES = ["python", "java", "cpp", "c", "javascript", "php"];

function C_EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [tempCode, settempCode] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const [code, setCode] = useState("");
  const codeRef = useRef("");
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { project } = location.state || {};
  
  const token = localStorage.getItem("token");
  const userId = jwt_decode(token).userId;
  const [logs, setLogs] = useState([]);
  const [lastLogTimestamp, setLastLogTimestamp] = useState(null);
  const [hasNewLog, setHasNewLog] = useState(false);
  const [inputIndex, setInputIndex] = useState(0);
  const [prompts, setPrompts] = useState([]);
  const [userInput, setUserInput] = useState("");
  const socketRef = useRef(null);
  const [userInputs, setUserInputs] = useState([]);
  const { socket } = useSocketContext();

//   const samplecode = `
//   num1 = input("Enter first number: ")
//   num2 = input("Enter second number: ")
//   print(f"Sum of {num1} and {num2}")
// `;

  useEffect(() => {
    setPrompts(detectInputPlaceholder(codeRef.current));
  }, []); 

  useEffect(() => {
    const fetchCode = async () => {
      const projectId = location.state?.projectId.projectId;
      const response = await axios.post("http://localhost:5000/api/get-code", {
        projectId,
      });
      settempCode(response.data.code);
      await setCode(response.data.code);
      codeRef.current = response.data.code;
    };

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
        initialCode: code,
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


    

    const fetchAndInit = async () => {
      await fetchCode();
      await getLogs();
      await init();
    };

    fetchAndInit();

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
  useEffect(() => {
     
    if (!socket) return;

    const handleNewLog = (log) => {
      
      setLogs((prevLogs) => {
        const updatedLogs = [log, ...prevLogs]; 
        return updatedLogs.slice(0, 5); 
      });
      setHasNewLog(true);
    };

    socket.on("newLog", handleNewLog);
      return () => {
        socket.off("newLog", handleNewLog);
      };
    }, [socket])




  const getLogs = async () => {
    const projectId = location.state?.projectId.projectId;
    const response = await axios.post("http://localhost:5000/api/logs-code", {
      projectId,
    });

    const newLogs = response.data;
    setLogs(newLogs.reverse());

    if (newLogs.length > 0) {
      const latestLogTime = newLogs[0].timestamp;
     

      if (!lastLogTimestamp || latestLogTime > lastLogTimestamp) {
        setHasNewLog(true);
        setLastLogTimestamp(latestLogTime);
      }
    }
  };

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

  const detectInputPlaceholder = (code) => {
    const inputRegex = /input\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    const matches = [...code.matchAll(inputRegex)];
    return matches.map((match) => match[1]);
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && userInputs.trim()) {
      setUserInputs((prev) => [...prev, userInputs.trim()]);
      if (inputIndex < prompts.length - 1) {
        setInputIndex((prev) => prev + 1);
        setUserInput("");
      }
    }
  };
  const runCode = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post("http://localhost:5000/api/execute", {
        code: codeRef.current,
        language: selectedLanguage,
        input: userInput,
      });

      

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

  const saveCode = async () => {
    const projectId = location.state?.projectId;
    try {
      const response = await axios.post("http://localhost:5000/api/save-code", {
        code: code,
        language: selectedLanguage,
        username: location.state?.username,
        projectId: projectId,
      });
      settempCode(code);
      toast.success(response.data.message || "Code saved successfully");
    } catch (error) {
      console.error("Error saving code:", error);
      toast.error(
        error.response?.data?.error || "An error occurred while saving the code"
      );
    }
  };
  const submitCode = async () => {
    const projectId = location.state?.projectId;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/submit-code",
        {
          code: code,
          username: location.state?.username,
          projectId: projectId,
        }
      );
      getLogs();
      toast.success(response.data.message || "Code submitted successfully");
    } catch (error) {
      console.error("Error saving code:", error);
      toast.error(
        error.response?.data?.error || "An error occurred while saving the code"
      );
    }
  };
  const handleLogSelection = (event) => {
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: event.target.value,
    });
    setHasNewLog(false);
  };
 

  return (
    <div className="editor-container">
      <div className="sidebar">
        <img src={logo_white} alt="Logo" className="logo" />
        <hr />

        <div className="clients-list">
          <span className="members-title">Members</span>
          {clients.map((client) => (
            <C_Client key={client.socketId} username={project.createdBy.name === client.username ? `${client.username} ⭐` : client.username}  />
          ))}
        </div>

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
              <button
                className="savebutton"
                onClick={() =>
                  project.createdBy._id === userId ? saveCode() : submitCode()
                }
              >
                <span className="material-icons">save</span>
                {project.createdBy._id === userId ? "Save" : "Submit"}
              </button>
            </div>
            {project.createdBy._id === userId ? (
              <select
                className="language-dropdown"
                onChange={handleLogSelection}
              >
                <option disabled value="">
                  Select a log
                </option>
                <option value={tempCode}>Updates</option>
                {logs.map((log, index) => (
                  <option key={index} value={log.code}>
                    {log.username}
                  </option>
                ))}
              </select>
            ) : null}
            {project.createdBy._id === userId && hasNewLog && (
              <span
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "200px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "green",
                  borderRadius: "50%",
                }}
              />
            )}

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

        <div className={`compiler-input ${isCompileWindowOpen ? "open" : ""}`}>
          <div className="input-header">
            <h5>Compiler Input</h5>
          </div>

          <textarea
            className="input-content"
            placeholder={prompts[inputIndex] || "Enter input here..."}
            value={userInput}
            onChange={handleUserInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className={`compiler-output ${isCompileWindowOpen ? "open" : ""}`}>
          <div className="output-header">
            <h5>Compiler Output</h5>
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