import cloudinaryInstance from "../config/cloudinary.js";
import CustomError from '../utilis/customError.js';

// const uploadCloudinary = async (req, res, next) => {
//     if (!req.file) {
//         return next(new CustomError('Image file is required', 400));
//     }

//     try {
//         const uploadedImage = await cloudinaryInstance.uploader.upload(req.file.path, {
//             folder: 'message', // This folder will be created automatically if it doesn't exist
//         });

//         req.body.imageUrl = uploadedImage.secure_url;
//         req.body.publicId = uploadedImage.public_id;

//         next(); 
//     } catch (error) {
//         console.error(error);
//         return next(new CustomError('Image upload failed', 500));
//     }
// };

// This file is no longer needed if you're using multer-storage-cloudinary properly,
// but if you still want to keep it for clarity or future use, here's the corrected version:

const uploadCloudinary = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
      }
  
      // req.file already contains the cloudinary result
      req.body.imageUrl = req.file.path;       // secure_url
      req.body.publicId = req.file.filename;   // public_id
  
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Image upload failed' });
    }
  };
  
 
  

export default uploadCloudinary;
