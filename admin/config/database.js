// config/database.js
import mongoose from "mongoose";

// MongoDB connection string
const dbURI =
  "mongodb+srv://ramcharan2k4:pIYWLAcyUxgOGuD0@majorproject.zo9wo.mongodb.net/test?retryWrites=true&w=majority&appName=MajorProject";

export const connectDB = async () => {
    try {
        console.log("connecting");
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:");
    }
};
