
import User from "../model/userModel.js";

const clerkWebhookHandler = async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log("Received Clerk user data:", data);

    console.log(" Webhook event received:", type);

    if (type === "user.created") {
      const {
        id: clerkUserId,
        username,
        firstName,
        lastName,
        email_addresses,
        image_url,
      } = data;

      const email = email_addresses?.[0]?.email_address || "no-email";

      const existingUser = await User.findOne({ clerkUserId });

      if (!existingUser) {
        await User.create({
          clerkUserId,
          username,
          firstName,
          lastName,
          email,
          imageUrl: image_url,
          role: "user",
        });

        console.log(` New user created: ${email}`);
      } else {
        console.log(` User already exists: ${email}`);
      }
    }

    res.status(200).send("Webhook received successfully");
  } catch (error) {
    console.error("Webhook handler error:", error.message);
    res.status(200).send("Webhook error handled gracefully");
  }
};

export default clerkWebhookHandler;
