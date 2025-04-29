
export const getUsersForSidebar = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: []
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message
    });
  }
};

export const uploadChatImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};
