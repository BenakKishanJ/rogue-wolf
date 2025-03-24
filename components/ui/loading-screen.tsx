"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
  progress?: number;
  onLoadingComplete?: () => void;
}

export function LoadingScreen({
  isLoading,
  progress: externalProgress,
  onLoadingComplete,
}: LoadingScreenProps) {
  const [showLoader, setShowLoader] = useState(isLoading);
  const [progress, setProgress] = useState(0); // Internal progress state

  useEffect(() => {
    if (!isLoading && showLoader) {
      const timeout = setTimeout(() => {
        setShowLoader(false);
        setProgress(0); // Reset progress when hiding
        onLoadingComplete?.();
      }, 500);
      return () => clearTimeout(timeout);
    }

    if (isLoading && !showLoader) {
      setShowLoader(true);
    }
  }, [isLoading, showLoader, onLoadingComplete]);

  // Animate progress bar to complete in 1 second
  useEffect(() => {
    if (isLoading && showLoader) {
      setProgress(0); // Start at 0
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5; // Increment by 5% every 50ms to finish in 1 second
        });
      }, 50); // 50ms interval (20 steps in 1 second)

      return () => clearInterval(interval);
    }
  }, [isLoading, showLoader]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center">
            {/* Wolf claw design */}
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

              {/* Wolf claw marks */}
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                initial={{ opacity: 0.5, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                {/* Claw marks (three sharp slashes) */}
                <path
                  d="M30 20 Q35 30 25 60 Q20 70 30 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-primary"
                />
                <path
                  d="M50 15 Q55 25 45 65 Q40 75 50 85"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="text-primary"
                />
                <path
                  d="M70 20 Q75 30 65 60 Q60 70 70 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-primary"
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
                transition={{ duration: 0.05 }} // Smooth transition for each step
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
