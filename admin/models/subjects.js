import mongoose from "mongoose";
import { departments } from './departments.js'; // Adjust the path as needed
import { connectDB } from "../config/database.js";


export var branchCache = null; // Cached branch data

export async function getBranches() {
  if (branchCache) return branchCache; // Return if already fetched

  try {
    // Ensure DB is connected before fetching branches
    await connectDB();

    branchCache = await departments.distinct("branch"); // Fetch distinct branches
    console.log("Branches fetched:", branchCache);
    return branchCache;
  } catch (error) {
    console.error("Error fetching branches:", error);
    branchCache = ["NULL"]; // Fallback value
    return branchCache;
  }
}

// Lazy initialization of branchList
export var branchList = branchCache || [];

// (async () => {
//   branchList = await getBranches();
// })();
// console.log(branchList)

// (async () => {
//   branchList = 

//   console.log("branchlist " ,branchList)
// })();

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
      enum:branchCache// Set enum dynamically
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


//Function to fetch subjects from the 'subjects' collection
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
