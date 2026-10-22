import { useRef, useState } from "react";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaGamepad,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
import streamerData from "../data/strimer.json";

// 245000 -> 245K, 1200000 -> 1.2M
const formatCount = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

function StreamerCard({ streamer }) {
  const [following, setFollowing] = useState(streamer.isFollowing);
  const [followers, setFollowers] = useState(streamer.followers);

  const toggleFollow = () => {
    setFollowers((prev) => (following ? prev - 1 : prev + 1));
    setFollowing((prev) => !prev);
  };

  return (
    <article className="flex w-[170px] shrink-0 snap-start flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:w-[190px]">
      {/* Avatar with live ring */}
      <div className="relative">
        <img
          src={streamer.avatar}
          alt={streamer.name}
          loading="lazy"
          className={`h-20 w-20 rounded-full object-cover p-0.5 ring-2 ring-offset-2 ${
            streamer.isLive ? "ring-rose-500" : "ring-gray-200"
          }`}
        />
        {streamer.isLive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
            LIVE
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="mt-3 flex max-w-full items-center gap-1 text-sm font-semibold text-gray-900">
        <span className="truncate">{streamer.name}</span>
        {streamer.verified && (
          <FaCheckCircle className="shrink-0 text-xs text-purple-500" aria-label="Verified" />
        )}
      </h3>
      <p className="max-w-full truncate text-xs text-gray-500">@{streamer.username}</p>

      {/* Game */}
      <span className="mt-2 flex max-w-full items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-600">
        <FaGamepad className="shrink-0" />
        <span className="truncate">{streamer.game}</span>
      </span>

      {/* Stats */}
      <p className="mt-2 text-xs text-gray-500">
        {streamer.isLive
          ? `${formatCount(streamer.viewers)} watching`
          : `${formatCount(followers)} followers`}
      </p>

      {/* Follow button */}
      <button
        type="button"
        onClick={toggleFollow}
        aria-pressed={following}
        className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition active:scale-[0.98] ${
          following
            ? "border border-gray-300 bg-white text-gray-700 hover:border-rose-300 hover:text-rose-500"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {following ? <FaUserCheck /> : <FaUserPlus />}
        {following ? "Following" : "Follow"}
      </button>
    </article>
  );
}

function StreamerSection() {
  const scrollerRef = useRef(null);

  const scrollByCards = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (streamerData.length === 0) return null;

  return (
    <section aria-label="Recommended streamers" className="my-6">
      {/* Headline */}
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recommended Streamers</h2>
          <p className="text-sm text-gray-500">
            Follow your favourite creators and never miss a stream
          </p>
        </div>

        {/* Scroll arrows (desktop only) */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll left"
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-purple-300 hover:text-purple-600"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Scroll right"
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-purple-300 hover:text-purple-600"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Streamer cards (swipe left / right) */}
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-2 pt-1 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {streamerData.map((streamer) => (
          <StreamerCard key={streamer.id} streamer={streamer} />
        ))}
      </div>
    </section>
  );
}

export default StreamerSection;