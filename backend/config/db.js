import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to mongodb')
    } catch (error) {
        console.log('connection err',error)
        process.exit(1)
    }
}
export default connectDB