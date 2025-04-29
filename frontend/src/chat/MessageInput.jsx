import { useState } from 'react';
import { socket } from './socket';

const MessageInput = ({ sender }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    console.log('Sending message:', { text, sender });
    socket.emit("send_message", {
      text: text.trim(),
      sender: sender || "Anonymous"
    });

    setText("");
  };

  return (
    <div className="flex gap-2 p-2">
      <input
        type="text"
        className="border flex-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-800"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
      />
      <button 
        onClick={handleSend}
        className="bg-yellow-800 text-white px-4 py-2 rounded hover:bg-yellow-700"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
