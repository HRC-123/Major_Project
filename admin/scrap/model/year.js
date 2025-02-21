import mongoose from "mongoose";
// File Schema
const FileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fileType: {
    type: String,
    enum: ["pdf", "docx", "ppt", "txt", "xlsx", "other"],
    required: true,
  },
  fileSize: {
    type: Number, // in bytes
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  downloadLink: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
});

// Subject Schema
const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    unique: true,
    trim: true,
  },
  semester: {
    type: String,
    enum: ["Semester_1", "Semester_2"],
    required: true,
  },
  files: [FileSchema],
  branch: {
    type: String,
    enum: [
      "CSE",
      "ECE",
      "IT",
      "ME",
      "EE",
      "ICE",
      "IPE",
      "BT",
      "Chem",
      "CE",
      "MC",
      "HM",
      "Phy",
      "TT",
    ],
    required: true,
  },
});

// Semester Schema
const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Semester_1", "Semester_2"],
  },
  subjects: [SubjectSchema],
});

// Branch Schema
const BranchSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
    enum: [
      "CSE",
      "ECE",
      "IT",
      "ME",
      "EE",
      "ICE",
      "IPE",
      "BT",
      "Chem",
      "CE",
      "MC",
      "HM",
      "Phy",
      "TT",
    ],
  },
  semesters: [SemesterSchema],
});

// Year Schema
const YearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  branches: [BranchSchema],
});

// Create Models
export const File = mongoose.model("File", FileSchema);
export const Subject = mongoose.model("Subject", SubjectSchema);
export const Semester = mongoose.model("Semester", SemesterSchema);
export const Branch = mongoose.model("Branch", BranchSchema);
export const Year = mongoose.model("Year", YearSchema);

// module.exports = {
//   File,
//   Subject,
//   Semester,
//   Branch,
//   Year,
// };
