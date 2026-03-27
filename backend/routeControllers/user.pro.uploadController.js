import User from "../models/userModel.js";
import { cloudinary } from "../config/cloudinary.js";

export const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // GET CURRENT USER (IMPORTANT)
    const existingUser = await User.findById(userId);

    // DELETE OLD IMAGE FROM CLOUDINARY
    if (existingUser?.profilepic) {
      try {
        const publicIdMatch = existingUser.profilepic.match(/chat-app\/profile_pictures\/(.+?)(?:\.[a-zA-Z0-9]+)?(?:$|\?)/);
        if (publicIdMatch && publicIdMatch[1]) {
          const publicId = publicIdMatch[1];
          await cloudinary.uploader.destroy(`chat-app/profile_pictures/${publicId}`);
        }
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    }

    // NEW IMAGE URL
    const imageUrl = req.file?.path || req.file?.secure_url;

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: "Upload succeeded but could not resolve image URL from multer response",
      });
    }

    // UPDATE USER
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: imageUrl },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "User update failed after image upload",
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error during upload",
    });
  }
};