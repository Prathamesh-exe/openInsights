import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';

const ChatWindow = ({ onClose, tables, darkMode }) => {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hello! I'm your data assistant. Ask me anything about the analytics."
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.answer 
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <h2 className="font-semibold text-lg">Ask Insights</h2>
        <button
          onClick={onClose}
          className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-3 max-w-[90%] whitespace-pre-wrap ${
              msg.role === "user"
                ? darkMode 
                  ? "bg-blue-700 ml-auto" 
                  : "bg-blue-100 ml-auto"
                : darkMode 
                  ? "bg-gray-700" 
                  : "bg-gray-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className={`rounded-lg p-3 max-w-[90%] ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        {error && (
          <div className={`text-sm p-2 ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
            Error: {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <textarea
          rows={2}
          className={`w-full resize-none p-3 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'border-gray-300 bg-white'
          }`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the data..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className={`mt-2 w-full py-2 rounded-lg transition-colors ${
            loading || !input.trim()
              ? darkMode 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-gray-400 cursor-not-allowed"
              : darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
  tables: PropTypes.array.isRequired,
  darkMode: PropTypes.bool.isRequired
};

export default ChatWindow;