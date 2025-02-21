import mongoose from "mongoose";
// File Schema - Stores file details for each subject
const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileDescription: { type: String },
  fileLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Subject Schema - Each subject can have multiple files
const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  files: [{ type: fileSchema }], // Embedding the file schema directly inside the subject
});

// Semester Schema - Each semester contains multiple subjects
const semesterSchema = new mongoose.Schema({
  semesterName: { type: String, required: true },
  subjects: [{ type: subjectSchema }], // Embedding the subject schema directly inside the semester
});

// Branch Schema - Each branch has multiple semesters
const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  semesters: [{ type: semesterSchema }], // Embedding the semester schema directly inside the branch
});

// Year Schema - Each year contains multiple branches
const yearSchema = new mongoose.Schema({
  yearNumber: { type: Number, required: true },
  branches: [{ type: branchSchema }], // Embedding the branch schema directly inside the year
});

// Creating the Mongoose model for Year, which will include everything
export const Year = mongoose.model("Year", yearSchema);


