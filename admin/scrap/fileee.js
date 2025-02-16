// import mongoose from "mongoose";
// import { branchList,branchCache,getBranches } from "./subjects.js";
// // Define your fileSchema with dynamic subject enum

// // const branchList = await getBranches();

// export var subjectCache = null; // Cached branch data

// export async function getBranches() {
//   if (subjecthCache) return subjectCache; // Return if already fetched

//   try {
//     // Ensure DB is connected before fetching branches
//     await connectDB();

//     subjectCache = await subjects.distinct("subject"); // Fetch distinct branches
//     console.log("subjects fetched:", subjectCache);
//     return subjectCache;
//   } catch (error) {
//     console.error("Error fetching subjects:", error);
//     subjectCache = ["NULL"]; // Fallback value
//     return subjectCache;
//   }
// }

// // Lazy initialization of branchList
// export var subjectList = subjectCache || [];



// const createSubSchema = () => {
//   const fileSchema = new mongoose.Schema({
//     year: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 4,
//     },
//     branch: {
//       type: String,
//       required: true,
//       enum: branchCache, // Dynamically populated
//     },
//     sem: {
//       type: String,
//       required: true,
//       enum: [
//         "Semester_1",
//         "Semester_2",
//         "Semester_3",
//         "Semester_4",
//         "Semester_5",
//         "Semester_6",
//         "Semester_7",
//         "Semester_8",
//       ],
//     },
//     subject: {
//       type: String,
//       required: true,
//       enum: subjectCache, // Dynamically populated
//     },
//     fileTitle: {
//       type: String,
//       required: true,
//     },
//     fileDescription: {
//       type: String,
//       required: true,
//     },
//     fileLink: {
//       type: String,
//       required: true,
//     },
//   });

//   return mongoose.model("Files", fileSchema);
// };



// // (async () => {
// //   if (branchList.length === 0) {
// //     branchCache = await getBranches();
// //   }
// // })();

// //Function to update the subject enum dynamically based on user input
// async function updateSubjectEnum(year, branch, sem) {
//   if (!year || !branch || !sem) {
//     // If any of the parameters is missing, leave subject enum empty
//     return [];
//   }

//   try {
//     // Fetch subjects based on the provided parameters
//     const subjects = await getSubjects({ year, branch, sem });
//     const subjectNames = subjects.map((subject) => subject.subjectName); // Assuming subjectName is the key
//     return subjectNames; // Return the subject names to populate the enum
//   } catch (error) {
//     console.error("Error fetching subjects:", error);
//     return []; // Return empty array if there's an error
//   }
// }

// export async function createFileModel(year, branch, sem) {
//   // Fetch or calculate dynamic subjects or data as required
//   console.log("files.js", branchCache);

//   // Create schema dynamically, but here it is directly returning the model
//   const FileModel = createSubSchema(); // Create the model from schema

//   // Now you have a proper model, you can use it in AdminJS or elsewhere
//   return FileModel;
// }

// // Function to create the model based on dynamic input
// export async function createFileModel(year, branch, sem) {
//   const subjectEnum = await updateSubjectEnum(year, branch, sem); // Dynamically fetch subjects
// console.log("files.js", branchCache);
//  // Define the file schema again, but this time update the enum for subject dynamically
//   fileSchema.path("subject").enum = subjectEnum;

//  // Now create the model with the updated schema
//   const FileModel = mongoose.model("File", fileSchema);

//   return FileModel;

//   return createSubSchema;
  
// }
