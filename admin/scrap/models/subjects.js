import { supabase } from "../../config/database.js";

export async function getSubjects({ year, branch, sem } = {}) {
  let query = supabase.from("subjects").select("*");

  if (year) query = query.eq("year", year);
  if (branch) query = query.eq("branch", branch);
  if (sem) query = query.eq("sem", sem);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addSubject(subject) {
  const { data, error } = await supabase.from("subjects").insert([subject]);
  if (error) throw error;
  return data;
}
