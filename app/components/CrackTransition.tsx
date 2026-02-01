import { motion } from "framer-motion";

export default function CrackTransition({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 overflow-hidden pointer-events-none cursor-none"
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

      {/* SOLO LEVELING GATE - Spiraling Galaxy Effect */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={{ scale: 1, rotate: 360, opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.4 }
        }}
      >
        {/* Outer glow rings */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 30%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Middle intense glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(96, 165, 250, 0.5) 0%, rgba(59, 130, 246, 0.3) 40%, transparent 70%)",
            filter: "blur(25px)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Core spiral vortex */}
        <motion.svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          width="300"
          height="300"
          viewBox="0 0 300 300"
          fill="none"
        >
          <defs>
            <radialGradient id="spiralGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#2563eb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Spiral arms - multiple layers for depth */}
          {[0, 72, 144, 216, 288].map((rotation, i) => (
            <motion.g key={i}>
              <motion.path
                d="M 150 150 Q 180 120, 220 110 Q 250 100, 270 120 Q 280 140, 275 160"
                stroke="url(#spiralGrad)"
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: [0, 1, 0.7],
                  rotate: [rotation, rotation + 360]
                }}
                transition={{
                  pathLength: { duration: 1, delay: i * 0.1 },
                  opacity: { duration: 1, delay: i * 0.1 },
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
                style={{ transformOrigin: "150px 150px" }}
              />
            </motion.g>
          ))}

          {/* Inner spiraling particles */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const radius = 50 + (i * 8);
            const x = 150 + Math.cos(angle) * radius;
            const y = 150 + Math.sin(angle) * radius;

            return (
              <motion.circle
                key={`particle-${i}`}
                cx={x}
                cy={y}
                r="2"
                fill="#60a5fa"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            );
          })}

          {/* Central vortex */}
          <motion.circle
            cx="150"
            cy="150"
            r="40"
            fill="url(#spiralGrad)"
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: [0, 1, 0.8]
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.svg>

        {/* Rotating runes/symbols around the gate */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            const x = Math.cos(angle) * 180;
            const y = Math.sin(angle) * 180;

            return (
              <motion.div
                key={`rune-${i}`}
                className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                style={{
                  background: "radial-gradient(circle, #60a5fa, transparent)",
                  transform: `translate(${x}px, ${y}px)`,
                  boxShadow: "0 0 10px #3b82f6, 0 0 20px #3b82f6"
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 3,
                  delay: 0.5 + (i * 0.1),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </motion.div>
      </motion.div>

      {/* light leak - enhanced */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-[800px] h-[800px] bg-blue-400/15 blur-[160px]" />
      </motion.div>

      {/* crack svg — TOP LAYER */}
      <motion.svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        width="400"
        height="800"
        viewBox="0 0 400 800"
        fill="none"
      >
        <defs>
          <filter id="crackGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M200 0 L190 120 L210 240 L185 360 L215 520 L195 680 L205 800"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#crackGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.div>
  );
}
