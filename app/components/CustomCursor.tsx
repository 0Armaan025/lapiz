'use client';
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const follower = { x: 0, y: 0 };
    const speed = 0.15; // smaller = smoother, slower

    const moveCursor = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const animate = () => {
      // Smooth lerp for follower
      follower.x += (mouse.x - follower.x) * speed;
      follower.y += (mouse.y - follower.y) * speed;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${follower.x}px`;
        cursorRef.current.style.top = `${follower.y}px`;
      }

      if (followerRef.current) {
        followerRef.current.style.left = `${follower.x + 20}px`;
        followerRef.current.style.top = `${follower.y + 20}px`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", moveCursor);
    animate();

    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor2" />
    </>
  );
}
