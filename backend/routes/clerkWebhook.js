import express from 'express';
import User from '../model/userModel.js';

const router = express.Router();

router.post("/webhook", async (req, res) => {
    try {
        const event = req.body;
        console.log(" Webhook Received:", event.type);
        //console.log("Webhook Payload:", JSON.stringify(event, null, 2));

        if (event.type === "user.created") {
            const clerkUserId = event.data?.id;
            const email = event.data?.email_addresses?.[0]?.email_address;
            const firstName = event.data?.firstName;
            const lastName = event.data?.lastName;

            if (!clerkUserId || !email) {
                console.error(" Missing clerkUserId or email in webhook payload.");
                return res.status(400).json({ error: "clerkUserId and email are required" });
            }

            const existingUser = await User.findOne({ clerkUserId });
            if (existingUser) {
                console.log(" User already exists:", existingUser.email);
                return res.status(200).send("User already exists");
            }

            const newUser = new User({
                clerkUserId,
                email,
                firstName,
                lastName
            });

            await newUser.save();
            console.log(" New user stored:", newUser);
            return res.status(200).send("User stored successfully");
        }

        if (event.type === "user.deleted") {
            const clerkUserId = event.data?.id;
            const deletedUser = await User.findOneAndDelete({ clerkUserId });

            if (deletedUser) {
                console.log(" User deleted from MongoDB:", deletedUser);
            } else {
                console.log(" No user found with clerkUserId:", clerkUserId);
            }

            return res.status(200).send("User deleted successfully");
        }

        res.status(400).send("Invalid webhook event type");
    } catch (error) {
        console.error(" Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
