// SideBar.tsx
import React from "react";
import { SideBarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  return (
    <>
      <div
        className={`fixed top-0 left-0 bg-background w-60 h-full border-r transition-transform duration-300 ease-in-out z-50
        ${
          isOpen
            ? "transform translate-x-0"
            : "transform -translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center p-5 h-20 border-b gap-2 md:bg-background">
          <img src="/profile-1.png" alt="Logo" className="w-10 h-10" />
          <h2 className="text-2xl font-bold">
            ICO<span className="text-red-500">NIC</span>
          </h2>
        </div>
        <div className="mt-7">
          <ul role="list" className="flex flex-col fs-400 px-5">
            {SideBarLinks.map((link) => (
              <Link
                href={link.href}
                key={link.key}
                className={`p-1 hover:bg-muted/50 block py-2 text-gray-70
                ${pathname === link.href ? "bg-muted/50" : ""}`}
              >
                {link.text}
              </Link>
            ))}
          </ul>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SideBar;
