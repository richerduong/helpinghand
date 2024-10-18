import { cookies } from "next/headers";
import supabase from "@/api/supabaseClient";

export async function fetchUserProfile(email: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  return data;
}
