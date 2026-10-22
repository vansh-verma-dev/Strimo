import { Outlet } from "react-router";
import BottomNav from "../components/bottomNav";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import VedioSection from "../components/vedioPage";
import OfferSection from "../components/offer";
import StreamerSection from "../components/strimer";
import ReelsSection from "../components/reelsection";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />

        <main className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 p-4 pb-20 sm:p-6 sm:pb-6">
          <Outlet />
          <VedioSection />
          <OfferSection />
          <StreamerSection />
          <ReelsSection/>
        </main>
      </div>

      <BottomNav/>
    </div>
  );
}

export default HomePage;