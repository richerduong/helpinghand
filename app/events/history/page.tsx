'use client';
import { useState, useEffect } from 'react';
import { VolunteerHistory } from '@/types/types';
import { fetchVolunteerHistory } from './actions';  // Import the server-side action

export default function History() {
  const [history, setHistory] = useState<VolunteerHistory[]>([]);
  const [loading, setLoading] = useState(true);  // State for handling loading
  const [error, setError] = useState<string | null>(null);  // Handle any errors

  useEffect(() => {
    const loadHistory = async () => {
      const { history, error } = await fetchVolunteerHistory();

      if (error) {
        setError(error);
      } else {
        setHistory(history || []);  // Set the fetched history
      }

      setLoading(false);  // Stop loading once data is fetched
    };

    loadHistory();  // Call the function to fetch data
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading volunteer history...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  // Handle empty data
  if (history.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="/images/ppl.png"
          alt="Background"
          style={{ width: '1100px', height: 'auto' }}
          className="absolute bottom-0 left-0 z-0"
        />
        <p className="text-2xl text-gray-600">No volunteer history available.</p>
      </div>
    );
  }

  // Display the fetched data
  return (
    <div>
      <img
          src="/images/ppl.png"
          alt="Background"
          style={{ width: '1100px', height: 'auto' }}
          className="absolute bottom-0 left-0 z-0"
        />
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
