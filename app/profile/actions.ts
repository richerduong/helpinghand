'use server'

import supabase from "@/api/supabaseClient";

// Fetch the user profile from Supabase
export async function fetchUserProfile(email: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

// Update the user profile in Supabase
export async function updateUserProfile(profileInfo: any) {
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: profileInfo.full_name,
      address_1: profileInfo.address_1,
      address_2: profileInfo.address_2,
      city: profileInfo.city,
      state: profileInfo.state,
      zip_code: profileInfo.zip_code,
      skills: profileInfo.skills,
      preferences: profileInfo.preferences,
      availability: profileInfo.availability.map((date: Date) => date.toISOString()),
    })
    .eq("email", profileInfo.email);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: 'Error updating profile' };
  }

  return { success: true, message: 'Profile updated successfully' };
}