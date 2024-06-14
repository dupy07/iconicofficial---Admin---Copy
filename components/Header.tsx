// Header.tsx
import React from "react";
import { CiMenuBurger } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ui/toggle-mode";
import Image from "next/image";

const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  return (
    <>
      <div className="text-center py-3 font-semibold sm:hidden">
        <span className="text-sm">Welcome to Iconic Official Admin Page</span>
      </div>
      <div className="rounded-tr-md rounded-br-md border border-gray-300 bg-background flex justify-between items-center h-20 p-5 text-gray-700">
        <div className="flex items-center  gap-2 md:gap-3">
          <div className="md:hidden cursor-pointer" onClick={toggleSidebar}>
            <CiMenuBurger size={24} />
          </div>
          <Image
            src="/profile-1.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
          <h2 className="text-xl md:text-2xl font-bold">
            ICO<span className="text-red-500">NIC</span>
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
};

export default Header;
