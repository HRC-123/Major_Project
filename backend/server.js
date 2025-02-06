require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

// Multer Setup for File Upload
const storage = multer.memoryStorage(); // Store file in memory before upload
const upload = multer({ storage: storage });

// Upload File Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { year, branch, semester, subject, type, author, title, description } = req.body;
    const file = req.file;

    if (!file || !year || !branch || !subject || !type || !author || !title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Construct File Path
    const filePath = `${year}/${branch}/${subject}/${type}/${file.originalname}`;

    // Upload File to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(process.env.REACT_APP_SUPABASE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: "File upload failed" });
    }

    // Generate Public URL
    const publicURL = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/${uploadData.fullPath}`;

    // Insert Metadata into Database
    const { error: insertError } = await supabase.from("documents").insert([
      {
        url: publicURL,
        year,
        branch,
        semester,
        subject,
        type,
        author,
        title,
        description,
        upvote: 0,
        downvote: 0,
      },
    ]);

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({ error: "Failed to save metadata" });
    }

    res.status(200).json({ message: "File uploaded successfully", url: publicURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// API to fetch files
app.get("/api/files", async (req, res) => {
    try {
      const { year, branch, subject, type } = req.query;
  
      if (!year || !branch || !subject || !type) {
        return res.status(400).json({ error: "Missing query parameters" });
      }
      const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("year", year)
      .eq("branch", branch)
      .eq("subject", subject)
      .eq("type", type);
      
      if (error) throw error;
    
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // API to increment upvote count
app.post("/api/upvote", async (req, res) => {
    const { title,count } = req.body;
    console.log(title)
    try {
      const { data, error } = await supabase
        .from("documents")
        .update({ upvote: count }) // Direct increment
        .eq("title", title)
        .select();
        console.log(data)
      if (error) throw error;
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // API to increment downvote count
  app.post("/api/downvote", async (req, res) => {
    const { url,count } = req.body;
  
    try {
      const { data, error } = await supabase
        .from("documents")
        .update({ downvote: count }) // Direct increment
        .eq("url", url);
  
      if (error) throw error;
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
