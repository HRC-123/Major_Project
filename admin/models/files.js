import mongoose from "mongoose";
import { getBranches, branchCache } from "./subjects.js"; // Adjusted import from subjects.js
import { connectDB } from "../config/database.js";

// Function to fetch dynamic subjects based on year, branch, and sem
export async function getDynamicSubjects(year, branch, sem) {
  try {
    // Fetch subjects from the 'subjects' collection based on year, branch, and sem
    const subjects = await mongoose
      .model("subjects")
      .find({ year, branch, sem });

    // Map the subjects to an array of subject names (assuming 'subject' is the field name)
    const subjectNames = subjects.map((subject) => subject.subject);

      // Return the subject names for dynamic enum population
      console.log("Subject names: ",subjectNames)
    return subjectNames;
  } catch (error) {
    console.error("Error fetching dynamic subjects:", error);
    return []; // Return an empty array in case of an error
  }
}

// Define the file schema with dynamic branch and subject enums
const createFileSchema = async (year, branch, sem) => {
  // Dynamically fetch the subjects based on year, branch, and sem
  const subjectEnum = await getDynamicSubjects(year, branch, sem); // Get subjects dynamically

  const fileSchema = new mongoose.Schema({
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    branch: {
      type: String,
      required: true,
      enum: branchCache, // Dynamically populated with branchCache from subjects.js
    },
    sem: {
      type: String,
      required: true,
      enum: [
        "Semester_1",
        "Semester_2",
        "Semester_3",
        "Semester_4",
        "Semester_5",
        "Semester_6",
        "Semester_7",
        "Semester_8",
      ],
    },
    subject: {
      type: String,
      required: true,
      enum: subjectEnum, // Dynamically populated with subjects based on year, branch, and sem
    },
    fileTitle: {
      type: String,
      required: true,
    },
    fileDescription: {
      type: String,
      required: true,
    },
    fileLink: {
      type: String,
      required: true,
    },
  });

  return fileSchema;
};

// Create the file model dynamically based on year, branch, and sem
export async function createFileModel(year, branch, sem) {
  // Ensure the branches are fetched first


  // Generate the file schema with dynamic subject enums
  const fileSchema = await createFileSchema(year,branch,sem);

  // Create and return the file model based on the generated schema
  const FileModel = mongoose.model("File", fileSchema);

  return FileModel;
}
