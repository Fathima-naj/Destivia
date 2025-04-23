import express from  'express';
import {fetchHotelById, getHotels} from "../controller/hotelController.js"
import { getHotelImages } from '../service/hotelImageService.js';

const hotelRouter=express.Router();
hotelRouter.get('/search',getHotels)
hotelRouter.get('/image',getHotelImages)
 hotelRouter.get('/:hotelId',fetchHotelById)
export default hotelRouter;