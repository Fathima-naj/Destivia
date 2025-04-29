import upload from "../middleware/uploadMiddleware.js";
import uploadCloudinary from "../middleware/uploadCloudinary.js";
import express from'express'
import { uploadChatImage } from "../controller/chatController.js";
const chatRouter=express.Router()

chatRouter.post('/upload-image',upload.single('file'),uploadChatImage)

export default chatRouter