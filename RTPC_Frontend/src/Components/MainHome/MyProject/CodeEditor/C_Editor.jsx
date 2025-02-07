import React, { useEffect, useRef } from "react";

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution.js';

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
      console.log("Code get Value", code);

      if (code !== currentCodeRef.current) {
        currentCodeRef.current = code; 
        onCodeChange(code);

       
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
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
  }, []); 

  
  useEffect(() => {
    const socket = socketRef.current;

    if (socket) {
      socket.on(ACTIONS.CODE_CHANGE, ({ code, roomId: updatedRoomId }) => {
        
        if (updatedRoomId === roomId && code !== null && editorRef.current) {
          const currentCode = editorRef.current.getValue();

          if (currentCode !== code) {
            const currentPosition = editorRef.current.getPosition();

            currentCodeRef.current = code; 
            editorRef.current.executeEdits("", [
              {
                range: editorRef.current.getModel().getFullModelRange(),
                text: code,
              },
            ]);

            editorRef.current.setPosition(currentPosition); 
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
