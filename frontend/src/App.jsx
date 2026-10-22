import { Route, Routes } from "react-router"
import HomePage from "./pages/homepage"
import ReelsPage from "./pages/reelPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Reels" element={<ReelsPage />} />
      </Routes>
    </>
  )
}

export default App