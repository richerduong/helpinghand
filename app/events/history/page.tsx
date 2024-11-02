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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700 animate-pulse">Loading volunteer history...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // Handle empty data
  if (history.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-2xl text-gray-600">No volunteer history available.</p>
      </div>
    );
  }

  // Display the fetched data
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Volunteer Participation History</h1>
      <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Event Name
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Location
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Event Date
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map((event, index) => (
            <tr
              key={index}
              className={`text-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
            >
              <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{event.event_name}</td>
              <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{event.location}</td>
              <td className="border-b border-gray-200 px-6 py-4 text-gray-700">
                {new Date(event.event_date).toLocaleDateString()}
              </td>
              <td className={`border-b border-gray-200 px-6 py-4 font-semibold 
                ${event.participation_status.toLowerCase() === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                {event.participation_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
