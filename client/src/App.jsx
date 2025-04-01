import { useState, useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Setting from "./pages/Setting";
import Stats from "./pages/Stats";
import Sanitation from "./pages/Sanitation";
import Shutdown from "./pages/Shutdown";
import AgneeAnimation from "./components/AgneeAnimation";
import { AppContext } from "./context/AppContext";

function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const { isDarkMode } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => setShowAnimation(false), 4000); // Hide animation after 4s
  }, []);

  return (
    <div
      className={`h-screen w-screen flex flex-col ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {showAnimation ? (
        <div className="h-full w-full flex flex-col">
          <AgneeAnimation />
        </div>
      ) : (
        <>
          <div className="h-[10%] flex-shrink-0">
            <Navbar />
          </div>
          <div className="flex-grow overflow-auto min-h-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Setting />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/sanitation" element={<Sanitation />} />
              <Route path="/shutdown" element={<Shutdown />} />
            </Routes>
          </div>
          <div className="flex-shrink-0">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}

export default App;