import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected");
    } 
    catch (error) {
        console.error("Database connection failed: ",error.message);
        exit(1);
    }
};

export default connectDB;