import express from "express"
import {  getPlaceById, searchPlaceByCity } from "../controller/placeController.js"

const placeRoute=express.Router()
placeRoute.get('/search',searchPlaceByCity)
placeRoute.get('/:id',getPlaceById)
export default placeRoute