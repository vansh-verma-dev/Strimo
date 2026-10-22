import { useEffect, useRef, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaShare,
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
  FaGamepad,
  FaEye,
} from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import vedioData from "../data/reels.json";

// 12450 -> 12.5K, 1200000 -> 1.2M
const formatCount = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

function ActionButton({ icon: Icon, label, onClick, active = false, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="group flex flex-col items-center gap-1"
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-full bg-black/40 text-xl backdrop-blur transition group-active:scale-90 ${
          active ? "text-rose-500" : "text-white"
        }`}
      >
        <Icon />
      </span>
      <span className="text-xs font-semibold text-white drop-shadow">{label}</span>
    </button>
  );
}

function ReelCard({ data, muted, onToggleMute }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(data.isLiked);
  const [likes, setLikes] = useState(data.likes);

  // Play only the reel that is mostly in view
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsPaused(false)).catch(() => setIsPaused(true));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const toggleLike = () => {
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/reels/${data.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: data.caption, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <article
      ref={cardRef}
      className="relative h-full w-full shrink-0 snap-start snap-always overflow-hidden rounded-2xl bg-black shadow-md"
    >
      <video
        ref={videoRef}
        src={data.videoUrl}
        poster={data.thumbnail}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onTimeUpdate={(e) => {
          const { currentTime, duration } = e.currentTarget;
          if (duration) setProgress((currentTime / duration) * 100);
        }}
        className="h-full w-full cursor-pointer object-cover"
      />

      {/* Paused indicator */}
      {isPaused && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-black/50 text-2xl text-white">
            <FaPlay className="ml-1" />
          </span>
        </div>
      )}

      {/* Gradients for readable text */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent" />

      {/* Top: game badge + mute */}
      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
          <FaGamepad />
          {data.game}
        </span>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur"
        >
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>

      {/* Right: actions */}
      <div className="absolute bottom-6 right-3 flex flex-col items-center gap-4">
        <ActionButton
          icon={liked ? FaHeart : FaRegHeart}
          label={formatCount(likes)}
          active={liked}
          onClick={toggleLike}
          ariaLabel={liked ? "Unlike" : "Like"}
        />
        <ActionButton
          icon={FaRegComment}
          label={formatCount(data.comments)}
          ariaLabel="Comments"
        />
        <ActionButton
          icon={FaShare}
          label={formatCount(data.shares)}
          onClick={handleShare}
          ariaLabel="Share"
        />
      </div>

      {/* Bottom: user info */}
      <div className="absolute bottom-5 left-4 right-20 text-white">
        <div className="flex items-center gap-2">
          <img
            src={data.avatar}
            alt={data.username}
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">{data.username}</p>
            <p className="text-xs text-white/70">{data.createdAt}</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-snug">{data.caption}</p>

        <p className="mt-1 flex flex-wrap gap-x-2 text-sm font-medium text-violet-300">
          {data.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
          <FaEye />
          {formatCount(data.views)} views
        </p>
      </div>

      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
        <div className="h-full bg-violet-500" style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}

function ReelsPage() {
  const [muted, setMuted] = useState(true); // browsers only autoplay muted videos

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex w-full">
        <Sidebar />

        <main className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 p-4 pb-20 sm:p-6 sm:pb-6">
          {vedioData.length === 0 ? (
            <p className="mt-20 text-center text-sm text-gray-500">
              No reels yet. Check back soon.
            </p>
          ) : (
            <div className="mx-auto h-[calc(100dvh-10rem)] w-full max-w-[400px] sm:h-[calc(100dvh-7rem)]">
              <div className="flex h-full snap-y snap-mandatory flex-col gap-4 overflow-y-scroll scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {vedioData.map((data) => (
                  <ReelCard
                    key={data.id}
                    data={data}
                    muted={muted}
                    onToggleMute={() => setMuted((prev) => !prev)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default ReelsPage;