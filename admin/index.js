import express from "express";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import mongoose from "mongoose";
import * as AdminJSMongoose from "@adminjs/mongoose";
// import { Subject } from "./models/subject.js";
import { Year, Branch, Semester, Subject } from "./models/year.js";
// import { File } from "./models/fileUpload.js";
import { connectDB } from "./config/database.js";

// Initialize Express
const app = express();

// Registering the Adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});
// Use JSON middleware
app.use(express.json());

// Connect to MongoDB
await connectDB();

// Initialize AdminJS
const adminJS = new AdminJS({
  databases: [mongoose],
  rootPath: "/admin",
  // resources: [
  //   {
  //     resource: Subject,
  //     options: { listProperties: ["name", "code", "semester", "branch"] },
  //   },
  //   { resource: Year, options: { listProperties: ["year", "semesters"] } },
  //   {
  //     resource: File,
  //     options: {
  //       listProperties: [
  //         "year",
  //         "semester",
  //         "branch",
  //         "subject",
  //         "subjectCode",
  //       ],
  //     },
  //   },
  // ],
  resources: [
    { resource: Year },
    { resource: Branch },
    { resource: Semester },
    { resource: Subject },
  ],
  branding: {
    companyName: "My App",
    softwareBrothers: false,
  },
});

// Build AdminJS router
const router = AdminJSExpress.buildRouter(adminJS);

// Use AdminJS router as middleware
app.use(adminJS.options.rootPath, router);

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AdminJS is running on http://localhost:${PORT}/admin`);
});
