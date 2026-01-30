import { motion } from "framer-motion";

export default function CrackTransition({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.85 }}
      transition={{ duration: 0.2 }}
    >
      {/* side pull masks */}
      <motion.div
        className="absolute left-0 top-0 w-1/2 h-[150vh] bg-black"
        initial={{ x: 0 }}
        animate={{ x: -20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      <motion.div
        className="absolute right-0 top-0 w-1/2 h-full bg-black"
        initial={{ x: 0 }}
        animate={{ x: 20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* light leak */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-[600px] h-[600px] bg-blue-400/20 blur-[140px]" />
      </motion.div>

      {/* crack svg — TOP LAYER */}
      <motion.svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        width="400"
        height="800"
        viewBox="0 0 400 800"
        fill="none"
      >
        <motion.path
          d="M200 0 L190 120 L210 240 L185 360 L215 520 L195 680 L205 800"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </motion.svg>

    </motion.div>
  );
}
