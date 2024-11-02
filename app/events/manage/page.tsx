'use client';

import { useState } from 'react';
import EventList from './EventList';
import EventForm from './EventForm';
import { event } from '@/types/types';
import ImageScroller from "@/components/imagescroll";

export default function EventManagement() {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<event | null>(null);

  const handleEditEvent = (event: event) => {
    setEditingEvent(event);
    setIsCreatingEvent(true);
  };

  const handleCreateEventClick = () => {
    setEditingEvent(null);
    setIsCreatingEvent(!isCreatingEvent);
  };

  const handleFormSubmit = () => {
    setIsCreatingEvent(false);
  };

  const imagesLeft = [
    "/images/2scroll1.jpg",
    "/images/2scroll2.jpg",
    "/images/2scroll3.jpg",
    "/images/2scroll4.jpg",
  ];
  const imagesRight = [
    "/images/2scroll5.jpg",
    "/images/2scroll6.jpg",
    "/images/2scroll7.jpg",
    "/images/2scroll8.jpg",
  ];

  return (
    <>
    <div className="flex justify-between">
      {/* Left Scrolling Images */}
      <ImageScroller direction="up" images={imagesLeft} />
      <div className="max-w-1170 w-full mx-auto flex justify-center h-full">
        <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5">
          <h2 className="text-2xl font-semibold text-black-text">Event Management</h2>
          <div className="mt-4 flex justify-between items-center">
            <h4 className="text-base font-light text-darkgrey-text">
              Manage your events.
            </h4>
            <button
              className="bg-orange text-white py-2 px-4 rounded-lg"
              onClick={handleCreateEventClick}
            >
              {isCreatingEvent ? 'Cancel' : 'Create Event'}
            </button>
          </div>

          <hr className="border-gray-300 w-full my-4 mb-6" />

          {isCreatingEvent ? (
            <EventForm event={editingEvent} onFormSubmit={handleFormSubmit} />
          ) : (
            <EventList onEditEvent={handleEditEvent} />
          )}
        </div>
      </div>
      {/* Right Scrolling Images */}
      <ImageScroller direction="down" images={imagesRight} />
      </div>
    </>
  );
}
