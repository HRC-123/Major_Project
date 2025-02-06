const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const bucketName = process.env.SUPABASE_BUCKET;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const { year, branch, subject, type } = req.body;
    if (!file || !year || !branch || !subject || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const filePath = `${year}/${branch}/${subject}/${type}/${file.originalname}`;
    const { error } = await supabase.storage.from(bucketName).upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

    if (error) throw error;
    res.json({ message: "File uploaded successfully", filePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/files", async (req, res) => {
  try {
    const { data, error } = await supabase.storage.from(bucketName).list("");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});