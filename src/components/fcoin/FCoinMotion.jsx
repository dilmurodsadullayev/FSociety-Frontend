
import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

// =========================================================
// REUSABLE MOTION CARD
//
// Replaces the original local MotionCard.
//
// Supports:
// - Scroll reveal
// - Optional reveal delay
// - Optional hover movement
// - Reduced-motion preference
// =========================================================

const FCoinMotion = ({
    children,
    delay = 0,
    className = "",
    hover = false,
}) => {
    const reducedMotion = Boolean(
        useReducedMotion()
    );

    return (
        <motion.div
            initial={
                reducedMotion
                    ? false
                    : {
                        y: 28,
                        opacity: 0,
                    }
            }

            whileInView={{
                y: 0,
                opacity: 1,
            }}

            viewport={{
                once: true,
                margin: "-60px",
            }}

            transition={{
                duration: reducedMotion ? 0 : 0.5,
                delay: reducedMotion ? 0 : delay,
                ease: "easeOut",
            }}

            whileHover={
                hover && !reducedMotion
                    ? { y: -4 }
                    : undefined
            }

            className={className}
        >
            {children}
        </motion.div>
    );
};

export default memo(FCoinMotion);
