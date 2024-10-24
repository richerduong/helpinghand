'use server';

import supabase from '@/api/supabaseClient';
import { profile, event } from '@/types/types';

// Fetch all volunteers (non-admin) and events from Supabase
export const fetchVolunteersAndEvents = async (): Promise<{
  volunteers: profile[];
  events: event[];
  error: string | null;
}> => {
  try {
    const { data: volunteerData, error: volunteerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', false); // Fetch only non-admin volunteers

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*');

    if (volunteerError || eventError) {
      throw new Error(volunteerError?.message || eventError?.message);
    }

    return { volunteers: volunteerData || [], events: eventData || [], error: null };
  } catch (error) {
    return { volunteers: [], events: [], error: (error as Error).message };
  }
};

// Handle manual match of volunteer to event
export const handleManualMatch = async (selectedVolunteer: profile, selectedEvent: event): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!selectedVolunteer || !selectedEvent) {
    return { success: false, message: 'Please select both a volunteer and an event.' };
  }

  try {
    // Check if a match already exists in the volunteer_history table
    const { data: existingMatch, error: checkError } = await supabase
      .from('volunteer_history')
      .select('*')
      .eq('volunteer_id', selectedVolunteer.id)
      .eq('event_id', selectedEvent.id)
      .maybeSingle();

    if (checkError) {
      throw new Error(checkError.message);
    }

    if (existingMatch) {
      return { success: false, message: `Volunteer ${selectedVolunteer.full_name} is already matched to event ${selectedEvent.event_name}.` };
    }

    // Insert the match into the volunteer_history table
    const { error: historyError } = await supabase
      .from('volunteer_history')
      .insert([{
        volunteer_id: selectedVolunteer.id,
        event_id: selectedEvent.id,
        participation_status: 'upcoming',
        event_name: selectedEvent.event_name,
        location: selectedEvent.location,
        event_date: selectedEvent.event_date,
      }]);

    if (historyError) {
      throw new Error(historyError.message);
    }

    // Insert the notification for the volunteer
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        volunteer_id: selectedVolunteer.id,
        message: `You have been matched to the event: ${selectedEvent.event_name}`,
        event_name: selectedEvent.event_name,
        date: selectedEvent.event_date,
        time: new Date(selectedEvent.event_date).toLocaleTimeString(),
        location: selectedEvent.location,
        is_read: false,
        created_at: new Date(),
        description: `You are now scheduled to attend the event "${selectedEvent.event_name}" at ${selectedEvent.location}.`,
      }]);

    if (notificationError) {
      throw new Error(notificationError.message);
    }

    return { success: true, message: `Volunteer ${selectedVolunteer.full_name} successfully matched to event ${selectedEvent.event_name}` };
  } catch (error) {
    return { success: false, message: `Error during manual match: ${(error as Error).message}` };
  }
};
