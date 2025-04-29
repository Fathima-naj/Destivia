// routes/clerkUser.js
import express from 'express';
import { users } from '@clerk/clerk-sdk-node'; // Correct import

const userRoute = express.Router();

userRoute.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Received userId:', userId);
  try {
    const user = await users.getUser(userId); // Correct usage of getUser
    res.json({ imageUrl: user.imageUrl });
  } catch (err) {
    console.error("Failed to fetch Clerk user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default userRoute;
