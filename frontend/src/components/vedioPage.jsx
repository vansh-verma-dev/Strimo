import { useCallback, useEffect, useRef, useState } from "react";
import { FaGamepad, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VedioData from "../data/vedio.json";

// 185000 -> 185K, 1200000 -> 1.2M
const formatCount = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

function VedioCard({ data }) {
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
    <article
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      className="group w-[260px] shrink-0 cursor-pointer snap-start sm:w-[300px]"
    >
      {/* Thumbnail / preview */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-200">
        <img
          src={data.thumbnail}
          alt={data.caption}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            hovering ? "opacity-0" : "opacity-100"
          }`}
        />
        <video
          ref={videoRef}
          src={data.videoUrl}
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover"
        />

        <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-violet-600 px-2.5 py-1 text-[11px] font-semibold text-white">
          <FaGamepad />
          {data.game}
        </span>
      </div>

      {/* Info */}
      <div className="mt-3 flex gap-3">
        <img
          src={data.avatar}
          alt={data.username}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-violet-600">
            {data.title}
          </h2>
          <p className="mt-1 text-sm text-gray-600">{data.creator}</p>
          <p className="text-xs text-gray-500">
            {formatCount(data.views)} views · {data.createdAt}
          </p>
        </div>
      </div>
    </article>
  );
}

function ArrowButton({ direction, onClick }) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "Scroll left" : "Scroll right"}
      className={`absolute top-[22%] z-10 hidden h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:bg-violet-50 hover:text-violet-600 sm:grid ${
        isLeft ? "-left-3" : "-right-3"
      }`}
    >
      {isLeft ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
  );
}

function VedioSection() {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Show an arrow only when there is more to scroll in that direction
  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  const scrollByCards = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (VedioData.length === 0) {
    return (
      <p className="mt-20 text-center text-sm text-gray-500">
        No videos yet. Check back soon.
      </p>
    );
  }

  return (
    <section aria-label="Videos">
      <h1 className="mb-4 text-xl font-bold text-gray-900">Recommended</h1>

      <div className="relative">
        {canScrollLeft && (
          <ArrowButton direction="left" onClick={() => scrollByCards(-1)} />
        )}

        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {VedioData.map((data) => (
            <VedioCard key={data.id} data={data} />
          ))}
        </div>

        {canScrollRight && (
          <ArrowButton direction="right" onClick={() => scrollByCards(1)} />
        )}
      </div>
    </section>
  );
}

export default VedioSection;