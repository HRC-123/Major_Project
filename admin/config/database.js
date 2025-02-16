// config/database.js
import mongoose from "mongoose";
import dotenv from "dotenv";
// MongoDB connection string
dotenv.config();
const dbURI = process.env.DATABASE_CONNECTION;

export const connectDB = async () => {
    try {
        console.log("connecting");
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:" + error);
    }
};
