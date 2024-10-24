'use client';
import React, { useState, useEffect } from 'react';
import { fetchVolunteersAndEvents, handleManualMatch } from './actions';
import { profile, event } from '@/types/types';

export default function AdminMatch() {
  const [volunteers, setVolunteers] = useState<profile[]>([]);
  const [events, setEvents] = useState<event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<event[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<profile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { volunteers, events, error } = await fetchVolunteersAndEvents();
      if (error) {
        setError(error);
      } else {
        setVolunteers(volunteers);
        setEvents(events);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filterEventsForVolunteer = (volunteer: profile) => {
    const matchedEvents = events.filter((event) => {
      const hasMatchingSkills = event.required_skills.some((skill) =>
        volunteer.skills.includes(skill)
      );
      const isDateAvailable = volunteer.availability.some((availableDate) => {
        const eventDate = new Date(event.event_date);
        const volunteerDate = new Date(availableDate);
        return eventDate.toDateString() === volunteerDate.toDateString();
      });
      return hasMatchingSkills && isDateAvailable;
    });
    setFilteredEvents(matchedEvents);
  };

  const handleVolunteerSelect = (volunteerEmail: string) => {
    const selectedVolunteer = volunteers.find((v) => v.email === volunteerEmail) || null;
    setSelectedVolunteer(selectedVolunteer);
    if (selectedVolunteer) filterEventsForVolunteer(selectedVolunteer);
  };

  const handleMatch = async () => {
    if (!selectedVolunteer || !selectedEvent) {
      alert('Please select both a volunteer and an event.');
      return;
    }

    const { success, message } = await handleManualMatch(selectedVolunteer, selectedEvent);
    alert(message);

    if (success) {
      setSelectedVolunteer(null);
      setSelectedEvent(null);
      setFilteredEvents([]);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
        onClick={handleMatch}
        disabled={!selectedVolunteer || !selectedEvent}
      >
        Match Volunteer to Event
      </button>
    </>
  );
}
