import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor'; 
import ACTIONS from './Actions';
import './C_Style.css';

const C_Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        async function init() {
            const container = document.getElementById('realtimeEditor');
            editorRef.current = monaco.editor.create(container, {
                value: '', 
                language: 'javascript', 
                theme: 'vs-dark', 
                automaticLayout: true,
                autoClosingBrackets:true, 
                
            });

       
            editorRef.current.onDidChangeModelContent(() => {
                const code = editorRef.current.getValue();
                onCodeChange(code);
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            });
        }

        init();

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        const socket = socketRef.current;

        if (socket) {
            socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null && editorRef.current) {
                    const currentCode = editorRef.current.getValue();
                    if (currentCode !== code) {
                        editorRef.current.setValue(code);
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

    return <div id="realtimeEditor" style={{ height: '100vh', width: '100%' }}></div>;
};

export default C_Editor;
