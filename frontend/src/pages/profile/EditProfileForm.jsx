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
    <div className="bg-black bg-opacity-30 fixed inset-0 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-96 space-y-5">
        <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>

        <div className="flex justify-center">
          <div className="relative group w-24 h-24">
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <label htmlFor="profileImage" className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <FaCamera className="text-white text-lg" />
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="text-gray-500">Cancel</button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
