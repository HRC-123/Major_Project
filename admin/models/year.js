import mongoose from "mongoose";
// Year Schema
const YearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4],
    unique: true,
  },
  branches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
  ],
});

// Branch Schema
const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  semesters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
  ],
});

// Semester Schema
const SemesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        // Validate semester number based on year
        const year = this.year;
        return value === 2 * year - 1 || value === 2 * year;
      },
      message: "Invalid semester number for the given year",
    },
  },
  year: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4],
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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
    required: true,
    unique: true,
  },
  files: [
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      fileLink: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Create models
export const Year = mongoose.model("Year", YearSchema);
export const Branch = mongoose.model("Branch", BranchSchema);
export const Semester = mongoose.model("Semester", SemesterSchema);
export const Subject = mongoose.model("Subject", SubjectSchema);
 
// Export models for use in other files
// module.exports = {
//   Year,
//   Branch,
//   Semester,
//   Subject,
// };

// Example of creating and populating data
async function createEducationalStructure() {
  try {
    // Create Years
    const year1 = new Year({ year: 1 });
    await year1.save();

    // Create Branches
    const csBranch = new Branch({
      name: "Computer Science",
      semesters: [],
    });
    await csBranch.save();

    // Create Semesters
    const semester1 = new Semester({
      number: 1,
      year: 1,
      subjects: [],
    });
    await semester1.save();

    // Create Subjects
    const mathSubject = new Subject({
      name: "Mathematics",
      code: "MATH101",
      files: [
        {
          title: "Calculus Basics",
          description: "Introductory calculus notes",
          fileLink: "https://example.com/calculus-notes.pdf",
        },
      ],
    });
    await mathSubject.save();

    // Link everything together
    year1.branches.push(csBranch._id);
    csBranch.semesters.push(semester1._id);
    semester1.subjects.push(mathSubject._id);

    await year1.save();
    await csBranch.save();
    await semester1.save();
  } catch (error) {
    console.error("Error creating educational structure:", error);
  }
}



// module.exports = {
//   Year,
//   Branch,
//   Semester,
//   Subject,
//   createEducationalStructure,
//   setupAdminBro,
// };
