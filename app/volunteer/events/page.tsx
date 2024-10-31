"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchEvents } from "./action";

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  date: string;
  skills: string;
  urgency: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const getEvents = async () => {
      const { events, error } = await fetchEvents();
      if (error) {
        setError(error);
      } else {
        setEvents(events || []);
        setFilteredEvents(events || []);
      }
      setLoading(false);
    };

    getEvents();
  }, []);

  // Filter events based on search term and selected date
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = events.filter((event) => {
      const matchesLocation = event.location
        .toLowerCase()
        .includes(lowercasedSearchTerm);
      const matchesDate = selectedDate ? event.date === selectedDate : true;
      return matchesLocation && matchesDate;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, selectedDate, events]);

  // Function to clear search inputs
  const clearSearchInputs = () => {
    setSearchTerm("");
    setSelectedDate("");
  };

  return (
    <Layout>
      <div className="flex h-screen">
        <main className="flex-1">
          {/* Horizontal Form */}
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <input
              type="text"
              placeholder="Where"
              className="p-2 border rounded-md flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              className="p-2 border rounded-md flex-1"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {/* Clear Button */}
            <button
              className="bg-gray-300 text-black p-2 px-4 rounded-md flex-none"
              onClick={clearSearchInputs}
            >
              Clear
            </button>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading events...</p>
            ) : error ? (
              <p>{error}</p>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-md bg-white shadow-md"
                >
                  <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-2">{event.description}</p>
                  <p className="text-gray-500">{event.date}</p>
                  <p className="text-gray-500">{event.location}</p>
                  <p className="text-gray-400">{event.skills}</p>
                  <p className="text-gray-400">{event.urgency}</p>
                </div>
              ))
            ) : (
              <p>No events available.</p>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default EventsPage;
