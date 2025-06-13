require('dotenv').config();
const WebSocket = require('ws');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Load your OpenAI API key from .env file
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    try {
      // Expect message to be an audio blob (ArrayBuffer)
      const audioBuffer = Buffer.from(message);
      const tempAudioPath = path.join(__dirname, 'temp_audio.webm');
      fs.writeFileSync(tempAudioPath, audioBuffer);

      // Transcribe audio using OpenAI Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempAudioPath),
        model: 'whisper-1',
      });
      const userText = transcription.text;

      // Send user text to OpenAI Chat API (gpt-4o)
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userText },
        ],
        stream: false,
      });
      const aiText = chatResponse.choices[0].message.content;

      // Send AI's text response back to client
      ws.send(JSON.stringify({ text: aiText }));

      // Clean up temp file
      fs.unlinkSync(tempAudioPath);
    } catch (err) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080'); 