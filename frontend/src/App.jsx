import { useState } from 'react';
import './App.css';
import InputBox from './components/InputBox';
import ChatBox from './components/ChatBox';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const formattedPrompt = `
${prompt}

---
Please format the response in two parts:
1. Explanation in simple words with real-world examples.
2. Mathematical formulas, derivations, and key equations.
---`;

      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: formattedPrompt, model: 'gemma:2b' }),  // Updated to gemma:2b
      });

      const data = await res.json();
      console.log(data);
      setResponse(data.response || 'No response received from model.');
    } catch (err) {
      console.error(err);
      setResponse('Error generating response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app chatgpt-theme">
      <div className="sidebar">
        <h2>CogniVerse</h2>

        {/* Removed model selector */}
        <div className="model-info">
          <p><strong>Model:</strong> Gemma 2B</p> {/* Updated model name */}
        </div>

        <div className="footer">
          <span className="status-dot" /> LLM Online
          <p className="indices">62 indices</p>
        </div>
      </div>

      <div className="chat-container">
        <ChatBox prompt={prompt} response={response} />
        <InputBox
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
