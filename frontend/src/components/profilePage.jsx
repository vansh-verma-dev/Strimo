import { useState } from "react";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLink,
  FaGamepad,
  FaCoins,
  FaPlay,
  FaHeart,
  FaVideo,
  FaPlayCircle,
  FaInfoCircle,
  FaShare,
  FaPen,
  FaUserPlus,
  FaUserCheck,
  FaEnvelope,
  FaTrophy,
} from "react-icons/fa";
import BottomNav from "../components/bottomNav";
import Sidebar from "../components/sidebar";
import Navbar from  "../components/navbar";
import profile from "../data/profile.json";

// 245000 -> 245K, 1200000 -> 1.2M
const formatCount = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

const TABS = [
  { key: "reels", label: "Reels", icon: FaPlayCircle },
  { key: "videos", label: "Videos", icon: FaVideo },
  { key: "liked", label: "Liked", icon: FaHeart },
  { key: "about", label: "About", icon: FaInfoCircle },
];

function ReelGrid({ items }) {
  if (items.length === 0) {
    return <EmptyState text="Nothing here yet." />;
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-lg bg-gray-200 sm:rounded-xl"
        >
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[11px] font-semibold text-white sm:text-xs">
            <FaPlay className="text-[9px]" />
            {formatCount(item.views)}
          </span>
        </div>
      ))}
    </div>
  );
}

function VideoList({ items }) {
  if (items.length === 0) {
    return <EmptyState text="No videos uploaded yet." />;
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((video) => (
        <article key={video.id} className="group cursor-pointer">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-200">
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-purple-600 px-2.5 py-1 text-[11px] font-semibold text-white">
              <FaGamepad />
              {video.game}
            </span>
            <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
              {video.duration}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-purple-600">
            {video.title}
          </h3>
          <p className="text-xs text-gray-500">
            {formatCount(video.views)} views · {video.createdAt}
          </p>
        </article>
      ))}
    </div>
  );
}

function AboutTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Details</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-purple-500" />
            {profile.location}
          </li>
          <li className="flex items-center gap-3">
            <FaCalendarAlt className="text-purple-500" />
            Joined {profile.joinedAt}
          </li>
          {profile.links.map((link) => (
            <li key={link.label} className="flex items-center gap-3">
              <FaLink className="text-purple-500" />
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple-600 hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Achievements</h3>
        <ul className="space-y-3">
          {profile.badges.map((badge) => (
            <li key={badge.id} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-500">
                <FaTrophy />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{badge.label}</p>
                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="py-16 text-center text-sm text-gray-500">{text}</p>;
}

function ProfileContent({ isOwnProfile, onEdit }) {
  const [activeTab, setActiveTab] = useState("reels");
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(profile.stats.followers);
  const [copied, setCopied] = useState(false);

  const toggleFollow = () => {
    setFollowers((prev) => (following ? prev - 1 : prev + 1));
    setFollowing((prev) => !prev);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${profile.username}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: profile.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* user cancelled share */
    }
  };

  const stats = [
    { label: "Followers", value: followers },
    { label: "Following", value: profile.stats.following },
    { label: "Reels", value: profile.stats.reels },
    { label: "Likes", value: profile.stats.likes },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Banner */}
      <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 sm:h-48">
        <img
          src={profile.banner}
          alt=""
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Header */}
      <div className="px-2 sm:px-4">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className={`h-24 w-24 rounded-full border-4 border-white object-cover shadow-md sm:h-28 sm:w-28 ${
                  profile.isLive ? "ring-2 ring-rose-500" : ""
                }`}
              />
              {profile.isLive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  LIVE
                </span>
              )}
            </div>

            <div className="min-w-0 pb-1">
              <h1 className="flex items-center gap-1.5 text-xl font-bold text-gray-900 sm:text-2xl">
                <span className="truncate">{profile.name}</span>
                {profile.verified && (
                  <FaCheckCircle className="shrink-0 text-base text-purple-500" aria-label="Verified" />
                )}
              </h1>
              <p className="text-sm text-gray-500">@{profile.username}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <button
                type="button"
                onClick={onEdit}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 sm:flex-none"
              >
                <FaPen className="text-xs" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={toggleFollow}
                  aria-pressed={following}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition sm:flex-none ${
                    following
                      ? "border border-gray-300 bg-white text-gray-700 hover:border-rose-300 hover:text-rose-500"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {following ? <FaUserCheck /> : <FaUserPlus />}
                  {following ? "Following" : "Follow"}
                </button>
                <button
                  type="button"
                  aria-label="Message"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:border-purple-300 hover:text-purple-600"
                >
                  <FaEnvelope />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share profile"
              title={copied ? "Link copied!" : "Share profile"}
              className="grid h-10 w-10 place-items-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:border-purple-300 hover:text-purple-600"
            >
              <FaShare />
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-700">{profile.bio}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <FaMapMarkerAlt /> {profile.location}
          </span>
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt /> Joined {profile.joinedAt}
          </span>
        </div>

        {/* Favourite games */}
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.games.map((game) => (
            <span
              key={game}
              className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600"
            >
              <FaGamepad />
              {game}
            </span>
          ))}
        </div>

        {/* Stats + wallet */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-4 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white py-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2 text-center">
                <p className="text-lg font-bold text-gray-900 sm:text-xl">
                  {formatCount(stat.value)}
                </p>
                <p className="text-[11px] text-gray-500 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          {isOwnProfile && (
            <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/80">Your coins</p>
                  <p className="flex items-center gap-2 text-2xl font-bold">
                    <FaCoins className="text-amber-300" />
                    {profile.wallet.coins.toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  Level {profile.wallet.level}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${profile.wallet.levelProgress}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-white/80">
                {profile.wallet.levelProgress}% to Level {profile.wallet.level + 1}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Profile sections"
          className="mt-8 flex border-b border-gray-200"
        >
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(key)}
                className={`-mb-px flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-medium transition sm:flex-none sm:px-6 ${
                  active
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{active ? label : ""}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="py-5">
          {activeTab === "reels" && <ReelGrid items={profile.reels} />}
          {activeTab === "videos" && <VideoList items={profile.videos} />}
          {activeTab === "liked" && <ReelGrid items={profile.liked} />}
          {activeTab === "about" && <AboutTab />}
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  // Set to false when you show another user's profile
  const isOwnProfile = true;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex w-full">
        <Sidebar />

        <main className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 p-4 pb-20 sm:p-6 sm:pb-6">
          <ProfileContent
            isOwnProfile={isOwnProfile}
            onEdit={() => console.log("open edit profile")}
          />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default ProfilePage;