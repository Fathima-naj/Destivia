import express from "express"
import Flight from "../model/flightModel.js"
const popRoute=express.Router()
popRoute.get('/popularFlight', async (req, res) => {
    try {
      const flights = await Flight.aggregate([{ $sample: { size: 5 } }]); 
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch popular flights' });
    }
  });
  

  export default popRoute