"use client";

import { useState, useEffect } from "react";
import ImageScroller from "@/components/imagescroll";
import supabase from "../../api/supabaseClient";

// Notification data types
interface Notification {
  id: number;
  message: string;
  created_at: string;
  event_name: string;
  date: string;
  time: string;
  location: string;
  is_read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const imagesLeft = [
    "/images/scroll1.jpg",
    "/images/scroll2.jpg",
    "/images/scroll3.jpg",
    "/images/scroll4.jpg",
    "/images/scroll5.jpg",
    "/images/scroll6.jpg",
  ];
  const imagesRight = [
    "/images/scroll7.jpg",
    "/images/scroll8.jpg",
    "/images/scroll9.jpg",
    "/images/scroll10.jpg",
    "/images/scroll11.jpg",
    "/images/scroll12.jpg",
  ];

  // Fetch notifications from Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, message, created_at, event_name, date, time, location, is_read"
        )
        .order("created_at", { ascending: false }); // Fetch notifications, ordered by latest

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        // Transform data to match Notification interface
        const formattedNotifications = data.map((notification: any) => ({
          id: notification.id,
          message: notification.message,
          created_at: new Date(notification.created_at).toLocaleDateString(), // Format created_at
          event_name: notification.event_name,
          date: notification.date,
          time: notification.time,
          location: notification.location,
          is_read: notification.is_read,
        }));
        setNotifications(formattedNotifications);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="flex justify-between">
      {/* Left Scrolling Images */}
      <ImageScroller direction="up" images={imagesLeft} />
      <div className="max-w-1170 w-full mx-auto flex justify-center h-full">
        <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5">
          <h1 className="text-2xl font-bold mb-4">Notification History</h1>
          <hr className="border-gray-300 w-full my-4 mb-6" />

          {/* Display Notifications */}
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`mb-3 p-3 shadow rounded bg-white ${
                    notification.is_read ? "opacity-50" : ""
                  }`} // Dims read notifications
                >
                  <p className="font-bold">{notification.event_name}</p>
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500">{`${notification.date}, ${notification.time} @ ${notification.location}`}</p>
                  <p className="text-xs text-gray-400">
                    {notification.created_at}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications to show.</p>
          )}

          <hr className="border-gray-300 w-full my-4 mb-6" />
        </div>
      </div>
      {/* Right Scrolling Images */}
      <ImageScroller direction="down" images={imagesRight} />
    </div>
  );
}
