import { useState } from 'react';
import { socket } from './socket';
import axiosInstance from '../api/axiosInstance';
import { Send, Camera, Smile } from 'lucide-react';
import Picker from 'emoji-picker-react';

const MessageInput = ({ sender, senderId, profilePic }) => {
  const [text, setText] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (!text.trim() && !uploadedImageUrl) return;

    socket.emit("send_message", {
      text: text.trim(),
      senderId: senderId || 'unknown',
      sender: sender || "Anonymous",
      profilePic: profilePic || '',
      imageUrl: uploadedImageUrl,
    });

    setText("");
    setUploadedImageUrl("");
    setUploadError("");
    setShowEmojiPicker(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/chat/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="relative flex flex-col gap-2 p-4 border-t bg-white">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="border flex-1 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={isUploading}
        />

        {/* Emoji Picker Toggle */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          <Smile className="w-5 h-5 text-gray-600" />
        </button>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          <Camera className="w-5 h-5 text-gray-600" />
        </label>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className={`p-2 rounded-md ${
            isUploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition`}
          disabled={isUploading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-2 z-50">
          <Picker onEmojiClick={onEmojiClick} theme="light" />
        </div>
      )}

      {/* Image Preview */}
      {uploadedImageUrl && (
        <div className="flex items-center gap-2 mt-2">
          <img src={uploadedImageUrl} alt="preview" className="w-20 h-20 object-cover rounded-md" />
          <button
            onClick={() => setUploadedImageUrl("")}
            className="text-red-500 hover:underline text-sm"
          >
            Remove
          </button>
        </div>
      )}

      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
    </div>
  );
};

export default MessageInput;
