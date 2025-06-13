"use client";

import { useInViewport } from "@mantine/hooks";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

type CloudScrollerProps = {
  children: ReactNode;
};

// Enhanced Cloud SVG
const Cloud = ({ 
  opacity = 0.6, 
  scale = 1.5, 
  rotation = 0 
}: { 
  opacity?: number; 
  scale?: number; 
  rotation?: number; 
}) => (
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

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Individual cloud with Mantine viewport detection
const ViewportReactiveCloud = ({
  absoluteY,
  side,
  opacity,
  scale,
  rotation,
  floatDelay,
  floatDuration,
}: {
  absoluteY: number;
  side: 'left' | 'right';
  opacity: number;
  scale: number;
  rotation: number;
  floatDelay: number;
  floatDuration: number;
  id: string;
}) => {
  const { ref, inViewport } = useInViewport();
  // Override x position when in viewport
const inViewportX = inViewport
  ? side === 'left'
    ? `${randomBetween(-60, -20)}vw`   // randomized between -60vw and -40vw
    : `${randomBetween(10, 50)}vw`     // randomized between 30vw and 50vw
  : side === 'left'
  ? `${randomBetween(-10, -5)}vw`      // randomized between -10vw and -5vw
  : `${randomBetween(5, 10)}vw`;       // randomized between 5vw and 10vw

  // Smooth opacity transition
  const targetOpacity = inViewport ? opacity : opacity * 0.4;
  
  // Scale effect when in viewport
  const targetScale = inViewport ? scale * 1.2 : scale * 0.9;

  return (
    <motion.div
      ref={ref}
      style={{
        position: "absolute",
        top: absoluteY,
        left: "50%",
        zIndex: 10, // Higher z-index to appear above backgrounds
        pointerEvents: "none",
        willChange: "transform",
        borderRadius: "50%", // Makes the gradient background more cloud-like
        padding: "20px", // Some padding so the gradient extends beyond the SVG
      }}
      animate={{
        x: inViewportX,
        opacity: targetOpacity,
        scale: targetScale,
        y: [0, 30, 0], // Floating animation
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
        }
      }}
    >
      <Cloud 
        opacity={1} // Using animated opacity instead
        scale={1}   // Using animated scale instead
        rotation={rotation}
      />
    </motion.div>
  );
};

type CloudConfig = {
  id: string;
  absoluteY: number;
  side: 'left' | 'right';
  opacity: number;
  scale: number;
  rotation: number;
  floatDelay: number;
  floatDuration: number;
};

export default function CloudScroller({ children }: CloudScrollerProps) {
  const [clouds, setClouds] = useState<CloudConfig[]>([]);

  // Generate clouds based on content height
  useEffect(() => {
    const generateClouds = () => {
      // Wait for content to render
      setTimeout(() => {
        const contentHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          6000 // Minimum height to ensure plenty of clouds
        );

        const cloudConfigs: CloudConfig[] = [];
        const cloudSpacing = 150; // Even closer spacing for more frequent interactions
        const numClouds = Math.ceil(contentHeight / cloudSpacing) * 1.5;

        for (let i = 0; i < numClouds; i++) {
          // Alternate sides with some clustering
          const side = (Math.floor(i / 2) % 2 === 0) ? 'left' : 'right';
          
          cloudConfigs.push({
            id: `cloud-${i}`,
            absoluteY: i * cloudSpacing + (Math.random() * 100 - 50),
            side,
            opacity: Math.random() * 0.3 + 0.5,   // 0.5-0.8 (very visible)
            scale: Math.random() * 0.3 + 1.0,     // 1.0-1.3
            rotation: Math.random() * 25 - 12.5,  // -12.5 to 12.5 degrees
            floatDelay: Math.random() * 4,
            floatDuration: 6 + Math.random() * 4   // 6-10 seconds
          });
        }
        
        setClouds(cloudConfigs);
      }, 300);
    };

    generateClouds();

    // Regenerate on window resize
    const handleResize = () => generateClouds();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/blurry-gradient-haikei.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
      }}
    >

      {/* Clouds container: absolutely positioned and behind content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",  // so clicks go through clouds
          zIndex: 1,              // low z-index so behind content
        }}
      >
        {clouds.map((cloud) => (
          <ViewportReactiveCloud
            key={cloud.id}
            absoluteY={cloud.absoluteY}
            side={cloud.side}
            opacity={cloud.opacity}
            scale={cloud.scale}
            rotation={cloud.rotation}
            floatDelay={cloud.floatDelay}
            floatDuration={cloud.floatDuration}
            id={cloud.id}
          />
        ))}
      </div>

      {/* Content container: relative with higher z-index */}
      <div
        style={{
          position: "relative",
          zIndex: 10, // content always above clouds
        }}
      >
        {children}
      </div>
    </div>
  );
}