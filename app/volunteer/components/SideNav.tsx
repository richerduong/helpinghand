// volunteer/components/SideNav.tsx
import React from "react";
import Link from "next/link";

const SideNav: React.FC = () => {
  return (
    <nav className="w-64 bg-orange h-screen p-6 text-white">
      <ul>
        <li className="mb-4">
          <Link href="/volunteer/home">Home</Link>
        </li>
        <li className="mb-4">
          <Link href="/volunteer/tasks">Tasks</Link>
        </li>
        <li className="mb-4">
          <Link href="/volunteer/activities">Activities</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
