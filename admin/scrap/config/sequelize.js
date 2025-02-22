import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("Database", "postgres", "Gchaitanya@04", {
  host: "jgjacbjwwbyfawnlzywy.supabase.co", // Your Supabase host
  dialect: "postgres",
  port: 5432, // Supabase default port
  dialectOptions: {
    ssl: {
      require: true, // Enforce SSL
      rejectUnauthorized: false, // Fix SSL issues
    },
  },
  logging: false,
});

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Supabase PostgreSQL!");
  } catch (error) {
    console.error("❌ Unable to connect to Supabase:", error);
  }
})();

export default sequelize;
