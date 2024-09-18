'use client';

import { useState } from 'react';
import TinderCard from 'react-tinder-card'; // Use react-tinder-card package for swiping
import { useRouter } from 'next/router';

interface Volunteer {
    name: string;
    age: number;
    skills: string[];
    bio: string;
  }
  
  interface Event {
    eventName: string;
    requirements: string[];
  }
  
  // Sample data for volunteers and events
  const volunteers: Volunteer[] = [
    {
      name: 'Allison',
      age: 22,
      skills: ['Teaching', 'Organizing'],
      bio: 'I love helping people and organizing educational events.',
    },
    {
      name: 'Michael',
      age: 28,
      skills: ['Cooking', 'Event Management'],
      bio: 'Experienced chef and event manager, ready to contribute to community events.',
    },
    {
      name: 'Sarah',
      age: 34,
      skills: ['Mentoring', 'Public Speaking'],
      bio: 'Passionate about mentoring young minds and delivering impactful speeches.',
    },
  ];
  
  // Matching logic: find an event based on volunteer's skills
  const matchVolunteerToEvent = (volunteer: Volunteer, events: Event[]): Event | undefined => {
    return events.find((event) =>
      event.requirements.some((skill) => volunteer.skills.includes(skill))
    );
  };
  
  export default function VolunteerMatchingForm() {
    const events: Event[] = [
      {
        eventName: 'Charity Bake Sale',
        requirements: ['Cooking', 'Event Management'],
      },
      {
        eventName: 'Community Teaching Program',
        requirements: ['Teaching'],
      },
    ];

  return (
    <>
      <h2 className="text-2xl font-semibold text-black-text">Volunteer Matching</h2>
      <h4 className="mt-2 text-base font-light text-darkgrey-text">
        Match a volunteer to an event.
      </h4>
      <hr className="border-gray-300 w-full my-4"/>
        <div className="flex w-full justify-between">
            <div className="flex flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
        {volunteers.map((volunteer) => {
          const matchedEvent = matchVolunteerToEvent(volunteer, events);
          return (
            <div key={volunteer.name} className="bg-white p-4 shadow-lg rounded-lg text-center">
              <h2 className="text-xl font-semibold">{volunteer.name}, {volunteer.age}</h2>
              <p className="mt-2 text-gray-600">{volunteer.bio}</p>
              <p className="mt-4 text-sm text-gray-500">Skills: {volunteer.skills.join(', ')}</p>
              {matchedEvent && (
                <p className="mt-4 text-green-600 font-semibold">
                  Matched Event: {matchedEvent.eventName}
                </p>
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
