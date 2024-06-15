import { IoMdHome } from "react-icons/io";
import { FaUsers, FaBoxOpen, FaTags, FaChartBar } from "react-icons/fa";
import { MdCategory, MdDashboard } from "react-icons/md";

// Define the SideBarLink interface
interface SideBarLink {
  href: string;
  key: string;
  text: string;
  icon:
    | typeof IoMdHome
    | typeof FaUsers
    | typeof FaBoxOpen
    | typeof FaTags
    | typeof FaChartBar
    | typeof MdCategory
    | typeof MdDashboard;
}

// Define the SideBarLinks array
export const SideBarLinks: SideBarLink[] = [
  {
    href: "/Dashboard",
    key: "Dashboard",
    text: "Dashboard",
    icon: MdDashboard,
  },
  {
    href: "/StoreUsers",
    key: "StoreUsers",
    text: "Store Users",
    icon: FaUsers,
  },
  {
    href: "/Categories",
    key: "Categories",
    text: "Categories",
    icon: MdCategory,
  },
  {
    href: "/Products",
    key: "Products",
    text: "Products",
    icon: FaBoxOpen,
  },
  {
    href: "/Orders",
    key: "Orders",
    text: "Orders",
    icon: FaTags,
  },
  {
    href: "/Analytics",
    key: "Analytics",
    text: "Analytics",
    icon: FaChartBar,
  },
];
