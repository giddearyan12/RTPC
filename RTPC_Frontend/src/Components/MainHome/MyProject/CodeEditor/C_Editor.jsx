import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import ACTIONS from "./Actions";
import "./C_Style.css";

const C_Editor = ({ socketRef, roomId, onCodeChange, initialCode }) => {
  const editorRef = useRef(null); 
  const editorContainerRef = useRef(null);
  const currentCodeRef = useRef(initialCode || ""); 

  
  useEffect(() => {
    const container = editorContainerRef.current;

    
    editorRef.current = monaco.editor.create(container, {
      value: initialCode || "",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      autoClosingBrackets: true,
    });

    editorRef.current.onDidChangeModelContent(() => {
      const code = editorRef.current.getValue();

      
      if (code !== currentCodeRef.current) {
        currentCodeRef.current = code; 
        onCodeChange(code);

       
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []); // Empty dependency ensures this runs only once

  // Handle incoming code changes via WebSocket
  useEffect(() => {
    const socket = socketRef.current;

    if (socket) {
      socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && editorRef.current) {
          const currentCode = editorRef.current.getValue();

          // Only apply changes if they are different
          if (currentCode !== code) {
            const currentPosition = editorRef.current.getPosition(); // Save the cursor position

            currentCodeRef.current = code; // Update the current code reference
            editorRef.current.executeEdits("", [
              {
                range: editorRef.current.getModel().getFullModelRange(),
                text: code,
              },
            ]);

            editorRef.current.setPosition(currentPosition); // Restore the cursor position
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef, roomId]);

  
  useEffect(() => {
    if (editorRef.current && initialCode !== currentCodeRef.current) {
      const currentPosition = editorRef.current.getPosition(); 

      editorRef.current.executeEdits("", [
        {
          range: editorRef.current.getModel().getFullModelRange(),
          text: initialCode || "",
        },
      ]);

      currentCodeRef.current = initialCode || ""; 
      editorRef.current.setPosition(currentPosition); 
    }
  }, [initialCode]);

  return <div ref={editorContainerRef} style={{ height: "100vh", width: "100%" }} />;
};

export default C_Editor;
