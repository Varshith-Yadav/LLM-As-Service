import { useState } from 'react';

export default function InputBox({ prompt, setPrompt, onGenerate, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="input-area">
      <div className="input-box-wrapper">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          disabled={loading}
        />
        <button onClick={onGenerate} disabled={loading || !prompt.trim()}>
          {loading ? '...' : '→'}
        </button>
      </div>
    </div>
  );
}
