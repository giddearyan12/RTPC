import React, { useEffect, useRef } from "react";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution";
import "monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution";
import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution";
import "monaco-editor/esm/vs/language/json/monaco.contribution.js";

import ACTIONS from "./Actions";
import "./C_Style.css";

const C_Editor = ({ socketRef, roomId, onCodeChange, initialCode, username }) => {
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
        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
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

      socket.emit(ACTIONS.REQUEST_LATEST_CODE, { roomId });

      socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          console.log('Hello')
        const editor = editorRef.current;
        const cursor = editor.getPosition();

        editor.executeEdits("", [
          {
            range: editor.getModel().getFullModelRange(),
            text: code,
          },
        ]);

        editor.setPosition(cursor);
        currentCodeRef.current = code;
      }
      });

  socket.on(ACTIONS.SEND_LATEST_CODE, ({ latestCode }) => {
    if (latestCode && latestCode !== currentCodeRef.current) {
      editorRef.current.setValue(latestCode);
      currentCodeRef.current = latestCode;
    }
  });
}

return () => {
  if (socket) {
    socket.off(ACTIONS.CODE_CHANGE);
    socket.off(ACTIONS.SEND_LATEST_CODE);
  }
};
  }, [socketRef.current]);

return (
  <div ref={editorContainerRef} style={{ height: "100vh", width: "100%" }} />
);
};

export default C_Editor;
