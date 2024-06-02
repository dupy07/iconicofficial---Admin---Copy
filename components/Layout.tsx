import React from "react";
import Sidebar from "./SideBar";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-60 w-full">
        <Header />
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
