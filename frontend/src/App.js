import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const mediaRecorderRef = useRef(null);
  const wsRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Connect to WebSocket server
  const connectWebSocket = () => {
    if (!wsRef.current || wsRef.current.readyState !== 1) {
      wsRef.current = new window.WebSocket('ws://localhost:8080');
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.text) {
          setAiResponse(data.text);
          // Speak the AI response
          const utterance = new window.SpeechSynthesisUtterance(data.text);
          window.speechSynthesis.speak(utterance);
        }
        if (data.error) {
          setAiResponse('Error: ' + data.error);
        }
      };
    }
  };

  // Start recording audio
  const startRecording = async () => {
    connectWebSocket();
    setTranscript('');
    setAiResponse('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream);
    audioChunksRef.current = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      // Send audio blob to backend via WebSocket
      audioBlob.arrayBuffer().then((buffer) => {
        if (wsRef.current && wsRef.current.readyState === 1) {
          wsRef.current.send(buffer);
        }
      });
    };
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Voice-to-Voice Chat (OpenAI Realtime)</h2>
        <button onClick={recording ? stopRecording : startRecording}>
          {recording ? 'Stop Recording' : 'Start Talking'}
        </button>
        <div style={{ marginTop: 20 }}>
          <strong>AI Response:</strong>
          <div style={{ marginTop: 10, minHeight: 40 }}>{aiResponse}</div>
        </div>
      </header>
    </div>
  );
}

export default App;
