// Header.tsx
import React from "react";
import { CiMenuBurger } from "react-icons/ci";

const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  return (
    <>
      <div className="text-center py-3 fw-semi-bold bg-gray-100">
        <span className="text-sm">Welcome to Iconic Official Admin Page</span>
      </div>
      <div className="rounded-tr-md rounded-br-md border border-gray-300 bg-white flex justify-between items-center h-20 p-5 text-gray-700">
        <div className="flex items-center gap-2 md:gap-4">
          <img src="/profile-1.png" alt="Logo" className="w-12 h-12" />
          <h2 className="text-xl md:text-2xl font-bold">
            ICO<span className="text-red-500">NIC</span>
          </h2>
        </div>
        <div className="md:hidden cursor-pointer" onClick={toggleSidebar}>
          <CiMenuBurger size={24} />
        </div>
      </div>
    </>
  );
};

export default Header;
