"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="w-[20rem] bg-white h-screen p-6 text-gray">
      <ul>
        <li
          className={`mb-4 p-3 rounded-md ${
            pathname === "/volunteer/home" ? "bg-orange text-white" : ""
          }`}
        >
          <Link href="/volunteer/home">Home</Link>
        </li>
        <li
          className={`mb-4 p-3 rounded-md ${
            pathname === "/volunteer/notifications"
              ? "bg-orange text-white"
              : ""
          }`}
        >
          <Link href="/volunteer/notifications">Notifications</Link>
        </li>
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
