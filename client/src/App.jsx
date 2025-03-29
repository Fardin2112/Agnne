import { useState, useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Setting from "./pages/Setting";
import Stats from "./pages/Stats";
import Sanitation from "./pages/Sanitation";
import Shutdown from "./pages/Shutdown";
import AgneeAnimation from "./components/AgneeAnimation"; // Import animation
import { AppContext } from "./context/AppContext";



function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Inside the component function, before return:
  const { isDarkMode } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => setShowAnimation(false), 3000); // Hide animation after 2s
  }, []);

  return (
    <>
      {showAnimation ? (
        <div className={`h-screen w-screen flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
          <AgneeAnimation />
        </div>
      ) : (
        <div className={`h-screen w-screen px-2 flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
          <div className="h-[10%]">
          <Navbar />
          </div>
          <div className="flex-grow overflow-auto h-[90%]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Setting />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/sanitation" element={<Sanitation />} />
              <Route path="/shutdown" element={<Shutdown />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
