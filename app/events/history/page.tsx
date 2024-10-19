'use client';
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../profile/actions'
import supabase from '@/api/supabaseClient';
import { profile, event } from '@/types/types';

export default function History() {
  const [volunteers, setVolunteers] = useState<profile[]>([]);
  const [events, setEvents] = useState<event[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Fetch volunteers and events
  const fetchVolunteersAndEvents = async () => {
    const { data: volunteerData, error: volunteerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', false); // Only volunteers (non-admin)

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*');

    if (volunteerError || eventError) {
      console.error('Error fetching data:', volunteerError || eventError);
    } else {
      setVolunteers(volunteerData || []);
      setEvents(eventData || []);
    }

    setLoading(false);
  };

  // Step 2: Update volunteer history (This is now triggered when volunteers and events are set)
  useEffect(() => {
    const updateVolunteerHistory = async () => {
      const currentDate = new Date();

      for (const volunteer of volunteers) {
        const matchedEvent = matchVolunteerToEvent(volunteer, events);

        if (matchedEvent) {
          const eventDate = new Date(matchedEvent.event_date);
          const participationStatus = eventDate >= currentDate ? 'upcoming' : 'completed';

          // Check if an entry already exists in `volunteer_history`
          const { data: existingRecord, error: fetchError } = await supabase
            .from('volunteer_history')
            .select('*')
            .eq('event_id', matchedEvent.id)
            .eq('volunteer_id', volunteer.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking volunteer history:', fetchError);
            continue;
          }

          if (existingRecord) {
            // If the record exists, update it
            const { error: updateError } = await supabase
              .from('volunteer_history')
              .update({
                participation_status: participationStatus,
                event_name: matchedEvent.event_name,
                location: matchedEvent.location,
                event_date: matchedEvent.event_date,
              })
              .eq('event_id', matchedEvent.id)
              .eq('volunteer_id', volunteer.id);

            if (updateError) {
              console.error('Error updating volunteer history:', updateError);
            }
          } else {
            // If no record exists, insert a new one
            const { error: insertError } = await supabase
              .from('volunteer_history')
              .insert([
                {
                  volunteer_id: volunteer.id,
                  event_id: matchedEvent.id,
                  participation_status: participationStatus,
                  event_name: matchedEvent.event_name,
                  location: matchedEvent.location,
                  event_date: matchedEvent.event_date,
                },
              ]);

            if (insertError) {
              console.error('Error inserting into volunteer history:', insertError);
            }
          }
        }
      }
    };

    if (volunteers.length > 0 && events.length > 0) {
      updateVolunteerHistory(); // Trigger when volunteers and events are set
    }
  }, [volunteers, events]); // This useEffect will run when volunteers or events change

  // Step 3: Fetch volunteer history
  const fetchHistory = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      setError('Error fetching user or user email is not available');
      return;
    }

    const userProfile = await fetchUserProfile(user.email);

    if (!userProfile) {
      setError('No profile found for current user');
      return;
    }

    const { data: volunteerHistoryData, error: historyError } = await supabase
      .from('volunteer_history')
      .select(`
        id, created_at, updated_at, volunteer_id, event_id, participation_status,
        event_name, location, event_date
      `)
      .eq('volunteer_id', userProfile.id);  // Filter by current user's volunteer_id

    if (historyError) {
      console.error('Error fetching volunteer history:', historyError.message);
      setError('Error fetching volunteer history');
      return;
    }

    setHistory(volunteerHistoryData || []);
    setLoading(false);
  };

  useEffect(() => {
    const runProcess = async () => {
      await fetchVolunteersAndEvents();
      await fetchHistory();
    };

    runProcess();  // Run everything on component mount
  }, []);

  // Matching logic
  const matchVolunteerToEvent = (volunteer: profile, events: event[]): event | undefined => {
    return events.find((event) => {
      const hasMatchingSkills = event.required_skills.some((skill) =>
        volunteer.skills.some((volunteerSkill) => volunteerSkill === skill)
      );

      const isDateAvailable = volunteer.availability.some(
        (availableDate) =>
          new Date(availableDate).toISOString().slice(0, 10) === new Date(event.event_date).toISOString().slice(0, 10)
      );

      return hasMatchingSkills && isDateAvailable;
    });
  };

  // Handle loading
  if (loading) {
    return <p>Loading volunteer history...</p>;
  }

  // Handle errors
  if (error) {
    return <p>{error}</p>;
  }

  // Display the history
  return (
    <div>
      <h1>Volunteer Participation History</h1>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Location</th>
            <th>Event Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((event, index) => (
            <tr key={index}>
              <td>{event.event_name}</td>
              <td>{event.location}</td>
              <td>{new Date(event.event_date).toLocaleDateString()}</td>
              <td>{event.participation_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
