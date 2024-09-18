'use client'
import { useState, useEffect } from 'react';

// Example participation data type
interface VolunteerHistory {
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: string;
  eventDate: string;
  participationStatus: string;
}

export default function History() {
  const [history, setHistory] = useState<VolunteerHistory[]>([]);

  // Simulated data fetching
  useEffect(() => {
    const fetchedHistory = [
      {
        eventName: 'Community Cleanup',
        eventDescription: 'Help clean the local park.',
        location: 'Central Park',
        requiredSkills: ['Cleaning', 'Organizing'],
        urgency: 'High',
        eventDate: '2024-10-10',
        participationStatus: 'Completed',
      },
      {
        eventName: 'Food Drive',
        eventDescription: 'Collect and distribute food donations.',
        location: 'Community Center',
        requiredSkills: ['Logistics', 'Communication'],
        urgency: 'Medium',
        eventDate: '2024-11-15',
        participationStatus: 'Upcoming',
      },
    ];
    setHistory(fetchedHistory);
  }, []);

  return (
    <div className="max-w-1170 w-full mx-auto flex justify-center h-full">
      <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5">
        <h1 className="text-2xl font-bold mb-4 text-center">Volunteer Participation History</h1>
        <hr className="border-gray-300 w-full my-4 mb-6" />

        {history.length > 0 ? (
          <table className="w-full table-auto border-collapse text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-4">Event Name</th>
                <th className="border p-4">Description</th>
                <th className="border p-4">Location</th>
                <th className="border p-4">Required Skills</th>
                <th className="border p-4">Urgency</th>
                <th className="border p-4">Event Date</th>
                <th className="border p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((event, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50">
                  <td className="border p-4">{event.eventName}</td>
                  <td className="border p-4">{event.eventDescription}</td>
                  <td className="border p-4">{event.location}</td>
                  <td className="border p-4">{event.requiredSkills.join(', ')}</td>
                  <td className="border p-4">{event.urgency}</td>
                  <td className="border p-4">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="border p-4">{event.participationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No volunteer history available.</p>
        )}

        <hr className="border-gray-300 w-full my-4 mb-6" />
      </div>
    </div>
  );
}
