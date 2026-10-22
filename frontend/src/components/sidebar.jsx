import { IoMdHome } from "react-icons/io";
import {
  FaPlayCircle,
  FaPlus,
  FaUser,
  FaShoppingCart,
  FaCog,
  FaQuestionCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaFileContract,
} from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { NavLink } from "react-router";

const mainItems = [
  { name: "Home", icon: IoMdHome, link: "/" },
  { name: "Reels", icon: FaPlayCircle, link: "/reels" },
  { name: "Add", icon: FaPlus, link: "/add" },
  { name: "Coin", icon: CgNotes, link: "/mission" },
  { name: "Profile", icon: FaUser, link: "/profile" },
  { name: "Strimo Store", icon: FaShoppingCart, link: "https://apexstore-e-commerce-mdrz.onrender.com" },
];

const moreItems = [
  { name: "Settings", icon: FaCog, link: "/settings" },
  { name: "Help & Support", icon: FaQuestionCircle, link: "/help" },
  { name: "About Us", icon: FaInfoCircle, link: "/about" },
  { name: "Privacy Policy", icon: FaShieldAlt, link: "/privacy-policy" },
  { name: "Terms & Conditions", icon: FaFileContract, link: "/terms" },
];

function SidebarLink({ name, icon: Icon, link, small = false }) {
  return (
    <NavLink
      to={link}
      end={link === "/"}
      title={name}
      className={({ isActive }) =>
        `flex items-center justify-center gap-3 rounded-lg px-3 font-medium transition-colors lg:justify-start ${
          small ? "py-2 text-[13px]" : "py-3 text-sm"
        } ${
          isActive
            ? "bg-violet-100 text-violet-600"
            : small
            ? "text-gray-500 hover:bg-gray-100 hover:text-violet-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-violet-600"
        }`
      }
    >
      <Icon className={`shrink-0 ${small ? "text-base" : "text-xl"}`} />
      <span className="hidden lg:block">{name}</span>
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-3 sm:flex sm:w-20 lg:w-60">
      {/* Main navigation */}
      <nav aria-label="Sidebar" className="flex flex-col gap-1">
        {mainItems.map((item) => (
          <SidebarLink key={item.link} {...item} />
        ))}
      </nav>

      {/* More links, pushed to the bottom */}
      <div className="mt-auto border-t border-gray-200 pt-3">
        <nav aria-label="More links" className="flex flex-col gap-0.5">
          {moreItems.map((item) => (
            <SidebarLink key={item.link} {...item} small />
          ))}
        </nav>

        <p className="mt-3 hidden px-3 text-xs text-gray-400 lg:block">
          © {new Date().getFullYear()} Strimo. All rights reserved.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;