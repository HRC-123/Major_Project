import mongoose from "mongoose";

// Schema for individual file links
const fileLinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fileLink: {
    type: String,
    required: true, // AWS or external file URL
  },
});

// Schema for the Subject
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Subject name
  },
  code: {
    type: String,
    required: true, // Subject code
  },
  semester: {
    type: Number,
    required: true, // Semester number
  },
  branch: {
    type: String,
    required: true, // Branch name (e.g., CSE or IT)
  },
  fileLinks: [fileLinkSchema], // Array of file links related to the subject
});

export const Subject = mongoose.model("Subject", subjectSchema);
