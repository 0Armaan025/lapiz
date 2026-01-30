"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./Scene";
import { motion } from "framer-motion";



export default function ExperienceScene() {
  return (
    <motion.div
      className="fixed inset-0 z-10"
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
  );
}

