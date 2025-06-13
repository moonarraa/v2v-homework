# Voice-to-Voice AI Chat (OpenAI Realtime)

**Live Demo:**
- **Frontend:** [https://v2v-homework.vercel.app/](https://v2v-homework.vercel.app/)
- **Backend:** [https://v2v-homework.onrender.com](https://v2v-homework.onrender.com)

This project is a simple web app that lets you talk to an AI using your voice, and the AI responds with voice, powered by OpenAI Whisper and GPT-4o.

## Features
- Speak to the app, get real-time AI responses
- Uses OpenAI Whisper for speech-to-text
- Uses OpenAI GPT-4o for chat
- AI responses are spoken aloud using browser TTS
- Real-time communication via WebSockets

## Project Structure
- `frontend/` — React app (UI, audio recording, TTS)
- `backend/` — Node.js WebSocket server (audio transcription, OpenAI API)

## Setup

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd v2v-homework
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your OpenAI API key:
echo "OPENAI_API_KEY=sk-..." > .env
node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Make sure the backend is running on port 8080.

## Usage
- Click "Start Talking" and speak into your mic.
- The AI will respond and speak back to you.

## Notes
- Requires Node.js 20+ for backend.
- Requires a modern browser for frontend (Web Audio API, WebSockets, TTS).
- Your OpenAI API key will be billed for Whisper and GPT-4o usage.

## License
MIT 