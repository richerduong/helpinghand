import React from "react";
import Layout from "../components/Layout";

const NotificationsPage: React.FC = () => {
  const notifications = [
    { id: 1, message: "You have a new task assigned!" },
    { id: 2, message: "Reminder: Volunteer meeting tomorrow at 10 AM." },
    { id: 3, message: "Task 'Fundraiser event' has been updated." },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="p-4 bg-gray-100 rounded-md shadow-md"
          >
            {notification.message}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default NotificationsPage;
