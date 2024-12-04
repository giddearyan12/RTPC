import React, { useState } from "react";
import "./createfolder.css";

const CreateFolder = () => {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [activeFolder, setActiveFolder] = useState(null);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);

  const handleFolderCreation = () => {
    if (newFolderName.trim() !== "") {
      setFolders([...folders, { name: newFolderName, files: [] }]);
      setNewFolderName("");
      setShowFolderInput(false); // Hide the folder input after creation
    }
  };

  const handleFileCreation = () => {
    if (newFileName.trim() !== "" && activeFolder !== null) {
      const updatedFolders = folders.map((folder, index) => {
        if (index === activeFolder) {
          return { ...folder, files: [...folder.files, newFileName] };
        }
        return folder;
      });
      setFolders(updatedFolders);
      setNewFileName("");
      setShowFileInput(false); // Hide the file input after creation
    }
  };

  return (
    <div className="folder-button">
      <div className="foldercreatebtn">
        <label
          htmlFor="createFolder"
          className="createBtn"
          onClick={() => setShowFolderInput(!showFolderInput)} // Toggle folder input visibility
        >
          <span className="material-icons">create_new_folder</span>
        </label>
      </div>

      <div>
        {/* File Creation Button */}
        {activeFolder !== null && (
          <label
            htmlFor="createFile"
            className="createBtn"
            onClick={() => setShowFileInput(!showFileInput)} // Toggle file input visibility
          >
            <span className="material-icons">note_add</span>
          </label>
        )}
      </div>

      {/* Folder Creation Input */}
      {showFolderInput && (
        <div className="folder-input">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
          <button className="createbtn" onClick={handleFolderCreation}>
            Create Folder
          </button>
        </div>
      )}

      {/* File Creation Input */}
      {showFileInput && activeFolder !== null && (
        <div className="file-input">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter file name"
          />
          <button className="createbtn" onClick={handleFileCreation}>
            Create File
          </button>
        </div>
      )}

      {/* Display Folders and Files */}
      <div className="folders">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="folder"
            onClick={() => setActiveFolder(index)}
            style={{
              backgroundColor: activeFolder === index ? "green" : "#545453",
            }}
          >
            <h3>{folder.name}</h3>
            <ul>
              {folder.files.map((file, idx) => (
                <li key={idx}>{file}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateFolder;
