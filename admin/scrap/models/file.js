import { supabase } from "../config/database.js";

export async function getFiles() {
  const { data, error } = await supabase.from("files").select("*");
  if (error) throw error;
  return data;
}

export async function addFile(file) {
  const { data, error } = await supabase.from("files").insert([file]);
  if (error) throw error;
  return data;
}
