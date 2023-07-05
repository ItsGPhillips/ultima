"use client"

import { motion } from 'framer-motion';

export const Spinner = () => {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="aspect-square h-full"
      animate={{
        rotateZ: [0, 360],
        transition: {
          duration: 1.2 * 3,
          repeat: Infinity,
        },
      }}
    >
      <circle
        cx="50"
        cy="50"
        r="42"
        strokeWidth={'0.75rem'}
        className="overflow-visible fill-transparent stroke-white/50"
      />
      <motion.circle
        cx="50"
        cy="50"
        r="42"
        strokeWidth={'0.6rem'}
        className="overflow-visible fill-transparent stroke-neutral-50"
        initial={{}}
        animate={{
          rotate: [0, 360],
          pathLength: [0.2, 0.5, 0.2],
          transition: {
            repeat: Infinity,
            ease: 'easeInOut',
            duration: 1.2,
          },
        }}
      />
    </motion.svg>
  );
};
