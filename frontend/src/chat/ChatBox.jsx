import { useState, useEffect, useRef } from 'react';
import { socket } from './socket';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    
    socket.on("chat_history", (history) => {
      console.log('Received chat history:', history);
      setMessages(history);
      scrollToBottom();
    });

    
    socket.on("receive_message", (message) => {
      console.log('Received new message:', message);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

   
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    
    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className="p-4 h-[70vh] overflow-y-auto border rounded bg-white shadow-sm">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className="mb-3 p-2 rounded hover:bg-gray-50">
            <strong className="text-yellow-800">{msg.sender || "Anonymous"}: </strong>
            <span className="text-gray-700">{msg.text}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No messages yet</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBox;
