"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export function LoadingScreen({
  isLoading,
  onLoadingComplete,
}: LoadingScreenProps) {
  const [showLoader, setShowLoader] = useState(isLoading);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let loadCompleteTimeout: NodeJS.Timeout;

    if (isLoading) {
      // Reset to initial state
      setShowLoader(true);
      setProgress(0);

      // Gradually increase progress with a more natural curve
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          // Create a more organic progress curve
          if (prevProgress < 40) {
            return prevProgress + 15; // Quick initial progress
          } else if (prevProgress < 70) {
            return prevProgress + 8; // Moderate progress
          } else if (prevProgress < 90) {
            return prevProgress + 4; // Slowing down
          } else if (prevProgress < 98) {
            return prevProgress + 1; // Crawling to 100%
          } else {
            clearInterval(progressInterval);
            return 100;
          }
        });
      }, 100);

      // Fallback to ensure loading completes
      loadCompleteTimeout = setTimeout(() => {
        setShowLoader(false);
        setProgress(0);
        onLoadingComplete?.();
      }, 3000);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (loadCompleteTimeout) clearTimeout(loadCompleteTimeout);
    };
  }, [isLoading, onLoadingComplete]);

  // Handle hiding the loader when loading is complete
  useEffect(() => {
    if (!isLoading && showLoader) {
      const hideTimeout = setTimeout(() => {
        setShowLoader(false);
        setProgress(0);
        onLoadingComplete?.();
      }, 500);

      return () => clearTimeout(hideTimeout);
    }
  }, [isLoading, showLoader, onLoadingComplete]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center">
            {/* Wolf claw design forming RW */}
            <div className="relative h-40 w-40">
              {/* Background grid with subtle primary color */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-primary/20"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
              {/* RW Claw Marks */}
              <motion.svg
                viewBox="0 0 180 120"
                className="absolute inset-0 h-full w-full"
              >
                {/* R Letter */}
                <motion.path
                  d="M10 100 
        L10 20 
        L50 20 
        Q65 35, 65 50 
        Q65 65, 50 75 
        L10 75
        L65 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                  initial={{
                    pathLength: 0,
                    strokeWidth: 2,
                  }}
                  animate={{
                    pathLength: 1,
                    strokeWidth: [2, 5, 3],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                />

                {/* W Letter */}
                <motion.path
                  d="M90 20
       L100 100
       L120 50
       L140 100
       L150 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                  initial={{
                    pathLength: 0,
                    strokeWidth: 2,
                  }}
                  animate={{
                    pathLength: 1,
                    strokeWidth: [2, 5, 3],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                />
              </motion.svg>

              {/* Animated orbiting accents */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
              >
                {[...Array(4)].map((_, i) => {
                  const angle = (i * 90 * Math.PI) / 180;
                  const x = 50 + 35 * Math.cos(angle);
                  const y = 50 + 35 * Math.sin(angle);
                  const delay = i * 0.2;

                  return (
                    <motion.circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="currentColor"
                      className="text-primary"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        delay,
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 1,
                      }}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Progress bar */}
            <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 0.1,
                  ease: "linear",
                }}
              />
            </div>

            {/* Loading text */}
            <motion.p
              className="mt-4 text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Unleashing the Rogue Wolf...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
