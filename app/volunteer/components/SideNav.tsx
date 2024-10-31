"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const SideNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = {
    profilePicture: "/path/to/profile-pic.jpg",
    name: "Person Name",
    email: "person@example.com",
  };

  const handleLogout = () => {
    router.push("/signin");
  };

  return (
    <nav className="w-[20rem] bg-white h-screen p-6 text-gray">
      {/* Account Dropdown */}
      <div className="relative mb-4">
        <button
          className="flex items-center space-x-2 p-3 rounded-md bg-gray-100 hover:bg-gray-200 w-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="text-left">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
          <svg
            className={`w-4 h-4 ml-auto transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 w-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200">
            <ul>
              <li>
                <Link href="/profile" className="block p-3 hover:bg-gray-100">
                  Manage Account
                </Link>
              </li>
              <li>
                <Link href="/admin" className="block p-3 hover:bg-gray-100">
                  Switch to Admin View
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block p-3 hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <ul>
        <li
          className={`mb-4 p-3 rounded-md ${
            pathname === "/volunteer/home" ? "bg-orange text-white" : ""
          }`}
        >
          <Link href="/volunteer/home">Home</Link>
        </li>
        {/* <li
          className={`mb-4 p-3 rounded-md ${
            pathname === "/volunteer/notifications"
              ? "bg-orange text-white"
              : ""
          }`}
        >
          <Link href="/volunteer/notifications">Notifications</Link>
        </li> */}
        <li
          className={`mb-4 p-3 rounded-md ${
            pathname === "/volunteer/events" ? "bg-orange text-white" : ""
          }`}
        >
          <Link href="/volunteer/events">Events</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
