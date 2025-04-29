import multer from 'multer';
import {CloudinaryStorage} from'multer-storage-cloudinary';
import cloudinaryInstance from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary:cloudinaryInstance,
    params: {
        folder: 'message',  
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] 

    }
});

const upload = multer({ storage });

export default upload
