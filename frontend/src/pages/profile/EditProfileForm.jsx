import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';

const EditProfileForm = ({ user, onClose }) => {
  const [name, setName] = useState(user.username|| '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.imageUrl);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNameUpdate = async () => {
    // const nameParts = name.trim().split(" ");
    // const firstName = nameParts[0];
    // const lastName = nameParts.slice(1).join(" ") || ""; // handles single names
  
    await user.update({
      username:name.trim(),
      //lastName,
    });
  };
  

  const handleImageUpload = async () => {
    if (!imageFile) return;
    await user.setProfileImage({ file: imageFile });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Updating name...");
      await handleNameUpdate();
      console.log("Uploading image...");
      await handleImageUpload();
      console.log("Update successful!");
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
      <div className="relative w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white/95 p-8 rounded-2xl shadow-xl w-full space-y-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Edit Profile</h2>

          <div className="flex justify-center mb-6">
            <div className="relative group w-32 h-32">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-yellow-800 shadow-md"
              />
              <label htmlFor="profileImage" 
                className="absolute inset-0 bg-yellow-800/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <FaCamera className="text-white text-2xl" />
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-yellow-800 focus:border-transparent transition-all duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-800 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
