'use client';

import { useState, useEffect } from 'react';

// Example Notification data type
interface Notification {
  id: number;
  message: string;
  date: string;
  link?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications (simulated with static data)
  useEffect(() => {
    const fetchedNotifications = [
      { id: 1, message: 'You have been assigned to a new event!', date: '9/2/2024', link: '/events/123' },
      { id: 2, message: 'Event update: The location for "Community Cleanup" has changed.', date: '9/29/2024' },
      { id: 3, message: 'Reminder: Your upcoming event starts tomorrow!', date: '9/30/2024', link: '/events/456' },
    ];
    setNotifications(fetchedNotifications);
  }, []);

  return (
    <div className="max-w-1170 w-full mx-auto flex justify-center h-full">
      <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5">
        <h1 className="text-2xl font-bold mb-4">Notification History</h1>
        <hr className="border-gray-300 w-full my-4 mb-6" />
        {notifications.length > 0 ? (
          <ul>
            {notifications.map(notification => (
              <li key={notification.id} className="mb-3 p-3 shadow rounded bg-white">
                <p className="text-gray-800">{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.date}</p>
                {notification.link && (
                  <a href='/notifications' className="text-orange hover:text-blue-700">View details</a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications to show.</p>
        )}

        <hr className="border-gray-300 w-full my-4 mb-6" />
      </div>
    </div>
  );
}
