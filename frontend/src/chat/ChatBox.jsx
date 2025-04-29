import { useState, useEffect, useRef } from 'react';
import { socket } from './socket';
import { useUser } from '@clerk/clerk-react';
import dayjs from 'dayjs';
import axiosInstance from '../api/axiosInstance';

const ChatBox = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [userImages, setUserImages] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchAndCacheUserImage = async (userId) => {
    if (userImages[userId]) return;

    try {
      const res = await axiosInstance.get(`/user/${userId}`);
      const data = res.data;
      if (data?.imageUrl) {
        setUserImages(prev => ({ ...prev, [userId]: data.imageUrl }));
      }
    } catch (err) {
      console.error("Error fetching user image:", err);
    }
  };

  useEffect(() => {
    socket.on("chat_history", async (history) => {
      const senderIds = [...new Set(history.map(msg => msg.senderId))];
      await Promise.all(senderIds.map(fetchAndCacheUserImage));
      setMessages(history.reverse());
    });

    socket.on("receive_message", async (message) => {
      if (message.senderId) {
        await fetchAndCacheUserImage(message.senderId);
      }
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) {
    return <div className="text-center py-10 text-gray-600">Loading user data...</div>;
  }

  return (
    <div className="p-4 h-[70vh] overflow-y-auto border rounded-lg bg-gray-50 shadow-inner">
    {messages.length > 0 ? (
      messages.map((msg, index) => {
        const isCurrentUser = user.id === msg.senderId;
        const messageTime = msg.timestamp
          ? dayjs(msg.timestamp).format("hh:mm A")
          : null;
        const profileImage = userImages[msg.senderId] || "/default-avatar.png";
  
        return (
          <div
            key={index}
            className={`mb-6 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            {!isCurrentUser && (
              <img
                src={profileImage}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover mr-3 shadow-md"
              />
            )}
            <div
              className={`max-w-md px-4 py-2 rounded-xl border shadow-sm ${
                isCurrentUser
                  ? "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm text-gray-800">
                  {msg.sender || "Anonymous"}
                </span>
                {messageTime && (
                  <span className="text-xs text-gray-500 ml-2">{messageTime}</span>
                )}
              </div>
              {msg.text && <p className="text-gray-800">{msg.text}</p>}
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="sent"
                  className="mt-2 max-w-xs rounded-lg shadow"
                />
              )}
            </div>
            {isCurrentUser && (
              <img
                src={user?.imageUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover ml-3 shadow-md"
              />
            )}
          </div>
        );
      })
    ) : (
      <div className="text-center text-gray-400 text-sm mt-10">No messages yet</div>
    )}
    <div ref={messagesEndRef} />
  </div>
  
  );
};

export default ChatBox;
