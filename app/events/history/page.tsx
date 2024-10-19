'use client';
import { useState, useEffect } from 'react';
import { VolunteerHistory } from '@/types/types';
import { fetchUserProfile } from '../../profile/actions';
import supabase from '@/api/supabaseClient';  // Assuming Supabase is configured

export default function History() {
  const [history, setHistory] = useState<VolunteerHistory[]>([]);
  const [loading, setLoading] = useState(true);  // State for handling loading
  const [error, setError] = useState<string | null>(null);  // Handle any errors

  useEffect(() => {
    const fetchHistory = async () => {
      // Get current user email from supabase auth
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        setError('Error fetching user or user email is not available');
        return;
      }

      const currentUserEmail = user.email;

      // Fetch user profile based on email
      const userProfile = await fetchUserProfile(currentUserEmail);

      if (!userProfile) {
        setError('No profile found for current user');
        return;
      }

      const currentUserId = userProfile.id;

      // Fetch volunteer history only for the current user
      const { data: volunteerHistoryData, error: historyError } = await supabase
        .from('volunteer_history')
        .select(`
          id, created_at, updated_at, volunteer_id, event_id, participation_status,
          event_name, location, event_date
        `)
        .eq('volunteer_id', currentUserId);  // Filter by current user's volunteer_id

      if (historyError) {
        console.error('Error fetching volunteer history:', historyError.message);
        setError('Error fetching volunteer history');
        return;
      }

      // Log the data structure to inspect
      console.log('Fetched volunteer history for current user:', volunteerHistoryData);

      if (Array.isArray(volunteerHistoryData) && volunteerHistoryData.length > 0) {
        // Update the status based on the event date comparison
        const updatedHistory = volunteerHistoryData.map((event) => {
          const eventDate = new Date(event.event_date);
          const today = new Date();

          // Compare the event date with today's date to set the status dynamically
          if (eventDate < today) {
            return { ...event, participation_status: 'completed' };
          } else if (eventDate >= today) {
            return { ...event, participation_status: 'upcoming' };
          }
          return event;
        });

        setHistory(updatedHistory);
      } else {
        setHistory([]);  // Set an empty array if no data is found
      }

      setLoading(false);  // Stop loading once data is fetched
    };

    fetchHistory();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading volunteer history...</p>
      </div>
    );  // Display a loading message, centered
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error}</p>
      </div>
    );  // Display an error message, centered
  }

  // Handle empty data
  if (history.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-600">No volunteer history available.</p>
      </div>
    );  // Display a centered message with a larger font when no data is available
  }

  // Display the fetched data
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-center">Volunteer Participation History</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Event Name</th>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">Event Date</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((event, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{event.event_name}</td>
              <td className="border px-4 py-2">{event.location}</td>
              <td className="border px-4 py-2">{new Date(event.event_date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">
                {event.participation_status === 'completed'
                  ? <span className="text-green-500">Completed</span>
                  : <span className="text-blue-500">Upcoming</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}