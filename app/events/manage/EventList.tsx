import { useEffect, useState } from 'react';
import { event } from '@/types/types';
import { skillOptions } from '@/data/data';
import { fetchEvents, deleteEvent } from './actions';

interface EventListProps {
  onEditEvent: (event: event) => void;
}

export default function EventList({ onEditEvent }: EventListProps) {
  const [events, setEvents] = useState<event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      const { data, error } = await fetchEvents();
      if (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events.');
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    loadEvents();
  }, []);

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this event?');
    if (!isConfirmed) return;

    const error = await deleteEvent(id); // Call server-side delete function
    if (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    } else {
      // Update the client-side state after a successful delete
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    }
  };

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="border p-4 rounded-lg shadow-lg bg-white">
          <h3 className="text-lg font-semibold">{event.event_name}</h3>
          <p>{event.event_description}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p>
            <strong>Required Skills:</strong>{' '}
            {event.required_skills
              .map((skill) => {
                const skillOption = skillOptions.find((option) => option.value === skill);
                return skillOption ? skillOption.label : skill;
              })
              .join(', ')}
          </p>
          <p><strong>Urgency:</strong> {event.urgency}</p>
          <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
          <div className="flex justify-between mt-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => onEditEvent(event)}
            >
              Edit
            </button>
            <button
              className="bg-red text-white px-4 py-2 rounded"
              onClick={() => handleDelete(event.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
