"use client";
import { SideBarLinks } from "@/constants";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();
  return (
    <>
      <div className="hidden md:block bg-white w-60 h-full fixed border-r">
        <div className="flex items-center p-4 border-b gap-2">
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
                className={`p-1 hover:bg-gray-200 
                block py-2 text-gray-70"
                ${pathname === link.href ? "active" : ""}`}
              >
                {link.text}
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
