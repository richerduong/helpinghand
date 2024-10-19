'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import supabase from '@/api/supabaseClient';
import { profile, event } from '@/types/types';
import { skillOptions } from '@/data/data';

export default function AdminMatch() {
  const [volunteers, setVolunteers] = useState<profile[]>([]);
  const [events, setEvents] = useState<event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<event[]>([]); // New state for filtered events
  const [selectedVolunteer, setSelectedVolunteer] = useState<profile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch only non-admin volunteers and events from Supabase
    const fetchVolunteersAndEvents = async () => {
      const { data: volunteerData, error: volunteerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', false); // Fetch only non-admin volunteers

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*');

      if (volunteerError || eventError) {
        console.error('Error fetching data:', volunteerError || eventError);
        setError('Failed to fetch volunteers or events.');
      } else {
        setVolunteers(volunteerData || []);
        setEvents(eventData || []);
      }
      setLoading(false);
    };

    fetchVolunteersAndEvents();
  }, []);

  // Filter events based on the selected volunteer's skills and availability
  const filterEventsForVolunteer = (volunteer: profile) => {
    const matchedEvents = events.filter((event) => {
      const hasMatchingSkills = event.required_skills.some((skill) =>
        volunteer.skills.some((volunteerSkill) => volunteerSkill === skill)
      );
  
      const isDateAvailable = volunteer.availability.some((availableDate) => {
        const eventDate = new Date(event.event_date);
        const volunteerDate = new Date(availableDate);
  
        // Compare the year, month, and day without considering the time or time zone
        return (
          eventDate.getFullYear() === volunteerDate.getFullYear() &&
          eventDate.getMonth() === volunteerDate.getMonth() &&
          eventDate.getDate() === volunteerDate.getDate()
        );
      });
  
      return hasMatchingSkills && isDateAvailable;
    });
  
    setFilteredEvents(matchedEvents);
  };
  

  // Handle volunteer selection
  const handleVolunteerSelect = (volunteerEmail: string) => {
    const selectedVolunteer = volunteers.find((v) => v.email === volunteerEmail) || null;
    setSelectedVolunteer(selectedVolunteer);

    // Filter events for this volunteer
    if (selectedVolunteer) {
      filterEventsForVolunteer(selectedVolunteer);
    }
  };

  // Handle manual match submission
  const handleManualMatch = async () => {
    if (!selectedVolunteer || !selectedEvent) {
      alert('Please select both a volunteer and an event.');
      return;
    }
  
    try {
      // Check if a match already exists in the volunteer_history table
      const { data: existingMatch, error: checkError } = await supabase
        .from('volunteer_history')
        .select('*')
        .eq('volunteer_id', selectedVolunteer.id) // Use volunteer_id
        .eq('event_id', selectedEvent.id) // Use event_id
        .maybeSingle(); // MaybeSingle allows us to not throw an error if no record is found
  
      if (checkError) {
        console.error('Error checking volunteer history:', checkError);
        alert('Error checking volunteer history.');
        return;
      }
  
      if (existingMatch) {
        // If a match already exists, prevent the duplicate insertion
        alert(`Volunteer ${selectedVolunteer.full_name} is already matched to event ${selectedEvent.event_name}.`);
        return;
      }
  
      // Insert the match into the volunteer_history table
      const { error: historyError } = await supabase
        .from('volunteer_history')
        .insert([{
          volunteer_id: selectedVolunteer.id, // Assuming you have access to the volunteer's ID
          event_id: selectedEvent.id,
          participation_status: 'upcoming', // Initial status
          event_name: selectedEvent.event_name,
          location: selectedEvent.location,
          event_date: selectedEvent.event_date,
        }]);
  
      if (historyError) {
        console.error('Error inserting into volunteer history:', historyError);
        alert('Error inserting volunteer match into history.');
        return;
      }
  
      // Optionally, insert a notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          volunteer_id: selectedVolunteer.id, // Assuming volunteer_id is used in the notifications table as well
          message: `You have been matched to the event: ${selectedEvent.event_name}`,
          read: false, // Default to unread
        }]);
  
      if (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
  
      alert(`Volunteer ${selectedVolunteer.full_name} successfully matched to event ${selectedEvent.event_name}`);
    } catch (error) {
      console.error('Error during manual match:', error);
      alert('An error occurred while matching the volunteer.');
    }
  
    // Reset selection after match
    setSelectedVolunteer(null);
    setSelectedEvent(null);
    setFilteredEvents([]);
  };
  


  if (loading) {
    return <p>Loading volunteers and events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-black-text">Admin Volunteer Matching</h2>
      <h4 className="mt-2 text-base font-light text-darkgrey-text">
        Match volunteers to events manually.
      </h4>
      <hr className="border-gray-300 w-full my-4" />

      {/* Volunteer selection dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Volunteer</label>
        <select
          value={selectedVolunteer?.email || ''}
          onChange={(e) => handleVolunteerSelect(e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
        >
          <option value="">Select a Volunteer</option>
          {volunteers.map((volunteer) => (
            <option key={volunteer.email} value={volunteer.email}>
              {volunteer.full_name} - {volunteer.email}
            </option>
          ))}
        </select>
      </div>

      {/* Event selection dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Event</label>
        <select
          value={selectedEvent?.id || ''}
          onChange={(e) => setSelectedEvent(filteredEvents.find(ev => ev.id === parseInt(e.target.value)) || null)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          disabled={!selectedVolunteer}
        >
          <option value="">Select an Event</option>
          {filteredEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {event.event_name} - {new Date(event.event_date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Match button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleManualMatch}
        disabled={!selectedVolunteer || !selectedEvent}
      >
        Match Volunteer to Event
      </button>
    </>
  );
}
