import express from "express";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import { Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

// Initialize Express

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
// import { isValidObjectId } from "mongoose";
// import Department from "./models/departments.js";

// import { useTranslation } from "adminjs";
// import { ComponentLoader } from "adminjs";

// const componentLoader = new ComponentLoader();

// const Components = {
//   Dashboard: componentLoader.add("Dashboard", "./dashboard.jsx"),
//   // other custom components
// };



dotenv.config();
AdminJS.registerAdapter(AdminJSSequelize);

// Get Supabase credentials from .env file
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const sequelize = new Sequelize(
  process.env.SUPABASE_DB_NAME,
  process.env.SUPABASE_DB_USER,
  process.env.SUPABASE_DB_PASSWORD,
  {
    host: process.env.SUPABASE_HOST,
    dialect: "postgres",
    port: 5432,
    poolmode:"session",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Supabase PostgreSQL!");
  } catch (error) {
    console.error("❌ Unable to connect to Supabase:", error);
  }
})();

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
})();

// // Function to fetch data from Supabase
const fetchSupabaseData = async (table) => {
  const { data, error } = await supabase.from(table).select("*");
  // console.log("table", table);
  // console.log("data ", data);

  if (error) {
    console.error(`Error fetching ${table}:`, error.message);
    return [];
  }
  return data;
};

//Fetch initial data for AdminJS
const departments = await fetchSupabaseData("departments");
console.log(departments.map((dept) => dept.branch));

const subjects = await fetchSupabaseData("subjects");
// console.log(subjects)
const documents = await fetchSupabaseData("documents");
// console.log(documents)

const Department = sequelize.define(
  "departments",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Auto-generate unique UUID
      primaryKey: true,
    },
    branch: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true, // Ensures that each branch is unique
      primaryKey: true,
    },
    abbreviation: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true, // Ensures that each branch is unique
    },
  },
  {
    timestamps: false,
  }
);

const Subject = sequelize.define(
  "subjects",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Auto-generate unique UUID
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branch: {
      type: DataTypes.TEXT, // Use ENUM for valid department values
      allowNull: false,
  
    },
    sem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subjectcode: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

const Document = sequelize.define(
  "documents",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Auto-generate unique UUID
      primaryKey: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branch: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    semester: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subjectcode: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.TEXT, // E.g., Assignments, Books, Notes, PPT
      allowNull: false,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorEmail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // upvote: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // },
    // downvote: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // },
  },
  {
    timestamps: false,
  }
);

const Report = sequelize.define(
  "reports",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Auto-generate UUID
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorEmail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    branch: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subjectcode: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reporter_email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reporter_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // We are manually setting timestamp
  }
);

const app = express();

// Use JSON middleware
app.use(express.json());

app.get("/", (req, res) => res.redirect("/admin"));




const getDepartmentOptions = () => {
  return departments.map((dept) => ({
    value: dept.branch,
    label: dept.branch,
  }));
};

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const adminJs = new AdminJS({
  // dashboard: {
  //   component: Components.Dashboard,
  //   handler:
  //     async () => {
  //       return {
  //         departments: departments.length,
  //         departmentNames: departments.map(d => d.branch),
  //         subjects: subjects.length,
  //         documents: documents.length,
  //         users:10,
  //       }
  //     }
  // },
  // componentLoader,

  resources: [
    {
      resource: Department,
      options: {
        properties: {
          id: { isVisible: false },
          branch: { isVisible: true },
          abbreviation: { isVisible: true },
        },
        parent: {
          name: "NITJ", // label for the group
          // icon: "SomeIconName", // optional icon in the sidebar
        },

        actions: {
          new: {
            after: async (response, request, context) => {
              if (response.record && response.record.params) {
                console.log("New Department Added:", response.record.params);

                // Re-fetch departments from Supabase after adding a new one
                const newDept = response.record.params;
                // Push new department data into the departments array
                departments.push(newDept);
                // console.log("Updated departments array:", departments);
                // departments.push(newDept);
                // console.log("Updated departments array:", departments);

                // Update availableValues for Subject and Document resources
                const newOptions = getDepartmentOptions();
                // Assuming adminJs.resources[1] is Subject and [2] is Document,
                // update their options (this might need a more robust approach if order changes)
                const subjectResource = adminJs.findResource("subjects");
                // console.log(subjectResource);
                if (
                  subjectResource &&
                  subjectResource._decorated &&
                  subjectResource._decorated.options &&
                  subjectResource._decorated.options.properties &&
                  subjectResource._decorated.options.properties.branch
                ) {
                  subjectResource._decorated.options.properties.branch.availableValues =
                    newOptions;
                } else {
                  console.warn(
                    "Subject resource not found or branch property is undefined"
                  );
                }
              }
              return response;
            },
          },
        },
      },
    },
    {
      resource: Subject,
      options: {
        properties: {
          id: { isVisible: false },
          year: {
            isVisible: true,
            availableValues: [
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
            ],
          },
          sem: {
            isVisible: true,
            availableValues: [
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
            ],
          },
          branch: {
            isVisible: true,
            availableValues: getDepartmentOptions(),
          },

          subject: { isVisible: true },
          subjectcode: { isVisible: true },
        },
        parent: {
          name: "NITJ", // label for the group
          // icon: "SomeIconName", // optional icon in the sidebar
        },
      },
    },
    {
      resource: Document,
      options: {
        properties: {
          id: { isVisible: false },
          year: {
            isVisible: true,
            availableValues: [
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
            ],
          },
          branch: {
            isVisible: true,
            availableValues: departments.map((dept) => ({
              value: dept.branch, // the value stored in the database
              label: dept.branch, // the label to display in the dropdown
            })),
          },
          semester: {
            isVisible: true,
            availableValues: [
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
            ],
          },
          subject: { isVisible: true },
          subjectcode: { isVisible: true },
          type: { isVisible: true },
          author: { isVisible: true },
          authorEmail: { isVisible: true },

          title: { isVisible: true },
          description: { isVisible: true },

          url: { isVisible: true },
          // upvote: { isVisible: true },
          // downvote: { isVisible: true },
        },
        parent: {
          name: "NITJ", // label for the group
          // icon: "SomeIconName", // optional icon in the sidebar
        },
        actions: {
          new: { isVisible: false, isAccessible: false },
        },
      },
    },
    {
      resource: Report,
      options: {
        properties: {
          id: { isVisible: false },

          year: {
            isVisible: true,
            availableValues: [
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
            ],
          },
          branch: {
            isVisible: true,
            availableValues: departments.map((dept) => ({
              value: dept.branch,
              label: dept.branch,
            })),
          },
          semester: {
            isVisible: true,
            availableValues: [
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
            ],
          },
          subject: { isVisible: true },
          subjectcode: { isVisible: true },
          type: { isVisible: true },
          author: { isVisible: true },
          authorEmail: { isVisible: true },
          title: { isVisible: true },
          description: { isVisible: true },
          url: { isVisible: true },
          reporter_email: { isVisible: true },
          reporter_name: { isVisible: true },
          reason: { isVisible: true },
          timestamp: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false, // Don't allow editing timestamp
            },
          },
        },
        parent: {
          name: "NITJ",
        },
        actions: {
          new: { isVisible: false, isAccessible: false },
        },
      },
    },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "NITJ Admin",
    logo: false,
    softwareBrothers: false, 
  },
});


const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (email === ADMIN.email && password === ADMIN.password) {
        return ADMIN;
      }
      return null;
    },
    cookieName: "adminjs",
    cookiePassword: process.env.COOKIE_SECRET || "supersecret",
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

// Build AdminJS Router
app.use(adminJs.options.rootPath, adminRouter);
const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AdminJS is running at http://localhost:${PORT}/admin`);
});
