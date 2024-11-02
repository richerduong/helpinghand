import supabase from '@/api/supabaseClient';
import { fetchUserProfile } from '../../profile/actions';
import { VolunteerHistory } from '@/types/types';

// Fetch current user's volunteer history from Supabase (server-side)
export const fetchVolunteerHistory = async (): Promise<{
  history: VolunteerHistory[] | null;
  error: string | null;
}> => {
  try {
    // Get current user email from supabase auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return { history: null, error: 'Error fetching user or user email is not available' };
    }

    const currentUserEmail = user.email;

    // Fetch user profile based on email
    const userProfile = await fetchUserProfile(currentUserEmail);

    if (!userProfile) {
      return { history: null, error: 'No profile found for current user' };
    }

    const currentUserId = userProfile.id;

    // Fetch volunteer history for the current user
    const { data: volunteerHistoryData, error: historyError } = await supabase
      .from('volunteer_history')
      .select(`
        id, created_at, updated_at, volunteer_id, event_id, participation_status,
        event_name, location, event_date
      `)
      .eq('volunteer_id', currentUserId); // Filter by current user's volunteer_id

    if (historyError) {
      console.error('Error fetching volunteer history:', historyError.message);
      return { history: null, error: 'Error fetching volunteer history' };
    }

    // Update the status based on the event date comparison
    const updatedHistory = (volunteerHistoryData || []).map((event) => {
      const eventDate = new Date(event.event_date);
      const today = new Date();

      // Compare the event date with today's date to set the status dynamically
      if (eventDate < today) {
        return { ...event, participation_status: 'Completed' };
      } else if (eventDate >= today) {
        return { ...event, participation_status: 'Upcoming' };
      }
      return event;
    });

    return { history: updatedHistory, error: null };
  } catch (error: any) {
    return { history: null, error: 'An unexpected error occurred while fetching history' };
  }
};
