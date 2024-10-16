'use client'
import { useState, useEffect } from 'react';
import { VolunteerHistory } from '@/types/types';
import supabase from '@/api/supabaseClient';  // Assuming Supabase is configured

export default function History() {
  // Define state to store volunteer history data
  const [history, setHistory] = useState<VolunteerHistory[]>([]);
  const [loading, setLoading] = useState(true);  // State for handling loading
  const [error, setError] = useState<string | null>(null);  // Handle any errors

  // Fetch data using useEffect
  useEffect(() => {
    const fetchHistory = async () => {
      const { data: volunteerHistoryData, error: historyError } = await supabase
        .from(' ')
        .select(`
          id, created_at, updated_at, volunteer_id, event_id, participation_status,
          events!inner (event_name, location, event_date)
        `);  // Fetch volunteer history and event data

      if (historyError) {
        console.error('Error fetching volunteer history:', historyError.message);  // Log the detailed error message
        return;  // Exit early if there's an error
      } 
      // Check if volunteerHistoryData is an array
    if (Array.isArray(volunteerHistoryData) && volunteerHistoryData.length > 0) {
      // Proceed if there's data to map
      const flattenedData = volunteerHistoryData.map((record: any) => ({
        id: record.id,
        created_at: record.created_at,
        updated_at: record.updated_at,
        volunteer_id: record.volunteer_id,
        event_id: record.event_id,
        participation_status: record.participation_status,
        event_name: record.events.event_name,   // Extract event_name from the nested events object
        location: record.events.location,       // Extract location
        event_date: record.events.event_date,   // Extract event_date
      }));

      setHistory(flattenedData);  // Set the flattened data in state
    } else {
      // Handle case where no data is found
      console.log('No volunteer history data found.');
      setHistory([]);  // Set an empty array if no data is found
    }

    setLoading(false);  // Stop loading once data is fetched
  };

    fetchHistory();  // Call the function to fetch data when the component mounts
  }, []);

  // Handle loading state
  if (loading) {
    return <p>Loading volunteer history...</p>;  // Display a loading message
  }

  // Handle error state
  if (error) {
    return <p>{error}</p>;  // Display an error message if there's a fetch error
  }

  // Handle empty data
  if (history.length === 0) {
    return <p>No volunteer history available.</p>;  // Display message if no data is available
  }

  // Display the fetched data
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
