import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileLinks: [
    {
      awsLink: { type: String, required: true },
    },
  ],
});

export const File = mongoose.model("File", fileSchema);
