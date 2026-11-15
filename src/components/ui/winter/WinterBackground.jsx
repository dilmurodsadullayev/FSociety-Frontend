
import React, { memo, useState } from "react";
import PageGridBackground from "../PageGridBackground";

// =========================================================
// FSOCIETY — WINTER BACKGROUND CONFIGURATION
// =========================================================

const LIGHT_IMAGE = "/images/winter/winter-light.webp";
const DARK_IMAGE = "/images/winter/winter-dark.webp";

const LIGHT_BACKGROUND = "#eaf5ff";
const DARK_BACKGROUND = "#061321";

// =========================================================
// FSOCIETY — WINTER BACKGROUND
// =========================================================

const WinterBackground = memo(function WinterBackground({
    enabled = true,
    showMonogram = true,
    showCubes = true,
}) {

    // =====================================================
    // IMAGE LOADING STATES
    // =====================================================

    const [lightLoaded, setLightLoaded] = useState(false);
    const [darkLoaded, setDarkLoaded] = useState(false);

    // =====================================================
    // DEFAULT BACKGROUND
    //
    // Winter mode o'chirilganda eski PageGridBackground
    // ishlashda davom etadi.
    // =====================================================

    if (!enabled) {
        return (
            <PageGridBackground
                showMonogram={showMonogram}
                showCubes={showCubes}
            />
        );
    }

    // =====================================================
    // WINTER BACKGROUND RENDER
    // =====================================================

    return (
        <div
            aria-hidden="true"
            className="
                fixed
                inset-0
                z-0

                isolate
                overflow-hidden

                pointer-events-none
                select-none

                bg-[#eaf5ff]
                dark:bg-[#061321]
            "
        >

            {/* ============================================
                1. LIGHT MODE FALLBACK

                Rasm yuklanmaganda ko'rinadi.
            ============================================ */}

            <div
                className="
                    absolute
                    inset-0

                    dark:hidden

                    bg-[#eaf5ff]
                "
            />


            {/* ============================================
                2. DARK MODE FALLBACK

                Dark mode uchun asosiy fon.
            ============================================ */}

            <div
                className="
                    absolute
                    inset-0

                    hidden
                    dark:block

                    bg-[#061321]
                "
            />


            {/* ============================================
                3. LIGHT MODE IMAGE

                Mobile:
                - Original image width 100%
                - Natural aspect ratio
                - No cropping

                Tablet:
                - Original image proportions preserved

                Desktop:
                - Full viewport image
                - Cover behavior
                - Top centered positioning
            ============================================ */}

            <div
                className="
                    absolute
                    inset-x-0
                    top-0

                    xl:inset-0

                    dark:hidden
                "
            >
                <img
                    src={LIGHT_IMAGE}
                    alt=""
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    draggable={false}
                    onLoad={() => setLightLoaded(true)}
                    onError={() => setLightLoaded(false)}
                    className="
                        block

                        w-full
                        h-auto
                        max-w-none

                        xl:w-full
                        xl:h-full

                        xl:object-cover
                        xl:object-top

                        transition-opacity
                        duration-700
                        ease-out
                    "
                    style={{
                        opacity: lightLoaded ? 1 : 0,
                    }}
                />
            </div>


            {/* ============================================
                4. DARK MODE IMAGE

                Mobile:
                - Original image width 100%
                - Natural aspect ratio
                - No cropping

                Tablet:
                - Original image proportions preserved

                Desktop:
                - Full viewport image
                - Cover behavior
                - Top centered positioning
            ============================================ */}

            <div
                className="
                    absolute
                    inset-x-0
                    top-0

                    xl:inset-0

                    hidden
                    dark:block
                "
            >
                <img
                    src={DARK_IMAGE}
                    alt=""
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    draggable={false}
                    onLoad={() => setDarkLoaded(true)}
                    onError={() => setDarkLoaded(false)}
                    className="
                        block

                        w-full
                        h-auto
                        max-w-none

                        xl:w-full
                        xl:h-full

                        xl:object-cover
                        xl:object-top

                        transition-opacity
                        duration-700
                        ease-out
                    "
                    style={{
                        opacity: darkLoaded ? 1 : 0,
                    }}
                />
            </div>


            {/* ============================================
                5. LIGHT MODE ATMOSPHERE

                Rasm pastki qismi sahifa foniga
                yumshoq o'tishini ta'minlaydi.
            ============================================ */}

            <div
                className="
                    absolute
                    inset-0

                    dark:hidden

                    bg-gradient-to-b

                    from-transparent
                    via-transparent
                    to-[#eaf5ff]/90
                "
            />


            {/* ============================================
                6. DARK MODE ATMOSPHERE

                Dark mode uchun yumshoq gradient.
            ============================================ */}

            <div
                className="
                    absolute
                    inset-0

                    hidden
                    dark:block

                    bg-gradient-to-b

                    from-transparent
                    via-transparent
                    to-[#061321]/90
                "
            />


            {/* ============================================
                7. LIGHT MODE DIGITAL GLOW
            ============================================ */}

            <div
                className="
                    absolute
                    inset-0

                    dark:hidden

                    bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(30,100,150,0.07)_100%)]
                "
            />


            {/* ============================================
                8. DARK MODE DIGITAL GLOW
            ============================================ */}

            <div
                className="
                    absolute
                    inset-0

                    hidden
                    dark:block

                    bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.22)_100%)]
                "
            />

        </div>
    );
});

// =========================================================
// EXPORT
// =========================================================

export default WinterBackground;
