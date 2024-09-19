import React from "react";
import SideNav from "./SideNav";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <SideNav />
      <div className="flex-grow p-6">{children}</div>
    </div>
  );
};

export default Layout;
