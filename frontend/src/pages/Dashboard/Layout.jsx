import React from "react";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
