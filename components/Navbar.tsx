"use client";
import { NavLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoSearch } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <>
      <nav className="border-b py-3 ff-poppins">
        <div className="container flexBetween">
          <Link href="/">
            <Image
              src="/favicon.ico"
              alt="Iconic"
              width="0"
              height="0"
              sizes="100vw"
              className="w-8 h-auto"
            />
          </Link>

          <ul role="list" className="hidden fw-semi-bold h-full  md:flex">
            {NavLinks.map((link) => (
              <Link
                href={link.href}
                key={link.key}
                className={`fs-500 flexCenter ff-primary fw-semi-bold cursor-pointer px-4 relative navbar_link
              ${pathname === link.href ? "active" : ""}`}
              >
                {link.text}
              </Link>
            ))}
          </ul>

          <div className="text-2xl gap-5 hidden lg:flex items-center">
            <div className="border px-3 flex items-center gap-2 rounded-full">
              <GoSearch />
              <input
                type="text"
                className="w-32 text-sm p-2 outline-none"
                placeholder="Search"
              />
            </div>

            <Link href="/" className="navbar_options">
              <CiHeart style={{ position: "relative" }} />
            </Link>

            <Link href="/" className="">
              <FaShoppingCart className="navbar_options" />
            </Link>
          </div>
          <FiMenu
            width={32}
            height={32}
            className="inline-block cursor-pointer lg:hidden text-2xl"
          />
        </div>
      </nav>
    </>
  );
};
export default Navbar;
