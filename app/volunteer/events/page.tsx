import React from "react";
import Layout from "../components/Layout";

const EventsPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex h-screen">
        {/* Main Content */}
        <main className="flex-1">
          {/* Horizontal Form */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Organization"
              className="p-2 border rounded-md flex-1"
            />
            <input
              type="text"
              placeholder="Where"
              className="p-2 border rounded-md flex-1"
            />
            <input
              type="text"
              placeholder="When"
              className="p-2 border rounded-md flex-1"
            />
            <button className="bg-orange-500 text-white p-2 rounded-md flex-none">
              Search
            </button>
          </div>

          {/* Event Type Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="bg-gray-200 p-2 rounded-md">Category 1</button>
            <button className="bg-gray-200 p-2 rounded-md">Category 2</button>
            <button className="bg-gray-200 p-2 rounded-md">Category 3</button>
            <button className="bg-gray-200 p-2 rounded-md">Category 4</button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Search events by name"
              className="p-2 border rounded-md flex-1"
            />
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Event Box */}
            <div className="p-4 border rounded-md bg-white shadow-md">
              <h3 className="text-lg font-semibold mb-2">Event Title</h3>
              <p className="text-gray-600 mb-2">Event Description</p>
              <p className="text-gray-500">Date & Time</p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default EventsPage;
