// volunteer/dashboard/page.tsx
import React from "react";
import SideNav from "../components/SideNav";
import DashboardContent from "../components/DashboardContent";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <DashboardContent />
    </div>
  );
};

export default DashboardPage;
