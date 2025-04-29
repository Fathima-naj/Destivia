
import Message from "../model/messageModel.js";

const chatSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

   
    try {
      const messages = await Message.find().sort({ timestamp: -1 }).limit(100);
      socket.emit("chat_history", messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
    socket.on("send_message", async (data) => {
      try {
        console.log("Received message data:", data);
    
        // ✅ Destructure senderId from the data object
        const { senderId, text, sender,profilePic, imageUrl } = data;
    
        const newMessage = new Message({
          senderId,
          text,
          sender,
          profilePic,
          imageUrl: imageUrl || "",
          timestamp: new Date(),
        });
    
        const savedMessage = await newMessage.save();
        console.log("Message saved:", savedMessage);
    
        io.emit("receive_message", savedMessage);
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("message_error", { error: "Failed to save message" });
      }
    });
    
    

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default chatSocket;
