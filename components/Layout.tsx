// Layout.tsx
"use client";
import React, { useState } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`md:ml-60 w-full ${isSidebarOpen ? "ml-0" : "ml-0"}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
