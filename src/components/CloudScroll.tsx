"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

type CloudScrollerProps = {
  children: ReactNode;
};

type CloudProps = {
  opacity?: number;
  scale?: number;
  rotation?: number;
};

const Cloud = ({ opacity = 0.6, scale = 1.5, rotation = 0 }: CloudProps) => (
  <svg
    width={200 * scale}
    height={120 * scale}
    viewBox="0 0 120 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <path
      d="M30 60C20 65 5 60 5 45C5 30 20 25 30 30C30 20 45 10 60 20C65 10 85 10 90 25C100 25 110 35 110 45C110 60 90 65 80 60H30Z"
      fill="white"
      fillOpacity={opacity}
      style={{
        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.15))",
      }}
    />
  </svg>
);

const random = (min: number, max: number) => Math.random() * (max - min) + min;

type CloudInstance = {
  id: string;
  y: number;
  side: "left" | "right";
  opacity: number;
  scale: number;
  rotation: number;
  floatDelay: number;
  floatDuration: number;
};

const FloatingCloud = ({
  y,
  side,
  opacity,
  scale,
  rotation,
  floatDelay,
  floatDuration,
}: CloudInstance) => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "0px 0px -50% 0px" });

  const xIn = useRef(side === "left" ? random(-60, -20) : random(10, 50));
  const xOut = useRef(side === "left" ? random(-10, -5) : random(5, 10));

  const x = inView ? `${xIn.current}vw` : `${xOut.current}vw`;
  const displayOpacity = inView ? opacity : opacity * 0.4;
  const displayScale = inView ? scale * 1.2 : scale * 0.9;

  return (
    <motion.div
      ref={ref}
      style={{
        position: "absolute",
        top: y,
        left: "50%",
        zIndex: 10,
        pointerEvents: "none",
        padding: 20,
        borderRadius: "50%",
        willChange: "transform",
      }}
      animate={{
        x,
        opacity: displayOpacity,
        scale: displayScale,
        y: [0, 30, 0],
      }}
      transition={{
        x: { duration: 0.8, ease: "easeOut" },
        opacity: { duration: 0.6 },
        scale: { duration: 0.5 },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        },
      }}
    >
      <Cloud scale={1} opacity={1} rotation={rotation} />
    </motion.div>
  );
};

export default function CloudScroller({ children }: CloudScrollerProps) {
  const [clouds, setClouds] = useState<CloudInstance[]>([]);

  const generateClouds = useCallback(() => {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      6000
    );

    const spacing = 150;
    const total = Math.ceil(height / spacing) * 1.5;

    const newClouds: CloudInstance[] = [];

    for (let i = 0; i < total; i++) {
      newClouds.push({
        id: `cloud-${i}`,
        y: i * spacing + random(-50, 50),
        side: i % 4 < 2 ? "left" : "right",
        opacity: random(0.5, 0.8),
        scale: random(1.0, 1.3),
        rotation: random(-12.5, 12.5),
        floatDelay: random(0, 4),
        floatDuration: random(6, 10),
      });
    }

    setClouds(newClouds);
  }, []);

  useEffect(() => {
    generateClouds();

    const onResize = debounce(generateClouds, 300);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [generateClouds]);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/blurry-gradient-haikei.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Cloud Layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {clouds.map((cloud) => (
          <FloatingCloud key={cloud.id} {...cloud} />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
    </div>
  );
}
