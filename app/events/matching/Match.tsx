'use client';

import { useState, useEffect } from 'react';
import supabase from '@/api/supabaseClient';
import { profile, event } from '@/types/types';
import { skillOptions } from '@/data/data';

export default function Match() {
  const [volunteers, setVolunteers] = useState<profile[]>([]);
  const [events, setEvents] = useState<event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch volunteers and events from Supabase
    const fetchVolunteersAndEvents = async () => {
      const { data: volunteerData, error: volunteerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', false); // Assuming non-admin users are volunteers

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*');

      if (volunteerError || eventError) {
        console.error('Error fetching data:', volunteerError || eventError);
      } else {
        setVolunteers(volunteerData || []);
        setEvents(eventData || []);

        console.log(volunteers)

        console.log("Full volunteer data:", volunteerData);
      }
      setLoading(false);
    };

    fetchVolunteersAndEvents();
  }, []);

  // Matching logic: find an event based on the volunteer's skills and availability
  const matchVolunteerToEvent = (volunteer: profile, events: event[]): event | undefined => {
    return events.find((event) => {
      // Check if at least one skill matches between volunteer and event
      const hasMatchingSkills = event.required_skills.some((skill) =>
        volunteer.skills.some((volunteerSkill) => volunteerSkill === skill)
      );

      // Check if event date is within volunteer's availability
      const isDateAvailable = volunteer.availability.some(
        (availableDate) =>
          new Date(availableDate).toISOString().slice(0, 10) === new Date(event.event_date).toISOString().slice(0, 10)
      );

      // Return event if both conditions are satisfied
      return hasMatchingSkills && isDateAvailable;
    });
  };

  if (loading) {
    return <p>Loading volunteers and events...</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-black-text">Volunteer Matching</h2>
      <h4 className="mt-2 text-base font-light text-darkgrey-text">
        Match volunteers to events based on their skills and availability.
      </h4>
      <hr className="border-gray-300 w-full my-4" />
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
            {volunteers.map((volunteer) => {
              const formattedSkills = volunteer.skills.map((skillValue) => {
                // Find matching skill label based on the value directly
                const skillOption = skillOptions.find((option) => option.value === skillValue);
                return skillOption ? skillOption.label : skillValue;
              });
              const matchedEvent = matchVolunteerToEvent(volunteer, events);
              return (
                <div key={volunteer.email} className="bg-white p-4 shadow-lg rounded-lg text-center">
                  <h2 className="text-xl font-semibold">
                    {volunteer.full_name}
                  </h2>
                  <p className="mt-2 text-gray-600">{volunteer.preferences}</p>
                  <p className="mt-4 text-sm text-gray-500">
                    Skills: {formattedSkills.join(', ')}
                  </p>
                  {matchedEvent ? (
                    <p className="mt-4 text-green-600 font-semibold">
                      Matched Event: {matchedEvent.event_name}
                    </p>
                  ) : (
                    <p className="mt-4 text-red-600">No Matching Event</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
