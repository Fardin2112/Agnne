import { useState, useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Setting from "./pages/Setting";
import Stats from "./pages/Stats";
import Sanitation from "./pages/Sanitation/Sanitation";
import AgneeAnimation from "./components/AgneeAnimation";
import { UserContext } from "./context/UserContext";
import { AppContext } from "./context/AppContext";

function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const { isDarkMode } = useContext(UserContext);
  const { toggleHome } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => setShowAnimation(false), 4000); // Hide animation after 4s
  }, []);

  return (
    <div
      className={`h-screen w-screen flex flex-col ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-black text-white"
          : "bg-gray-50 text-black"
      }`}
    >
      {showAnimation ? (
        <div className="h-full w-full flex flex-col">
          <AgneeAnimation />
        </div>
      ) : (
        <>
          {/* Only show Navbar if toggleHome is false */}
          {!toggleHome && (
            <div className="h-[10%] flex-shrink-0">
              <Navbar />
            </div>
          )}

          <div className="flex-grow overflow-auto min-h-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Setting />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/sanitation" element={<Sanitation />} />
            </Routes>
          </div>

          {/* Only show Footer if toggleHome is false */}
          {!toggleHome && (
            <div className="flex-shrink-0">
              <Footer />
            </div>
          )}
        </>
      )}
    </div>
  );
}


export default App;