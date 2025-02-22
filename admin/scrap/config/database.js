import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Get Supabase credentials from .env file
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

// Create a Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// export const connectDB = async () => {
//   try {
//     console.log("Connected to Supabase successfully");
//   } catch (error) {
//     console.error("Error connecting to Supabase: " + error);
//   }
// };
