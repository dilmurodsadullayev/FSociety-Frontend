
import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import FCoinImage from "../../assests/coin/fcoin.png";

// =========================================================
// FLOATING COIN CONFIG
//
// Same 14-coin pattern from the original FCoin.jsx.
//
// Created once at module load, not on every render.
// =========================================================

const FLOATING_COINS = Array.from(
    { length: 14 },
    (_, index) => {
        const size = 22 + ((index * 13) % 42);
        const left = (index * 19) % 100;
        const delay = (index * 0.55) % 6;
        const duration = 12 + ((index * 7) % 10);
        const blur = index % 3 === 0 ? "1.5px" : "0px";
        const opacity = index % 2 === 0 ? 0.18 : 0.1;

        return {
            id: index,
            delay,
            duration,
            opacity,
            style: {
                width: `${size}px`,
                left: `${left}%`,
                filter: `blur(${blur}) drop-shadow(0 0 16px rgba(250, 204, 21, 0.35))`,
            },
            transition: {
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
            },
            animation: {
                y: "-125vh",
                opacity: [0, opacity, opacity, 0],
                rotate: 360,
            },
        };
    }
);

const COIN_INITIAL = {
    y: 0,
    opacity: 0,
    rotate: 0,
};

// =========================================================
// FLOATING COIN ITEM
// =========================================================

const FloatingCoin = memo(function FloatingCoin({
    coin,
}) {
    return (
        <motion.img
            src={FCoinImage}
            alt=""
            aria-hidden="true"
            draggable={false}
            decoding="async"

            initial={COIN_INITIAL}
            animate={coin.animation}
            transition={coin.transition}

            style={coin.style}

            className="
                absolute
                bottom-[-90px]

                h-auto
                max-w-none

                select-none
                object-contain

                will-change-transform
            "
        />
    );
});

// =========================================================
// FLOATING COINS BACKGROUND
//
// Fixed to the viewport so coins do not start
// from the bottom of a very long page.
//
// Always behind foreground content.
// Never captures pointer events.
// =========================================================

const FCoinFloatingCoins = () => {
    const reducedMotion = Boolean(
        useReducedMotion()
    );

    if (reducedMotion) {
        return null;
    }

    return (
        <div
            aria-hidden="true"
            className="
                pointer-events-none
                fixed
                inset-0
                z-0

                overflow-hidden

                select-none
            "
        >
            {FLOATING_COINS.map((coin) => (
                <FloatingCoin
                    key={coin.id}
                    coin={coin}
                />
            ))}
        </div>
    );
};

export default memo(FCoinFloatingCoins);
