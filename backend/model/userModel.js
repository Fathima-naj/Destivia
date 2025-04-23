import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        unique: true,
        required: true
    },
    email: String,
    //username:String
    firstName: String,
    lastName: String
});

const User = mongoose.model("User", userSchema);

export default User;
