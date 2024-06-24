// SideBar.tsx
import React from "react";
import { SideBarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
          <Image
            src="/profile-1.png"
            alt="Logo"
            width={50}
            height={50}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h2 className="text-lg md:text-xl font-bold">
            ICO<span className="text-red-500">NIC</span>
          </h2>
        </div>
        <div className="mt-2">
          <ul role="list" className="flex flex-col text-sm px-4 sm:px-3">
            {SideBarLinks.map((link) => (
              <Link
                href={link.href}
                key={link.key}
                className={`flex items-center pl-2 rounded-lg hover:bg-muted/50 gap-2 py-2 text-gray-70
                ${pathname === link.href ? "bg-muted/50" : ""}`}
              >
                <link.icon /> {link.text}
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
