'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type SlideInSectionProps = {
  children: React.ReactNode;
  from?: "left" | "right" | "top" | "bottom";
  w?: string;
  h?: string;
};

function SlideInSection(props: SlideInSectionProps) {
  const { children, from = "left" } = props;

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasMounted(true), 50); // slight delay to ensure animation triggers
    return () => clearTimeout(timeout);
  }, []);

  const variants = {
    left: { opacity: 0, x: -100, y: 0 },
    right: { opacity: 0, x: 50, y: 0 },
    top: { opacity: 0, x: 0, y: -100 },
    bottom: { opacity: 0, x: 0, y: 50 },
  };

  return (
    <motion.div
      style={{
        height: props.h || "unset",
        width: props.w || "unset",
      }}
      initial={variants[from]}
      animate={hasMounted ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

export default SlideInSection;