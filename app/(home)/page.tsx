"use client";
import { Quattrocento_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import CrackTransition from "../components/CrackTransition";
import { motion } from "framer-motion";
import ExperienceScene from "../components/ExperienceScene";

const quattFont = Quattrocento_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [crack, setCrack] = useState(false);
  const [showScene, setShowScene] = useState(false);

  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    document.cookie = "experienceSeen=true; path=/; max-age=31536000";
    setShowGrid(true);
    setTimeout(() => {

      setCrack(true);


      setTimeout(() => {
        setShowScene(true);
      }, 3000);
    }, 800);


  };


  useEffect(() => {
    if (!showScene) return;

    const timer = setTimeout(() => {
      setEntered(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showScene]);


  useEffect(() => {
    if (!entered) return;

    const handler = () => {
      // trigger next phase (dashboard zoom)
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
    };
  }, [entered]);
  return (

    <>
      <div className="relative min-h-screen overflow-hidden bg-black">
        <motion.div
          className="relative z-20 min-h-screen flex flex-col justify-center items-center w-full text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{
            opacity: visible ? 0.90 : 0,
            y: visible ? 0 : 24,
            scale: crack ? 0.80 : 1.0,
            filter: crack ? "blur(2px)" : "blur(0px)",
          }}
          transition={{
            opacity: { duration: 0.6, ease: "easeOut" },
            y: { duration: 0.6, ease: "easeOut" },
            scale: { duration: 0.8, ease: "easeInOut" },
            filter: { duration: 0.5, ease: "easeOut" },
          }}
        >
          {/* subtle background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" />
          </div>

          {/* grid animation */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="grid"
                    width="50"
                    height="50"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 50 0 L 0 0 0 50"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="50 50"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </rect>
              </svg>
            </div>
          )}

          <div
            className={`relative max-w-2xl w-full text-center transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <h3
              className={`${quattFont.className} text-white/90 italic text-3xl leading-snug`}
            >
              Turn your GitHub into something{" "}
              <span className="text-white/50">worth</span> looking at.
            </h3>
            <div className="mt-8 flex gap-3">
              <input
                type="text"
                placeholder="github.com/username"
                className="
              flex-1 bg-white/5 border border-white/10
              text-white placeholder-white/30
              px-4 py-3 rounded-xl
              focus:outline-none focus:border-white/30
              transition
            "
                disabled={loading}
              />
              <button
                onClick={handleClick}
                disabled={loading}
                className={`${quattFont.className}
              px-5 py-3 rounded-xl
              text-white
              border-[0.5px] border-white/40
              hover:bg-white/90 hover:text-black
              font-semibold
              transition-all duration-200
              whitespace-nowrap
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
              >
                {loading ? "Loading…" : "Magic ✨"}
              </button>
            </div>
          </div>


        </motion.div>
        <CrackTransition show={crack} />

      </div>

      {showScene && <ExperienceScene />}

      {entered && (
        <motion.div
          className="fixed bottom-6 left-6 z-30 text-white/60 text-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          This is where your profile lives.
        </motion.div>
      )}
    </>
  );
};

export default Home;
