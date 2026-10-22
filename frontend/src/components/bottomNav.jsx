import { IoMdHome } from "react-icons/io";
import { FaPlayCircle, FaPlus, FaUser } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { NavLink } from "react-router";

const items = [
  { name: "Home", icon: IoMdHome, link: "/" },
  { name: "Reels", icon: FaPlayCircle, link: "/reels" },
  { name: "Add", icon: FaPlus, link: "/add" },
  { name: "Coin", icon: CgNotes, link: "/mission" },
  { name: "User", icon: FaUser, link: "/user" },
];

function BottomNav() {
  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-gray-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sm:hidden"
    >
      {items.map(({ name, icon: Icon, link }) => (
        <NavLink
          key={link}
          to={link}
          end={link === "/"}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
              isActive ? "text-violet-600" : "text-gray-500 hover:text-violet-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`grid h-8 w-12 place-items-center rounded-full transition-colors ${
                  isActive ? "bg-violet-100" : "bg-transparent"
                }`}
              >
                <Icon className="text-xl" />
              </span>
              <span>{name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;