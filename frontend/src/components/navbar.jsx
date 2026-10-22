import { FaCircleUser } from "react-icons/fa6";
import { FaBell, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

const searchPlace = [
  "Search games, gamers & streamers...",
  "Find your next gaming obsession...",
  "Discover clips, creators & live streams...",
];

function Navbar() {
  const [placeholder, setPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => (prev + 1) % searchPlace.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      {/* Logo */}
      <div>
        <h1 className="text-3xl font-stretch-50% italic">
          Strimo
        </h1>
      </div>

      {/* Search */}
      <div className="mx-4 hidden sm:flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 transition focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder={searchPlace[placeholder]}
          className="w-full bg-transparent text-sm text-gray-800 outline-0 placeholder:text-gray-400"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="grid h-10 w-10 place-items-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-violet-600"
        >
          <FaBell className="text-lg" />
        </button>
        <button
          type="button"
          aria-label="Profile"
          className="grid h-10 w-10 place-items-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-violet-600"
        >
          <FaCircleUser className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;