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


//Get Branch Data
app.get("/branches", async( req, res)=>{
  const { data, error } = await supabase.from('departments').select('*');
  if (error) {
    res.status(500).json({ error: error.message });
  } else {
  res.json(data);
  }

})

// Get Subjects Data
app.get("/subjects", async (req, res) => {
  const { year, branch, sem } = req.query; // Get query parameters

  let query = supabase.from("subjects").select("*");

  if (year) query = query.eq("year", year);
  if (branch) query = query.eq("branch", branch);
  if (sem) query = query.eq("sem", sem);

  const { data, error } = await query;
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


// Upload File Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { year, branch, semester, subject, subjectcode, type, author,authorEmail, title, description, fileUrl, examYear, examType } = req.body;
    const file = req.file;

    if ((!file && !fileUrl) || !year || !branch || !semester || !subject || !subjectcode || !type || !author || !authorEmail || !title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for required fields if type is PreviousYearPapers
    if (type === "PreviousYearPapers" && (!examYear || !examType)) {
      return res.status(400).json({ error: "Exam year and type are required for previous year papers" });
    }

    let publicURL = fileUrl;
    let formattedTitle = title;

    // Format title for PreviousYearPapers
    if (type === "PreviousYearPapers") {
      formattedTitle = `${subjectcode}_${examYear}_${examType}_${title}`;
    }

    if (file) {
      // Create unique file path
      let filePath;
      
      if (type === "PreviousYearPapers") {
        // For previous year papers, include exam year and type in the path
        filePath = `${year}/${branch}/${subject}/${type}/${examYear}_${examType}/${Date.now()}_${file.originalname}`;
      } else {
        filePath = `${year}/${branch}/${subject}/${type}/${Date.now()}_${file.originalname}`;
      }

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
      publicURL = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/${uploadData.fullPath}`;
    }

    // Prepare document data
    const documentData = {
      url: publicURL,
      year,
      branch,
      semester,
      subject,
      subjectcode,
      type,
      author,
      authorEmail,
      title: formattedTitle, // Use the formatted title
      description,
      upvote: [],
      downvote: [],
      savedUsers: [],
    };
    console.log(formattedTitle);
    // Insert metadata into Supabase Database
    const { data, error: insertError } = await supabase.from("documents").insert([documentData]);

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({ error: "Failed to save metadata" });
    }

    res.status(200).json({ 
      message: "File uploaded successfully", 
      url: publicURL,
      title: formattedTitle // Return the formatted title to the client
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/report", async (req, res) => {
  try {
    const {
      title,
      author,
      authorEmail,
      type,
      year,
      semester,
      branch,
      subject,
      subjectcode,
      description,
      url, // even if it's hidden, it'll be submitted
      reporterEmail,
      reporterName,
      reportReason,
    } = req.body;

    console.log(req.body)

    // Check for required fields
    if (
      !title ||
      !author ||
      !authorEmail ||
      !type ||
      !year ||
      !semester ||
      !branch ||
      !subject ||
      !subjectcode ||
      !description ||
      !url ||
      !reporterEmail ||
      !reporterName ||
      !reportReason
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields in report" });
    }

    // Insert into Supabase reports table
    const { data, error } = await supabase.from("reports").insert([
      {
        title,
        author,
        authorEmail,
        type,
        year,
        semester,
        branch,
        subject,
        subjectcode,
        description,
        url,
        reporter_email: reporterEmail,
        reporter_name: reporterName,
        reason: reportReason,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Insert report error:", error);
      return res.status(500).json({ error: "Failed to submit report" });
    }

    res.status(200).json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


// searching files
app.get("/search", async (req, res) => {
  try {
    const { query } = req.query; // Get search query from frontend

    if (!query) { return res.status(400).json({ error: "Search query is required" });}
    // Search in title, subject, or subjectcode
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .or(
        `title.ilike.%${query}%,subject.ilike.%${query}%,subjectcode.ilike.%${query}%`
      );
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch search results" });
    }
    res.status(200).json(data); // Send results to frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// API to fetch files
app.get("/api/files", async (req, res) => {
    try {
      const { year, branch, subject, type } = req.query;

      if (year == 'all') {
         const { data, error } = await supabase
           .from("documents")
           .select("*")
         if (error) throw error;

         res.json(data);
      }
      else {
  
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
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
app.get("/api/uploadedfiles", async (req, res) => {
  try {
    const { name, email,option } = req.query;

    // If name and email are provided, filter by those only
    if (name && email && option) {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("author", name)
        .eq("authorEmail", email)
        .eq("type", option);
        

      if (error) throw error;
      return res.json(data);
    }

   
    // Standard filtering if specific query parameters are provided
    if (!name || !email) {
      return res.status(400).json({ error: "Missing query parameters" });
    }

 

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch saved resources
app.get("/api/savedFiles", async (req, res) => {
  try {
    const { user, type } = req.query;

      if (!user || !type) {
        return res.status(400).json({ error: "Missing query parameters" });
      }
      const { data, error } = await supabase
      .from("documents")
      .select("*")
      .contains("savedUsers", [user])  // checks if array contains the email
      .eq("type", type);
    
      if (error) throw error;
  
      res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to handle upvotes
app.post("/api/upvote", async (req, res) => {
  const { title, email } = req.body;
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("upvote, downvote")
      .eq("title", title)
      .maybeSingle(); // Use maybeSingle() to avoid the error

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Document not found" });

    let upvotes = data.upvote || [];
    let downvotes = data.downvote || [];

    if (downvotes.includes(email)) {
      downvotes = downvotes.filter((e) => e !== email);
    }
    if (!upvotes.includes(email)) {
      upvotes.push(email);
    }

    const { error: updateError } = await supabase
      .from("documents")
      .update({ upvote: upvotes, downvote: downvotes })
      .eq("title", title)
      .select(); // Ensure we return updated values

    if (updateError) throw updateError;

    res.json({
      success: true,
      upvoteCount: upvotes.length,
      downvoteCount: downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/bookmark", async (req, res) => {
  const { title, email } = req.body;
  
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("savedUsers")
      .eq("title", title)
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Document not found" });
    
    let savedUsers = data.savedUsers || [];
    let isBookmarked = false;
    
    if (savedUsers.includes(email)) {
      // Remove bookmark if already bookmarked
      savedUsers = savedUsers.filter((e) => e !== email);
      isBookmarked = false;
    } else {
      // Add bookmark if not already bookmarked
      savedUsers.push(email);
      isBookmarked = true;
    }
    
    const { error: updateError } = await supabase
      .from("documents")
      .update({ savedUsers: savedUsers })
      .eq("title", title)
      .select();
      
    if (updateError) throw updateError;
    
    res.json({
      success: true,
      isBookmarked: isBookmarked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/downvote", async (req, res) => {
  const { title, email } = req.body;
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("upvote, downvote")
      .eq("title", title)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Document not found" });

    let upvotes = data.upvote || [];
    let downvotes = data.downvote || [];

    if (upvotes.includes(email)) {
      upvotes = upvotes.filter((e) => e !== email);
    }
    if (!downvotes.includes(email)) {
      downvotes.push(email);
    }

    const { error: updateError } = await supabase
      .from("documents")
      .update({ upvote: upvotes, downvote: downvotes })
      .eq("title", title)
      .select();

    if (updateError) throw updateError;

    res.json({
      success: true,
      upvoteCount: upvotes.length,
      downvoteCount: downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/edit-resource', async (req, res) => {
  try {
    const { originalTitle, authorEmail, ...updatedFields } = req.body;
    console.log("1")
    if (!originalTitle || !authorEmail) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Fetch existing resource by title and authorEmail
    const { data: existingResource, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('title', originalTitle)
      .eq('authorEmail', authorEmail)
      .single();

    if (fetchError) {
      console.error(fetchError);
      return res.status(500).json({ error: 'Failed to fetch resource.' });
    }

    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    // Compare and detect changes
    const changes = {};
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] !== existingResource[key]) {
        changes[key] = { from: existingResource[key], to: updatedFields[key] };
      }
    });

    if (Object.keys(changes).length === 0) {
      return res.status(200).json({ message: 'No changes detected.' });
    }

    // Update only the changed fields
    const { error: updateError } = await supabase
      .from('documents')
      .update(updatedFields)
      .eq('title', originalTitle)
      .eq('authorEmail', authorEmail);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ error: 'Failed to update resource.' });
    }

    console.log(`Resource updated: ${originalTitle}`);
    console.log('Changes:', changes);

    res.status(200).json({
      message: 'Resource updated successfully.',
      changes,
    });

  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



app.delete("/api/delete-resource", async (req, res) => {
  try {
    const { url, authorEmail } = req.body;
    console.log(url);
    console.log(authorEmail);
    if (!url || !authorEmail) {
      return res.status(400).json({ error: "URL and author email are required" });
    }

    // Find the document by URL and authorEmail
    const { data: existingData, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("url", url)
      .eq("authorEmail", authorEmail)
      .single();

      console.log(existingData)
    if (fetchError || !existingData) {
      console.error(fetchError);
      return res.status(404).json({ error: "Resource not found or you don't have permission to delete it" });
    }

    // Check if URL contains 'supabase' and delete the file from storage if it does
    if (existingData.url.includes("supabase")) {
      const fileUrlParts = existingData.url.split('/');
      const filePath = fileUrlParts.slice(fileUrlParts.indexOf('public') + 2).join('/');
      console.log(filePath)
      if (filePath) {
        const { error: deleteStorageError } = await supabase.storage
          .from(process.env.REACT_APP_SUPABASE_BUCKET)
          .remove([filePath]);

        if (deleteStorageError) {
          console.warn("Could not delete file from storage:", deleteStorageError);
          // Optional: you could choose to return an error here if storage deletion is critical
        }
      }
    }

    // Delete the record from documents table
    const { error: deleteDbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', existingData.id);

    if (deleteDbError) {
      console.error(deleteDbError);
      return res.status(500).json({ error: "Failed to delete resource from database" });
    }

    res.status(200).json({ message: "Resource deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/save-user", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Missing user details" });
  }

  try {
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id") // only select id to reduce data
      .eq("email", email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!existingUser) {
      // Insert if not exists
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ email, name }]);

      if (insertError) throw insertError;
    }

    res.json({ success: true, message: "User saved or already exists" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/user-count", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true }); // Only count, no data

    if (error) throw error;

    res.json({ userCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/subject-count", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("subjects")
      .select("*", { count: "exact", head: true }); // Only count, no data

    if (error) throw error;

    res.json({ subjectCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
