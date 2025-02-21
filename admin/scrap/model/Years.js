import mongoose from "mongoose";
// Schema for Courses

// Course Schema
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Semester Schema
const semesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [courseSchema],
});

// Branch Schema
const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semesters: [semesterSchema],
});

// Year Schema
const yearSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  branches: [branchSchema],
});

// Main Academic Schema
const academicSchema = new mongoose.Schema({
  years: [yearSchema],
});

export const Academic = mongoose.model("Academic", academicSchema);

