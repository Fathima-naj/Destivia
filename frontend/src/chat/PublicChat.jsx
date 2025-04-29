import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import ChatBox from './ChatBox';
import MessageInput from './MessageInput';
import { socket } from './socket';

function PublicChat() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Manually connect to socket
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in to chat</div>;

  const username = user.username || user.firstName || user.emailAddresses[0].emailAddress;
  const id=user?.id||"unknown"
  const profile=user?.imageUrl||''
  console.log(user)
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Public Chat</h1>
      <ChatBox />
      <MessageInput sender={username} senderId={id} profilePic={profile}/>
    </div>
  );
}

export default PublicChat;
