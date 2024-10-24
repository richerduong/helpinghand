import supabase from "@/api/supabaseClient";

// Fetch the user session from Supabase
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }

  return data.session; // Return session data if successful
}
