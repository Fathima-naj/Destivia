
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