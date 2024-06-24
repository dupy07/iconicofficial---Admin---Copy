// Header.tsx
import React from "react";
import { CiMenuBurger } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ui/toggle-mode";
import Image from "next/image";

const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  return (
    <>
      <div className="text-center py-1 font-semibold sm:hidden">
        <span className="text-sm">Welcome to Iconic Official Admin Page</span>
      </div>
      <div className="rounded-tr-md rounded-br-md border-y bg-secondary flex justify-between items-center h-20 p-5 ">
        <div className="flex items-center  gap-2 md:gap-3">
          <div className="md:hidden cursor-pointer" onClick={toggleSidebar}>
            <CiMenuBurger size={24} />
          </div>
          <Image
            src="/profile-1.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-12 sm:h-12"
          />
          <h2 className="text-lg md:text-xl font-bold">
            ICO<span className="text-red-500">NIC</span>
          </h2>
        </div>
        <div className="flex gap-3 items-center">
          <ModeToggle />
          <Avatar className="h-6 w-6 md:h-7 md:w-7 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
};

export default Header;
