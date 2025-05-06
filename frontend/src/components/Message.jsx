export default function Message({ sender, content }) {
    const isUser = sender === 'user';
  
    return (
      <div className="chat-message">
        <div className="avatar" style={{ backgroundColor: isUser ? '#4b5563' : '#10a37f' }} />
        <div className="message-content">
          <strong>{isUser ? 'You' : 'AI'}</strong>
          <div>{content}</div>
        </div>
      </div>
    );
  }
  