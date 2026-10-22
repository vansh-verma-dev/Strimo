import { Route, Routes } from "react-router"
import HomePage from "./pages/homepage"
import ReelsPage from "./pages/reelPage"
import ProfilePage from "./components/profilePage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Reels" element={<ReelsPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
      </Routes>
    </>
  )
}

export default App