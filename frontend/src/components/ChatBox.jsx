import { useState, useEffect } from 'react';

function ChatBox({ prompt, response }) {
  const [typedResponse, setTypedResponse] = useState('');
  const typingSpeed = 5; // Time delay for each character in milliseconds

  useEffect(() => {
    if (response) {
      let index = 0;
      const timer = setInterval(() => {
        setTypedResponse((prev) => prev + response[index]);
        index += 1;

        if (index === response.length) {
          clearInterval(timer);
        }
      }, typingSpeed);

      // Clear any previous typing effect
      return () => clearInterval(timer);
    }
  }, [response]);

  return (
    <div className="chat-box">
      <div className="prompt">
        <strong>Prompt:</strong>
        <p>{prompt}</p>
      </div>
      <div className="response">
        <strong>Response:</strong>
        <p>{typedResponse}</p>
      </div>
    </div>
  );
}

export default ChatBox;
