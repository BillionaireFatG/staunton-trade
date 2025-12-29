"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollAnimation = ({ children, className = "" }: ScrollAnimationProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeInOnScroll = ({ children, className = "", delay = 0 }: ScrollAnimationProps & { delay?: number }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};







