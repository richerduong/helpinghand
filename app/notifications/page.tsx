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
  description: string;
  is_read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showPopup, setShowPopup] = useState(false);

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
          "id, message, created_at, event_name, date, time, location, description, is_read"
        ) // Added 'description'
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        const formattedNotifications = data.map((notification: any) => ({
          id: notification.id,
          message: notification.message,
          created_at: new Date(notification.created_at).toLocaleDateString(),
          event_name: notification.event_name,
          date: notification.date,
          time: notification.time,
          location: notification.location,
          description: notification.description,
          is_read: notification.is_read,
        }));
        setNotifications(formattedNotifications);
      }
    };

    fetchNotifications();
  }, []);

  // Function to handle click on a notification
  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    setShowPopup(true);

    // Update notification as read
    if (!notification.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notification.id);

      // Update the state to mark as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notification.id ? { ...notif, is_read: true } : notif
        )
      );
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedNotification(null);
  };

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
                  onClick={() => handleNotificationClick(notification)}
                  className={`mb-3 p-3 shadow rounded bg-white cursor-pointer relative ${
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

      {/* Notification Popup */}
      {showPopup && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/2">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-600 text-lg"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {selectedNotification.event_name}
            </h2>
            <p>{selectedNotification.message}</p>
            <p className="mt-4">{selectedNotification.description}</p>{" "}
            {/* Display description */}
            <p className="text-sm text-gray-500 mt-4">
              {`${selectedNotification.date}, ${selectedNotification.time} @ ${selectedNotification.location}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
