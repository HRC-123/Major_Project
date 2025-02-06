import express from "express";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import mongoose, { isValidObjectId } from "mongoose";
import * as AdminJSMongoose from "@adminjs/mongoose";

// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url); // Get the current file path
// const __dirname = path.dirname(__filename); // Get the current directory path
// import SubjectsList from "./components/SubjectsList,jsx";
// import AddSubject from "./components/AddSubject.jsx";

// import { Subject } from "./models/subject.js";
// import { File,
//   Subject,
//   Semester,
//   Branch,
//   Year, } from "./models/year.js";
// import { File } from "./models/fileUpload.js";

// import { Academic} from "./models/Years.js";
import { connectDB } from "./config/database.js";
// import { Year } from "./models/academics.js";

import { departments } from "./models/departments.js";
import { files } from "./models/file.js";
import createSubSchema from "./models/subjects.js";
import { branchCache,branchList,getBranches } from "./models/subjects.js";
import { createFileModel } from "./models/files.js";

// Initialize Express
const app = express();

// Registering the Adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});
// Use JSON middleware
app.use(express.json());

await connectDB();
await getBranches();
console.log("index.js -> branchList", branchList,branchCache);
// Connect to MongoDB

// Custom action to download file
// const downloadFileAction = {
//   actionType: "record",
//   icon: "Download",
//   label: "Download File",
//   handler: async (request, response, context) => {
//     const { record, currentAdmin } = context;
//     const fileLink = record.params.downloadLink;

//     if (fileLink) {
//       return {
//         redirectUrl: fileLink,
//         message: {
//           type: "success",
//           text: "Downloading file...",
//         },
//       };
//     }

//     return {
//       message: {
//         type: "error",
//         text: "No download link available",
//       },
//     };
//   },
// };

// // Resource Options
// const fileResourceOptions = {
//   properties: {
//     title: {
//       isTitle: true,
//     },
//     fileType: {
//       availableValues: [
//         { value: "pdf", label: "PDF" },
//         { value: "docx", label: "Word Document" },
//         { value: "ppt", label: "PowerPoint" },
//         { value: "txt", label: "Text File" },
//         { value: "xlsx", label: "Excel Spreadsheet" },
//         { value: "other", label: "Other" },
//       ],
//     },
//     fileSize: {
//       type: "number",
//       isVisible: { list: true, filter: true, show: true, edit: true },
//     },
//   },
//   actions: {
//     downloadFile: downloadFileAction,
//   },
// };

// const subjectResourceOptions = {
//   properties: {
//     name: {
//       isTitle: true,
//     },
//     files: {
//       type: "mixed",
//     },
//   },
// };

// const semesterResourceOptions = {
//   properties: {
//     name: {
//       isTitle: true,
//     },
//     subjects: {
//       type: "mixed",
//     },
//   },
// };

// const branchResourceOptions = {
//   properties: {
//     branch: {
//       isTitle: true,
//     },
//     semesters: {
//       type: "mixed",
//     },
//   },
// };

// const yearResourceOptions = {
//   properties: {
//     year: {
//       isTitle: true,
//     },
//     branches: {
//       type: "mixed",
//     },
//   },
// };

// AdminBro Configuration
// const adminBroOptions = {
//   resources: [
//     // {
//     //   resource: File,
//     //   options: fileResourceOptions,
//     // },
//     // {
//     //   resource: Subject,
//     //   options: subjectResourceOptions,
//     // },
//     // {
//     //   resource: Semester,
//     //   options: semesterResourceOptions,
//     // },
//     // {
//     //   resource: Branch,
//     //   options: branchResourceOptions,
//     // },
//     // {
//     //   resource: Year,
//     //   options: yearResourceOptions,
//     // },
//     {
//       resource:Year,
//     }
//   ],
//   branding: {
//     companyName: "Academic Resources Management",
//     logo: false,
//     softwareBrothers: false,
//   },
// };

// Initialize AdminJS
// const adminJS = new AdminJS(adminBroOptions);

// const adminJs = new AdminJS({
//   resources: [
//     {
//       resource: Year,
//       options: {
//         actions: {
//           addSubject: {
//             actionType: "record",
//             icon: "Add",
//             label: "Add Subject",
//             handler: async (request, response, context) => {
//               const { record } = context;

//               if (request.method === "post") {
//                 const { year, branch, semester, subjectName } = request.payload;

//                 const yearRecord = await Year.findById(record.id);
//                 const branchRecord = yearRecord.branches.find(
//                   (b) => b.branch === branch
//                 );
//                 const semesterRecord = branchRecord.semesters.find(
//                   (s) => s.semester === semester
//                 );

//                 semesterRecord.subjects.push({ name: subjectName });
//                 await yearRecord.save();

//                 return {
//                   record: record.toJSON(),
//                   notice: {
//                     message: `Subject "${subjectName}" added successfully!`,
//                     type: "success",
//                   },
//                 };
//               }

//               return {
//                 record: record.toJSON(),
//               };
//             },
//             component: false, // Use default form rendering
//           },
//         },
//       },
//     },
//   ],
//   rootPath: "/admin",
// });

// const seedDatabase = async () => {
//   // Clear existing data
//   await Year.deleteMany({});

//   const branches = [
//     "CSE",
//     "ECE",
//     "IT",
//     "ME",
//     "EE",
//     "ICE",
//     "IPE",
//     "BT",
//     "Chem",
//     "CE",
//     "MC",
//     "HM",
//     "Phy",
//     "TT",
//   ];

//   const years = [1, 2, 3, 4]; // Predefined years
//   const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; // Predefined semesters

//   // Generate data for each year
//   const data = years.map((year) => ({
//     year,
//     branches: branches.map((branch) => ({
//       branch,
//       semesters: semesters.map((sem) => ({ semester: sem })), // All 8 semesters
//     })),
//   }));

//   // Insert data into the database
//   await Year.insertMany(data);
//   console.log("Database seeded successfully!");
//   // mongoose.disconnect();
// };

// seedDatabase().catch((err) => {
//   console.error("Error seeding database:", err);
//   mongoose.disconnect();
// });

// const adminJs = new AdminJS({
//   resources: [
//     {
//       resource: Academic,
//       options: {
//         properties: {
//           // Handle dynamic fields
//           "years.branches.semesters.courses": {
//             type: "array",
//             isArray: true,
//           },
//           // Allow listing and editing these fields
//           listProperties: ["years", "departments"],
//           editProperties: ["years"],
//           filterProperties: ["year", "branch", "semester"],
//         },
//         // actions: {
//         //   // Custom action for listing by year, branch, and semester
//         //   show: {
//         //     actionType: "show",
//         //     isAccessible: true,
//         //     component: AdminJS.bundle("./components/SubjectsList"), // Custom React Component to list subjects
//         //   },
//         //   new: {
//         //     actionType: "new",
//         //     component: AdminJS.bundle("./components/AddSubject"), // Custom form to add a new subject
//         //   },
//         // },
//       },
//     },
//   ],
//   rootPath: "/admin",
// });

// adminJs.addComponent('SubjectsList', SubjectsList);
// adminJs.addComponent('AddSubject', AddSubject);

const adminJs = new AdminJS({
  resources: [
    // Resource for the departments model (branches)
    {
      resource: departments,
      options: {
        properties: {
          _id: { isVisible: false },
          branch: { isVisible: true }, // Display the branch field
        },
      },
    },

    // // Dynamic resource for the subjects model (with branches and semesters as enum)
    {
      resource: await createSubSchema(), // Your subjects model
      options: {
        properties: {
          _id: { isVisible: false },
          year: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          branch: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          sem: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          subject: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
        },
      },
    },

    {
      resource: files, // Dynamically create the file model
      options: {
        properties: {
          _id: { isVisible: false },
          year: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          branch: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          sem: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          subject: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          title: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          description: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          link: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
        },
      },
    },
  ],
  rootPath: "/admin",
});

// Build AdminJS router
const router = AdminJSExpress.buildRouter(adminJs);

// Use AdminJS router as middleware
app.use(adminJs.options.rootPath, router);

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AdminJS is running on http://localhost:${PORT}/admin`);
});
