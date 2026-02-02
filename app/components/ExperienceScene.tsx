"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import Scene from "./Scene";
import { motion } from "framer-motion";

import { useState } from "react";
import { redirect } from "next/navigation";


export default function ExperienceScene() {


  const [expSeen, setExpSeen] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("expSeen") === "true";
  });

  // ✅ Side effects go here, not in render
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("expSeen", "true");
      redirect("/create");
    }, 15000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>

      {expSeen && (

        <button className="bg-black/80 fixed top-0 right-full p-4 rounded-lg hover:cursor-pointer transition-all hover:border-1 border-zinc-750">skip</button>
      )}

      <motion.div
        className="fixed inset-0 z-10 cursor-none!"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, zIndex: 99999 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>

          <fog attach="fog" args={["#0a0a0a", 6, 14]} />
          <color attach="background" args={["#0a0a0a"]} />
          <Scene />
        </Canvas>
      </motion.div>
    </>

  );

}

