import { useRef, useState } from "react";
import { Link } from "react-router";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaGamepad,
  FaPlay,
  FaHeart,
} from "react-icons/fa";
import reelsData from "../data/reels.json";

// 185000 -> 185K, 1200000 -> 1.2M
const formatCount = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

function ReelCard({ reel }) {
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  // Desktop only: play a muted preview while hovering
  const startPreview = () => {
    setHovering(true);
    videoRef.current?.play().catch(() => {});
  };

  const stopPreview = () => {
    setHovering(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <Link
      to="/reels"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      aria-label={`Watch reel by ${reel.username}: ${reel.caption}`}
      className="group relative aspect-[9/16] w-[150px] shrink-0 snap-start overflow-hidden rounded-2xl bg-gray-900 transition hover:-translate-y-0.5 hover:shadow-lg sm:w-[180px]"
    >
      {/* Thumbnail, then video preview on hover */}
      <img
        src={reel.thumbnail}
        alt=""
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          hovering ? "opacity-0" : "opacity-100"
        }`}
      />
      <video
        ref={videoRef}
        src={reel.videoUrl}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />

      {/* Gradients for readable text */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 to-transparent" />

      {/* Top: game badge */}
      <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-purple-600 px-2 py-1 text-[10px] font-semibold text-white">
        <FaGamepad />
        {reel.game}
      </span>

      {/* Bottom: info */}
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <div className="mb-2 flex items-center gap-3 text-[11px] font-medium text-white/90">
          <span className="flex items-center gap-1">
            <FaPlay className="text-[9px]" />
            {formatCount(reel.views)}
          </span>
          <span className="flex items-center gap-1">
            <FaHeart className="text-[9px] text-rose-400" />
            {formatCount(reel.likes)}
          </span>
        </div>

        <p className="line-clamp-2 text-xs leading-snug">{reel.caption}</p>

        <div className="mt-2 flex items-center gap-1.5">
          <img
            src={reel.avatar}
            alt=""
            loading="lazy"
            className="h-6 w-6 rounded-full border border-white object-cover"
          />
          <span className="truncate text-xs font-semibold">{reel.username}</span>
        </div>
      </div>
    </Link>
  );
}

function ReelsSection() {
  const scrollerRef = useRef(null);

  const scrollByCards = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (reelsData.length === 0) return null;

  return (
    <section aria-label="Reels" className="my-6">
      {/* Headline */}
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reels</h2>
          <p className="text-sm text-gray-500">Quick gaming clips, clutches and funny moments</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Scroll arrows (desktop only) */}
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll left"
            className="hidden h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-purple-300 hover:text-purple-600 sm:grid"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Scroll right"
            className="hidden h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-purple-300 hover:text-purple-600 sm:grid"
          >
            <FaChevronRight className="text-sm" />
          </button>

          <Link
            to="/reels"
            className="group flex items-center gap-1.5 rounded-2xl bg-purple-50 px-3.5 py-2 text-sm font-medium text-purple-600 transition hover:bg-purple-100"
          >
            <span>View all</span>
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Reel cards (swipe left / right) */}
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {reelsData.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </section>
  );
}

export default ReelsSection;