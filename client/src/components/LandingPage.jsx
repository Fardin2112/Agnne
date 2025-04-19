import React, { useRef, useEffect } from "react";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const rotateX = (mouseY - centerY) / 20;
      const rotateY = (centerX - mouseX) / 20;

      image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
    };

    const handleMouseLeave = () => {
      image.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // const handleStartClick = () => {
  //   buttonRef.current.style.transform = "scale(0.95)";
  //   setTimeout(() => {
  //     buttonRef.current.style.transform = "scale(1)";
  //     navigate("/session")
  //   }, 100);
  // };


  return (
    <div
      ref={containerRef}
      className="relative h-full w-screen overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="flex justify-evenly items-center w-full h-full">
        <div className="">
          <h1 className="text-5xl text-[#ACACAC] font-playfair">
            Explore Your <br/>Session
          </h1>
          {/* <button
            ref={buttonRef}
            onClick={handleStartClick}
            className="mt-8 gap-2 px-3 py-2 rounded-full border-1 border-[#303030] bg-white text-[#4B5563]   flex items-center text-xl duration-200 transform hover:scale-105"
          >
            Start Now
            <HiArrowRightStartOnRectangle className="text-6xl text-[#2B2E48]" />
          </button> */}
        </div>
        <img
          ref={imageRef}
          src="https://wallpapers.com/images/hd/hospital-mri-machine-png-10-4yuszj07pxl04xwx.jpg"
          alt="3D Landing"
          className="w-[350px] h-[350px] object-cover transition-transform duration-200 ease-in-out"
        />
      </div>
    </div>
  );
}

export default LandingPage;