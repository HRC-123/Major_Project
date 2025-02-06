import mongoose from "mongoose";
import { departments } from './departments.js'; // Adjust the path as needed

// Fetch the available branches from the 'departments' collection
export async function getBranches() {
  const branches = await departments.find().select('branch').lean(); // Fetch the branch names
  return branches.map(dept => dept.branch); // Extract the branch names into an array
}

export const branchList = await getBranches(); // Get the branches from the database

// Use async to create the schema once the branches are fetched
const createSubSchema = async () => {


  const subSchema = new mongoose.Schema({
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    branch: {
      type: String,
      required: true,
      enum: branchList, // Set enum dynamically
    },
    sem: {
      type: String,
        required: true,
      enum:[
              "Semester_1",
              "Semester_2",
              "Semester_3",
              "Semester_4",
              "Semester_5",
              "Semester_6",
              "Semester_7",
              "Semester_8",
            ]
    },
    subject: {
      type: String,
      required: true,
    },
  });

  return mongoose.model('subjects', subSchema);
};

export default createSubSchema;


// Function to fetch subjects from the 'subjects' collection
// export async function getSubjects({ year, branch, sem } = {}) {
//   const SubModel = await createSubSchema(); // Get the 'subjects' model

//   try {
//     // Build the filter object dynamically
//     const filter = {};
//     if (year) filter.year = year; // Add year filter if provided
//     if (branch) filter.branch = branch; // Add branch filter if provided
//     if (sem) filter.sem = sem; // Add sem filter if provided

//     // Query to fetch subjects based on the filter
//     const subjects = await SubModel.find(filter).lean();

//     // Ensure subjects is always an array
//     return Array.isArray(subjects) ? subjects : []; // Return subjects or an empty array if no subjects
//   } catch (error) {
//     console.error("Error fetching subjects:", error);
//     throw error; // Throw error if something goes wrong
//   }
// }
