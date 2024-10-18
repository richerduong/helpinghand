'use client'
import { useState, useEffect } from 'react';
import { VolunteerHistory } from '@/types/types';
import supabase from '@/api/supabaseClient';  // Assuming Supabase is configured

export default function History() {
  const [history, setHistory] = useState<VolunteerHistory[]>([]);
  const [loading, setLoading] = useState(true);  // State for handling loading
  const [error, setError] = useState<string | null>(null);  // Handle any errors

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: volunteerHistoryData, error: historyError } = await supabase
        .from('volunteer_history')
        .select(`
          id, created_at, updated_at, volunteer_id, event_id, participation_status,
          events!inner (event_name, location, event_date)
        `);  // Fetch volunteer history and event data

      if (historyError) {
        console.error('Error fetching volunteer history:', historyError.message);
        setError('Error fetching volunteer history');
        return;  // Exit early if there's an error
      }

      if (Array.isArray(volunteerHistoryData) && volunteerHistoryData.length > 0) {
        const flattenedData = volunteerHistoryData.map((record: any) => ({
          id: record.id,
          created_at: record.created_at,
          updated_at: record.updated_at,
          volunteer_id: record.volunteer_id,
          event_id: record.event_id,
          participation_status: record.participation_status,
          event_name: record.events.event_name,
          location: record.events.location,
          event_date: record.events.event_date,
        }));

        setHistory(flattenedData);  // Set the flattened data in state
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
              <td className="border px-4 py-2">{event.participation_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
