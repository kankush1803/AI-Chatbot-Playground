import { useState, useRef, useEffect } from 'react';
import './index.css';

const SYSTEM_PROMPT = "You are a helpful AI assistant.";

function App() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', type: 'text', content: 'Hello! I am your AI Chatbot Playground. You can chat with me or ask me to generate an image! How can I help you today?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' or 'image'
  const [theme, setTheme] = useState('light');
  const chatHistoryRef = useRef(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const clearChat = () => {
    setMessages([
      { id: Date.now(), role: 'bot', type: 'text', content: 'Chat cleared. How can I help?' }
    ]);
  };

  const queryAI = async (userText) => {
    try {
      const apiKey = import.meta.env.VITE_HF_API_TOKEN;
      if (!apiKey || apiKey.includes('your_')) {
        throw new Error("Missing Hugging Face API Token in .env file");
      }
      
      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.2-1B-Instruct:novita',
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.filter(m => m.type === 'text').map(m => ({
              role: m.role === 'bot' ? 'assistant' : 'user',
              content: m.content
            })),
            { role: "user", content: userText }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response received.";
    } catch (err) {
      console.error(err);
      return `Error: ${err.message}`;
    }
  };

  const generateImage = async (promptText) => {
    try {
      const hfToken = import.meta.env.VITE_HF_API_TOKEN;
      if (!hfToken || hfToken.includes('your_')) {
        throw new Error("Missing Hugging Face API Token in .env file");
      }

      const response = await fetch('https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: promptText })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSend = async () => {
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    setInputVal('');
    
    // Add User Message
    const userMsg = { id: Date.now(), role: 'user', type: 'text', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    if (mode === 'chat') {
      const botReply = await queryAI(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', type: 'text', content: botReply }]);
    } else {
      try {
        const imageUrl = await generateImage(userText);
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', type: 'image', content: imageUrl }]);
      } catch (err) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', type: 'text', content: `Failed to generate image: ${err.message}` }]);
      }
    }
    
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = (e) => {
    setInputVal(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <div className="header-title-container">
          <span className="header-icon">🤖</span>
          <h1>AI Chatbot Playground</h1>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={clearChat} title="Clear Chat">
            🗑️
          </button>
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.role}`}>
            {msg.type === 'text' ? (
              <div className="message-bubble">{msg.content}</div>
            ) : (
              <img src={msg.content} alt="AI Generated" className="message-image" />
            )}
            <span className="message-time">
              {msg.role === 'bot' ? 'AI Assistant' : 'You'}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator-wrapper">
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="mode-toggles">
          <button 
            className={`mode-btn ${mode === 'chat' ? 'active' : ''}`}
            onClick={() => setMode('chat')}
          >
            💬 Chat Mode
          </button>
          <button 
            className={`mode-btn ${mode === 'image' ? 'active' : ''}`}
            onClick={() => setMode('image')}
          >
            🎨 Image Mode
          </button>
        </div>
        
        <div className="input-container">
          <textarea
            value={inputVal}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'chat' ? "Type a message..." : "Describe an image to generate..."}
            disabled={isLoading}
            rows={1}
            style={{ overflowY: 'auto' }}
          />
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!inputVal.trim() || isLoading}
            title="Send"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
