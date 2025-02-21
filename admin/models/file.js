import mongoose from "mongoose";

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
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

export const files = mongoose.model("files", fileSchema);
